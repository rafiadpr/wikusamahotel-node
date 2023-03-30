const tipekamarModel = require(`../models/index`).tipe_kamar
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
// const upload = require(`../middlewares/tipe_kamar-validation`).single(`cover`)

exports.getAllTipeKamar = async (request, response) => {
    let tipe_kamar = await tipekamarModel.findAll()
    return response.json({
        success: true,
        data: tipe_kamar,
        message: `All tipe_kamar have been loaded` 
    })
}

exports.findTipeKamar = async (request, response) => {
    let keyword = request.body.keyword
    let tipe_kamar = await tipekamarModel.findAll({
        where: {
            [Op.or]: [
                {id_tipe_kamar: {[Op.substring]: keyword}},
                {nama_tipe_kamar: {[Op.substring]: keyword}},
                {harga: {[Op.substring]: keyword}},
                {dekripsi: {[Op.substring]: keyword}}
            ]
        }
    })
    return response.json({
        success: true,
        data: tipe_kamar,
        message: `All tipe_kamar have been loaded`
    })
}

exports.addTipeKamar = (request, response) => {
    upload(request, response, async error => {
        if (error){
            return response.json({message: error})
        }
        // if(!request.file){
        //     return response.json({message: `nothing to upload`})
        // }
        let newTipe_kamar = {
            id_tipe_kamar: request.body.id_tipe_kamar,
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi,
            // foto: request.file.filename
        }
        tipekamarModel.create(newTipe_kamar)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `New tipe_kamar has been inserted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
}

exports.updateTipeKamar = async (request, response) => {
    upload(request, response, async error => {
        if (error){
            return response.json({message: error})
        }
        let id = request.params.id

        let tipe_kamar = {
            id_tipe_kamar: request.body.id_tipe_kamar,
            nama_tipe_kamar: request.body.nama_tipe_kamar,
            harga: request.body.harga,
            deskripsi: request.body.deskripsi,
            foto: request.body.foto,
        }

        if (request.file){
            const selectedTipe_kamar = await tipekamarModel.findOne({
                where: {id:id}
            })
            const oldCoverTipe_kamar = selectedTipe_kamar.cover
            const pathCover = path.join(__dirname, `../cover`, oldCoverTipe_kamar)
            if(fs.existsSync(pathCover)) {
                fs.unlink(pathCover, error => console.log(error))
            }
            tipe_kamar.cover = request.file.filename
        }
        tipekamarModel.update(tipe_kamar, {where: { id: id }})
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data tipe_kamar has been updated`
            })
        })
        .catch(error => {
            return response.json({
            })
        })
    })
}

exports.deleteTipeKamar = async (request, response) => {
    const id = request.params.id
    const tipe_kamar = await tipekamarModel.findOne({ where: { id: id } })
    const oldCoverTipe_kamar = tipe_kamar.cover
    const pathCover = path.join(__dirname, `../cover`,oldCoverTipe_kamar)
        if (fs.existsSync(pathCover)) {
            fs.unlink(pathCover, error => console.log(error))
        }
        tipekamarModel.destroy({ where: { id: id } })
            .then(result => {
                return response.json({
                success: true,
                message: `Data tipe_kamar has been deleted`
            })
        })
            .catch(error => {
                return response.json({
                success: false,
                message: error.message
            })
        })
    }