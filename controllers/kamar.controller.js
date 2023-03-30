const kamarModel = require(`../models/index`).kamar
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
const upload = require(`../middlewares/kamar-validation`).single(`cover`)

exports.getAllKamar = async (request, response) => {
    let kamar = await kamarModel.findAll()
    return response.json({
        success: true,
        data: kamar,
        message: `All kamar have been loaded` 
    })
}

exports.findKamar = async (request, response) => {
    let keyword = request.body.keyword
    let kamar = await kamarModel.findAll({
        where: {
            [Op.or]: [
                {id_kamar: {[Op.substring]: keyword}},
                {nomor_kamar: {[Op.substring]: keyword}},
                {id_tipe_kamar: {[Op.substring]: keyword}}
            ]
        }
    })
    return response.json({
        success: true,
        data: kamar,
        message: `All kamar have been loaded`
    })
}

exports.addKamar = (request, response) => {
    upload(request, response, async error => {
        if (error){
            return response.json({message: error})
        }
        // if(!request.file){
        //     return response.json({message: `nothing to upload`})
        // }
        let newKamar = {
            id_kamar: request.body.id_kamar,
            nomor_kamar: request.body.nama_kamar,
            id_tipe_kamar: request.body.harga
        }
        kamarModel.create(newKamar)
        .then(result => {
            return response.json({
                success: true,
                data: result,
                message: `New kamar has been inserted`
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

exports.updateKamar = async (request, response) => {
    upload(request, response, async error => {
        if (error){
            return response.json({message: error})
        }
        let id = request.params.id

        let kamar = {
            id_kamar: request.body.id_kamar,
            nomor_kamar: request.body.nama_kamar,
            id_tipe_kamar: request.body.harga
        }

        if (request.file){
            const selectedKamar = await kamarModel.findOne({
                where: {id:id}
            })
            const oldCoverKamar = selectedKamar.cover
            const pathCover = path.join(__dirname, `../cover`, oldCoverKamar)
            if(fs.existsSync(pathCover)) {
                fs.unlink(pathCover, error => console.log(error))
            }
            kamar.cover = request.file.filename
        }
        kamarModel.update(kamar, {where: { id: id }})
            .then(result => {
                return response.json({
                    success: true,
                    message: `Data kamar has been updated`
            })
        })
        .catch(error => {
            return response.json({
            })
        })
    })
}

exports.deleteKamar = async (request, response) => {
    const id = request.params.id
    const kamar = await kamarModel.findOne({ where: { id: id } })
    const oldCoverKamar = kamar.cover
    const pathCover = path.join(__dirname, `../cover`,oldCoverKamar)
        if (fs.existsSync(pathCover)) {
            fs.unlink(pathCover, error => console.log(error))
        }
        kamarModel.destroy({ where: { id: id } })
            .then(result => {
                return response.json({
                success: true,
                message: `Data kamar has been deleted`
            })
        })
            .catch(error => {
                return response.json({
                success: false,
                message: error.message
            })
        })
    }