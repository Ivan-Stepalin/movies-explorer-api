const {getUserInfo, updateUser} = require("../controllers/users");
const router = require('express').Router()

router.get('/me', getUserInfo)
router.patch('/me', updateUser)

module.exports = router;