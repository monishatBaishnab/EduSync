const { removeAccessKey, createAccessKey } = require('../../api/auth');
const router = require('express').Router();

router.post('/create-access-key', createAccessKey);

router.get('/clear-access-key', removeAccessKey);

module.exports = router;