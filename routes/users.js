const router = require('express').Router();
const { getUserInfo, updateUser } = require('../controllers/users');
const { getUserInfoValidation } = require('../middlewares/validation');

router.get('/me', getUserInfo);
router.patch('/me', getUserInfoValidation, updateUser);

module.exports = router;
