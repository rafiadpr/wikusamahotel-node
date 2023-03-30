const express = require(`express`)
const app = express()
app.use(express.json())

const tipekamarController = require(`../controllers/tipe_kamar.controller`)
// const {authorize} = require(`../controller/auth.controller`)
// let {validateAdmin} = require(`../middlewares/admin-validation`)

app.get("/", tipekamarController.getAllTipeKamar)
app.post("/", tipekamarController.addTipeKamar)
app.post("/find", tipekamarController.findTipeKamar)
app.put("/:id", tipekamarController.updateTipeKamar)
app.delete("/:id", tipekamarController.deleteTipeKamar)
module.exports = app;