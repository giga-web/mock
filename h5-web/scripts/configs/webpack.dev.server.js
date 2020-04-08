// https://v4.webpack.js.org/configuration/dev-server/

// 自研-工具
const paths = require('../utilities/paths');

// 模拟数据
const mock = require('../../mock');

module.exports = {
  // 主机
  host: 'localhost',

  // 端口
  port: 3300,

  // 自动打开默认浏览器
  open: true,

  // 内容库，逃生窗口，让开发服务器可以监听来自此处指定文件夹的内容（即非 webpack 的内容也可以监听）
  contentBase: paths.PublicDir,

  // 监听内容库
  // 默认情况下，来自 contentBase 的文件不会触发页面重新加载。
  watchContentBase: true,

  // 开启热模块加载
  hot: true,

  proxy: {
    '/api': {
      target: 'http://csl.edexcs.cn:8020',
      changeOrigin: true
    }
  },

  before: function(app, server, compiler) {
    Object.keys(mock).forEach(key => {
      const splited = key.split(' ');
      const method = splited[0].toLowerCase();
      const path = splited[1];
      const mockFn = mock[key];

      app[method](path, mockFn);
    });
  }
}