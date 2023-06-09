const express = require(`express`)
const app = express()
app.use(express.json())

const pemesananController = require(`../controllers/pemesanan.controller`)
// const {authorize} = require(`../controller/auth.controller`)
// let {validateAdmin} = require(`../middlewares/admin-validation`)

app.get("/", pemesananController.getAllPemesanan)
app.post("/check", pemesananController.getCheck)
app.get("/:id", pemesananController.getPemesanan)
app.post("/", pemesananController.addPemesanan)
app.post("/find", pemesananController.findPemesanan)
app.put("/:id", pemesananController.updatePemesanan)
app.put("/detail/:id", pemesananController.updateDetailPemesanan)
app.delete("/:id", pemesananController.deletePemesanan)
module.exports = app;
