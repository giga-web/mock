const Router = require('koa-router');
const router = new Router({ prefix: '/interface' });
const control = require('../controllers/interface');

router.get('/:id', control.getById);

router.get('/', control.get);

router.post('/', control.post);

router.put('/:id', control.putById);

router.delete('/:id', control.deleteById);

module.exports = router;
