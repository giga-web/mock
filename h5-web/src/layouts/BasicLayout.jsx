import React, { Fragment } from 'react';

/* 样式 */
import styles from './BasicLayout.m.less';

/* 对象/数组 */
const typestart = {
  '[object Object]': '{',
  '[object Array]': '[',
};

const typeend = {
  '[object Object]': '}',
  '[object Array]': ']',
};

const separator = ',';

/* 替换空格 */
function trimAll(str, rep) {
  return str.replace(/\s+/g, rep);
}

// 单引号变双引号
function doubleQuotation(value) {
  return value.replace(/\'/g, '"');
}

// 删除引号
function deleteQuotation(value) {
  return value.replace(/['|"]/g, '');
}

/* JSON 化 */
function resultJson(value) {
  let result = [];

  // 替换多余的逗号
  const temp = value.replace(/(,})/g, '}').replace(/(,])/g, ']');
  // console.log(temp);

  try {
    // 递归注释
    result = JSON.parse(temp);
  } catch (err) {
    console.log(err);
  }

  return result;
}

/* 格式化-头部 */
function formatBaseInfo(value) {
  // 过滤无效行，得到有效行
  const lineValid = value.filter(line => (trimAll(line, '') !== ''));

  // 请求方法，请求地址
  const request = trimAll(lineValid[1], ' ').split(' ');
  
  return {
    title: lineValid[0],
    method: request[0],
    url: request[1],
  };
}

/* 格式化-头部，参数，返回值 */
function formatJson(value, mark) {

  let result = '';

  for (let i = 0; i < value.length; i++) {
    const line = trimAll(value[i], '');

    // 发现无效行，跳过
    if (line === '' || line === ('#' + mark)) {
      continue;
    }

    // 有注释
    const annotation = /\/\//.test(line);
    // 有冒号
    const colon = /:/.test(line);

    // 有冒号，有注释
    if (colon && annotation) {
      // 以注释分割
      const annotationArr = line.split('//');
      // 以冒号分割
      const colonArr = annotationArr[0].split(':');
      // 键，值，注释
      const lineKey = deleteQuotation(colonArr[0]);
      const lineValue = colonArr[1];
      const lineAnnotation = annotationArr[1];
      // 行结果
      result += doubleQuotation(`"${lineKey}_is_${lineAnnotation}":${lineValue}`);
      continue;
    }

    // 有冒号
    if (colon) {
      // 以冒号分割
      const colonArr = line.split(':');
      // 键，值，注释
      const lineKey = deleteQuotation(colonArr[0]);
      const lineValue = colonArr[1];
      // 行结果
      result += doubleQuotation(`"${lineKey}_is_":${lineValue}`);
      continue;
    }

    // 有注释
    if (annotation) {
      continue;
    }

    result += doubleQuotation(line);
  }

  // console.log(mark);
  // console.log(result);

  return { [mark]: resultJson(result) };
}

/* 格式化-描述 */
function formatDesc(value) {
  const result = value.slice(1);  
  
  return { desc: result.join() };
}

/* 格式化 */
function formatValue(value) {
  // 结果
  const result = {};

  // 换行数组
  const lineWrapArray = value.split(/[\n|\r\n]/);
  // console.log(lineWrapArray);

  // 基本信息（标题、请求方式、请求地址）
  const baseInfo = [];

  // 头部
  const headers = [];

  // 参数
  const params = [];

  // 返回值
  const response = [];

  // 描述
  const desc = [];

  for (let i = 0; i < lineWrapArray.length; i++) {
    const line = lineWrapArray[i];

    if (trimAll(line, '') === '#headers') {
      // 发现头部
      headers.push(line);

    } else if (trimAll(line, '') === '#params') {
      // 发现参数
      params.push(line);
      
    } else if (trimAll(line, '') === '#response') {
      // 发现返回值
      response.push(line);

    } else if (trimAll(line, '') === '#desc') {
      // 发现描述
      desc.push(line);

    } else if (headers.length === 0 && params.length === 0 && response.length === 0 && desc.length === 0) {
      // 没发现之前，都是基本信息
      baseInfo.push(line);

    } else if (params.length === 0 && response.length === 0 && desc.length === 0) {
      // 头部内容
      headers.push(line);

    } else if (response.length === 0 && desc.length === 0) {
      // 参数内容
      params.push(line);

    } else if (desc.length === 0) {
      // 返回值内容
      response.push(line);

    } else {
      // 描述内容
      desc.push(line);
    }

  }

  return {
    ...formatBaseInfo(baseInfo),
    ...formatJson(headers, 'headers'),
    ...formatJson(params, 'params'),
    ...formatJson(response, 'response'),
    ...formatDesc(desc),
  };
}

/* 批量格式化 */
function formatValueBatch(value) {
  const arr = value.split('============================================================');
  // console.log(arr);

  const result = arr.map(item => formatValue(item));
  // console.log(JSON.stringify(result));
  console.log(result);
  console.log('------------------------------------------------------------');

  return result;
}

/* 转换值 */
function convertValue(value) {
  if (value === null) {
    return `null`;

  } else if (value === true) {
    return `true`;

  } else if (value === false) {
    return `false`;

  } else if (typeof value === 'string') {
    return `"${value}"`;

  } else if (typeof value === 'number') {
    return value;

  }

  return value;
}

const defaultValue = `
登录
GET /api/auth/login
#headers
[
  {
    "token": 'fafoslj9f4s4f5asfas454fdsf', // 主键
  }
]
#params
{
  id: 1, // 主键
  name: "abc", // 名称
  code: null, // 编码
  list: [1,2,3], // 列表
  listmore: [[1],[2],[3]], // 列表更多
}
#response
{
  code: 0, // 主键
  "data": {
    pagesize: 1, // 主键
    entities: [ // 实体列表
      {
        id: 1, // 主键
        name: "长沙" // 名称
      },
    ]
  },
  message: "success" // 消息
}
#desc
发动机附加费
`;

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: defaultValue,
      format: formatValueBatch(defaultValue),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
      format: formatValueBatch(event.target.value),
    });
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  renderTable(tree, level = 0) {
    // 异常返回
    if (tree === undefined) { return null; }

    // 缩进
    const indent = { textIndent: level * 24 + 24 };

    // 类型
    const type = Object.prototype.toString.call(tree);

    if (type === '[object Array]') {

      return (
        <Fragment>

          {/* 开始符号 */}
          {level === 0 && <div className={styles.codeline}>{typestart['[object Array]']}</div>}
          
          {/* 数组 */}
          {tree.map((item, index) => {
            // 类型-元素
            const itemtype = Object.prototype.toString.call(item);

            // 需要循环
            const needloop = (itemtype === '[object Array]' || itemtype === '[object Object]');

            // 不是最后一项
            const notlast = (index < tree.length - 1);

            if (needloop) {
              return (
                <Fragment key={index}>
                  <div className={styles.codeline} style={indent}>{typestart[itemtype]}</div>
                  {this.renderTable(item, level + 1)}
                  <div className={styles.codeline} style={indent}>{typeend[itemtype]}{notlast && separator}</div>
                </Fragment>
              );
            }

            return (
              <div key={index} className={styles.codeline} style={indent}>
                {convertValue(item)}{notlast && separator}
              </div>
            );

          })}
          
          {/* 结束符号 */}
          {level === 0 && <div className={styles.codeline}>{typeend['[object Array]']}</div>}

        </Fragment>
      );
    
    } else if (type === '[object Object]') {

      return (
        <Fragment>
          {/* 开始符号 */}
          {level === 0 && <div className={styles.codeline}>{typestart['[object Object]']}</div>}

          {/* 对象 */}
          {Object.keys(tree).map((key, index) => {
            const [ realkey, annotation ] = key.split('_is_');
            const value = tree[key];

            // 类型-值
            const valuetype = Object.prototype.toString.call(value);

            // 需要循环
            const needloop = (valuetype === '[object Array]' || valuetype === '[object Object]');

            // 不是最后一项
            const notlast = (index < Object.keys(tree).length - 1);

            return (
              <Fragment key={index}>
                <div className={styles.codeline}>
                  <div className={styles.keyvalue}>
                    <div className={styles.key} style={indent}>{realkey}:</div>
                    {needloop || <div className={styles.value}>{convertValue(value)}{notlast && separator}</div>}
                    {needloop && <div>{typestart[valuetype]}</div>}
                  </div>
                  <div className={styles.annotation}>{annotation}</div>
                </div>
                {needloop && this.renderTable(value, level + 1)}
                {needloop && <div className={styles.codeline} style={indent}>{typeend[valuetype]}{notlast && separator}</div>}
              </Fragment>
            );

          })}

          {/* 结束符号 */}
          {level === 0 && <div className={styles.codeline}>{typeend['[object Object]']}</div>}
        </Fragment>
      );

    } else {

      console.log('出现未考虑到的情况');
      return null;

    }
  }

  render() {
    const { value, format } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className={styles.flexBox}>
          <div className={styles.flexItem}>
            <textarea className={styles.originalCode} value={value} onChange={this.handleChange} />
          </div>
          <div className={styles.flexItem}>
            {format.map((item, index) => (
              <div key={index}>
                <div className={styles.title}>{item.title}</div>
                <div className={styles.method}>{item.method}</div>
                <div className={styles.url}>{item.url}</div>
                <div className={styles.codetitle}>desc</div>
                <div>{item.desc}</div>
                {<div className={styles.codetitle}>headers</div>}
                {<div className={styles.codebox}>{this.renderTable(item.headers)}</div>}
                {<div className={styles.codetitle}>params</div>}
                {<div className={styles.codebox}>{this.renderTable(item.params)}</div>}
                {<div className={styles.codetitle}>response</div>}
                {<div className={styles.codebox}>{this.renderTable(item.response)}</div>}
              </div>
            ))}
          </div>
        </div>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default BasicLayout;
