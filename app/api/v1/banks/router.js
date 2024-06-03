const express = require("express")
const router = express()
const { create, index, find, update, destroy } = require("./controller")
const { authenticateUser } = require("../../../middlewares/auth")

router.post ("/banks", authenticateUser, create)
router.put ("/banks/:id", authenticateUser, update)
router.delete ("/banks/:id", authenticateUser, destroy)
router.get ("/banks", index)
router.get ("/banks/:id", authenticateUser, find)

module.exports = router
