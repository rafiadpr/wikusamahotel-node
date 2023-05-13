const kamarModel = require(`../models/index`).kamar
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
// const upload = require(`../middlewares/kamar-validation`).single(`cover`)

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
    let newkamar = {
        nomor_kamar: request.body.nomor_kamar,
        id_tipe_kamar: request.body.id_tipe_kamar,
    }
    kamarModel.create(newkamar)
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
}

exports.updateKamar = (request, response) => {
    let datakamar = {
        nomor_kamar: request.body.nomor_kamar,
        id_tipe_kamar: request.body.id_tipe_kamar,
    }
    let idkamar = request.params.id
    kamarModel.update(datakamar, {where: {id:idkamar}})
    .then(result => {
        return response.json({
            success: true,
            message: `Data kamar has been updated`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.deleteKamar = (request, response) => {
    let idkamar = request.params.id
    kamarModel.destroy({where: {id: idkamar}})
    .then(result => {
        return response.json({
            success: true,
            message: `Data kamar has been deleted`
        })
    })
    .catch(error => {
        return response.json ({
            success: false,
            message: error.message
        })
    })
}