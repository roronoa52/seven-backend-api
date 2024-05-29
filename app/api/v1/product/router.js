const express = require("express")
const router = express()
const { create, index, find, update, destroy } = require("./controller")
const { authenticateUser } = require("../../../middlewares/auth")

router.post ("/products", authenticateUser, create)
router.put ("/products/:id", authenticateUser, update)
router.delete ("/products/:id", authenticateUser, destroy)
router.get ("/products", authenticateUser, index)
router.get ("/products/:id", authenticateUser, find)

module.exports = router
