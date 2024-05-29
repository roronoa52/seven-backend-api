const express = require("express")
const { signinAdmin, signupAdmin, getRefreshToken,loginGoogle
 } = require("./controller")
const router = express()

router.post ("/auth/signin", signinAdmin)
router.post ("/auth/signup", signupAdmin)
router.get ("/google", loginGoogle)
router.get ("/google/redirect", getRefreshToken)

module.exports = router
