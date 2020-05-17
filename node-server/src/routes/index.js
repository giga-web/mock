const Router = require('koa-router');
const interface = require('./interface');

const router = new Router();

router.use(interface.routes());

module.exports = router;
