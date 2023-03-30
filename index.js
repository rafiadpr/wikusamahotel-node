const express = require(`express`)
const bodyParser = require(`body-parser`)
const cors = require(`cors`)
const app = express()
const PORT = 8000

app.use(cors())
app.use(express.static(__dirname))
// app.use(bodyParser.json)
// app.use(bodyParser.urlencoded({extended: true}))

// const memberRoute = require(`./routes/member.route`)
const userRoute = require(`./routes/user.route`)
const pemesananRoute = require(`./routes/pemesanan.route`)
const tipekamarRoute = require(`./routes/tipe_kamar.route`)
// const auth = require(`./routes/auth.routes`)

// app.use(`/member`, memberRoute)
app.use(`/user`, userRoute)
app.use(`/pemesanan`, pemesananRoute)
app.use(`/tipekamar`, tipekamarRoute)
// app.use(`/auth`, auth)

app.listen(PORT, () => {
    console.log(`Server of School's Library runs on port ${PORT}`)
})