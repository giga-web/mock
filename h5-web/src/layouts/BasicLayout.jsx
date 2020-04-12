import React, { useEffect } from 'react';

/* 样式 */
import styles from './BasicLayout.m.less';

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

// 递归注释
function loopAnnotation(obj) {
  const type = Object.prototype.toString.call(obj);

  if (type === '[object Array]') {
    // 数组
    obj.forEach(item => {
      // 递归注释
      loopAnnotation(item);
    });

  } else if (type === '[object Object]') {
    // 对象
    Object.keys(obj).forEach(key => {
      const value = obj[key];

      if (/_is_/.test(key)) {
        const arr = key.split('_is_');
        const realkey = arr[1];
        const annotation = arr[0];

        obj[realkey] = { value, annotation };

        delete obj[key];
      }
      
      // 递归注释
      loopAnnotation(value);
    });
    
  }

}

/* JSON 化 */
function resultJson(value) {
  let result;

  // 替换多余的逗号
  const temp = value.replace(/(,})/g, '}').replace(/(,])/g, ']');
  // console.log(temp);

  try {
    result = JSON.parse(temp);
  } catch (err) {
    console.log(err);
  }

  // 递归注释
  loopAnnotation(result);

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
      result += doubleQuotation(`"${lineAnnotation}_is_${lineKey}":${lineValue}`);
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
      result += doubleQuotation(`"_is_${lineKey}":${lineValue}`);
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
  console.log(JSON.stringify(result));

  return result;
}

/* 对象转平面数组 */
function objectToArray({ level, result, value }) {
  const type = Object.prototype.toString.call(value);

  if (type === '[object Object]') {

    Object.keys(value).forEach(valuekey => {
      const item = value[valuekey];
      const valuetype = Object.prototype.toString.call(item.value);

      let valuepush = item.value;

      // 对象及对象数组时，设置值为 understand
      if (valuetype === '[object Object]') {
        valuepush = undefined;

      } else if (valuetype === '[object Array]') {

        if (/\[object Object\]/.test(valuepush.toString())) {
          valuepush = undefined;
        }

      }
      
      result.push({
        level,
        key: valuekey,
        value: valuepush,
        annotation: item.annotation,
      });

      // 对象及对象数组时，进行下一级插入
      if (valuepush === undefined) {
        objectToArray({ level: level + 1, result, value: item.value });
      }

    });

  } else if (type === '[object Array]') {
    // console.log(value);
    
    value.forEach(itemvalue => {

      Object.keys(itemvalue).forEach(valuekey => {
        const item = itemvalue[valuekey];
        const valuetype = Object.prototype.toString.call(item.value);

        let valuepush = item.value;

        // 对象及对象数组时，设置值为 understand
        if (valuetype === '[object Object]') {
          valuepush = undefined;

        } else if (valuetype === '[object Array]') {

          if (/\[object Object\]/.test(valuepush.toString())) {
            valuepush = undefined;
          }

        }
        
        result.push({
          level,
          key: valuekey,
          value: valuepush,
          annotation: item.annotation,
        });

        // 对象及对象数组时，进行下一级插入
        if (valuepush === undefined) {
          objectToArray({ level: level + 1, result, value: item.value });
        }

      });

    });

  }
}

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      format: [],
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

  renderTable(value) {
    const arr = [];

    objectToArray({ level: 0, result: arr, value });

    console.log(arr);

    return (
      <table border="1">
        <thead>
          <tr>
            <th>键</th>
            <th>值</th>
            <th>注释</th>
          </tr>
        </thead>
        <tbody>
          {arr.map((item, index) => (
            <tr key={index}>
              <td>{item.key}</td>
              <td>{item.value}</td>
              <td>{item.annotation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
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
                <div>desc</div>
                <div>{item.desc}</div>
                <div>response</div>
                {this.renderTable(item.response)}
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
