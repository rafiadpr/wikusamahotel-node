const express = require(`express`)
const app = express()
app.use(express.json())

const userController = require(`../controllers/user.controller`)
// const {authorize} = require(`../controller/auth.controller`)
// let {validateAdmin} = require(`../middlewares/admin-validation`)

app.get("/", userController.getAllUser)
app.get("/:id", userController.getUser)
app.post("/", userController.addUser)
app.post("/find", userController.findUser)
app.put("/:id", userController.updateUser)
app.delete("/:id", userController.deleteUser)
module.exports = app;