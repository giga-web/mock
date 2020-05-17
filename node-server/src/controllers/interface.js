const formatValueBatch = require('../utils/parser/index').formatValueBatch;

exports.get = async (ctx, next) => {
  const list = await ctx.app.mockdb.collection('interface').find().limit(100).toArray();
  ctx.body = list;
  return;
};

exports.getById = async (ctx, next) => {
  console.log(ctx.params);
  ctx.body = `getById ${ctx.params.id}`;
  return;
};

exports.post = async (ctx, next) => {
  const list = formatValueBatch(ctx.request.body);

  await ctx.app.mockdb.collection('interface').insertMany(list);

  ctx.body = {
    code: 0,
    msg: '',
    data: {},
  };
  return;
};

exports.putById = async (ctx, next) => {
  ctx.body = 'putById';
  return;
};

exports.deleteById = async (ctx, next) => {
  ctx.body = 'deleteById';
  return;
};
