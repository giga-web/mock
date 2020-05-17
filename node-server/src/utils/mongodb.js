// mongo.js
const MongoClient = require('mongodb').MongoClient;
const mongodbConfig = require('config').get('mongodb');

module.exports = (app) => {
  MongoClient.connect(mongodbConfig.url, mongodbConfig.opts)
    .then((client) => {
      app.mongo = client;
      console.log('数据库服务连接成功');

      // 创建数据库
      // use db_mock
      app.mockdb = client.db('db_mock');

      // 创建容器
      // db.createCollection('interface')
      app.mockdb
        .createCollection('interface')
        .then(() => {
          console.log('容器创建成功');
        })
        .catch((err) => {
          console.log('容器创建失败', err);
          process.exit(-1);
        });
    })
    .catch((err) => {
      console.log('数据库服务连接失败', err);
      process.exit(-1);
    });
};
