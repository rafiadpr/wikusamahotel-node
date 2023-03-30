const { request, response } = require("express")
const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
const md5 = require(`md5`)
let password = md5(`password`)

exports.getAllUser = async (request, response) => {
    let user = await userModel.findAll()
    return response.json({
        success: true,
        data: user,
        message: `All user have been loaded` 
    })
}

exports.getUser = async (request, response) => {
    const {id}  = request.params;
    let user = await userModel.findOne(
        {
            where: {
                id
            }
        }
    )
    
    return response.json({
        success: true,
        data: user,
        message: `user loaded`
    })
}

exports.findUser = async (request, response) => {
    let keyword = request.body.keyword
    let user = await userModel.findAll({
        where: {
            [Op.or]: [
                {id_user: {[Op.substring]: keyword}},
                {nama_user: {[Op.substring]: keyword}},
                {email: {[Op.substring]: keyword}},
                {role: {[Op.substring]: keyword}},
            ]
        }
    })
    return response.json({
        success: true,
        data: user,
        message: `All user have been loaded`
    })
}

exports.addUser = (request, response) => {
    let newuser = {
        nama_user: request.body.nama_user,
        email: request.body.email,
        password: md5(request.body.password),
        role: request.body.role
    }
    userModel.create(newuser)
    .then(result => {
        return response.json({
            success: true,
            data: result,
            message: `New user has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.updateUser = (request, response) => {
    let datauser = {
        nama_user: request.body.nama_user,
        email: request.body.email,
        password: md5(request.body.password),
        role: ENUM(request.body.role)
    }
    let iduser = request.params.id
    userModel.update(datauser, {where: {id:iduser}})
    .then(result => {
        return response.json({
            success: true,
            message: `Data user has been updated`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.deleteUser = (request, response) => {
    let iduser = request.params.id
    userModel.destroy({where: {id: iduser}})
    .then(result => {
        return response.json({
            success: true,
            message: `Data user has been deleted`
        })
    })
    .catch(error => {
        return response.json ({
            success: false,
            message: error.message
        })
    })
}