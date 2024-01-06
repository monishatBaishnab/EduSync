const router = require('express').Router();
const { findAll, insertOne, updateOne, deleteOne, findOne } = require('../../api/assignments');

router.get('/assignments', findAll);

router.get('/assignments/:id', findOne);

router.post('/assignments', insertOne);

router.put('/assignments/:id', updateOne);

router.delete('/assignments/:id', deleteOne);

module.exports = router;