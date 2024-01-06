const router = require('express').Router();
const { findAll, insertOne, updateOne, deleteOne, findOne } = require('../../api/assignments');
const validateIdentity = require('../../middleware/validateIdentity');

router.get('/assignments', findAll);

router.get('/assignments/:id', validateIdentity, findOne);

router.post('/assignments', validateIdentity, insertOne);

router.put('/assignments/:id', validateIdentity, updateOne);

router.delete('/assignments/:id', validateIdentity, deleteOne);

module.exports = router;