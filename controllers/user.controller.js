const { request, response } = require("express")
const { object } = require("joi")
const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
const md5 = require(`md5`)
let password = md5(`password`)
const fs = require(`fs`)
const upload = require(`../middlewares/foto-validation`).single(`foto`)

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
                {id: {[Op.substring]: keyword}},
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
    upload(request, response, async error => {
        if (error){
            return response.json({ success: false, message: error });
        }
        let newuser = {
            nama_user: request.body.nama_user,
            email: request.body.email,
            password: md5(request.body.password),
            role: request.body.role,
        }
        if(request.file){
           newuser.foto= request.file.filename
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
    })
}

exports.updateUser = async (request, response) => {
    upload(request, response, async error => {
        if (error){
            return response.json({success: false, message: error})
        }
        let id = request.params.id

        let User = {
            nama_user: request.body.nama_user,
            email: request.body.email,
            password: md5(request.body.password),
            role: request.body.role
        }

        if (request.file){
            const selectedUser = await userModel.findOne({
                where: {id:id}
            })
            const oldFotoUser = selectedUser.photo
            const pathFoto = path.join(__dirname, `../foto`, oldFotoUser)
            if(fs.existsSync(pathFoto)) {
                fs.unlink(pathFoto, error => console.log(error))
            }
            User.photo = request.file.filename
        }
        userModel.update(User, {where: {id: id}})
        .then(result => {
            return response.json({
                success: true,
                message: `Data user has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: `Data user has not been updated`
            })
        })
    })
}

// exports.updateUser = (request, response) => {
//     let datauser = {
//         nama_user: request.body.nama_user,
//         email: request.body.email,
//         password: md5(request.body.password),
//         role: ENUM(request.body.role)
//     }
//     let iduser = request.params.id
//     userModel.update(datauser, {where: {id:iduser}})
//     .then(result => {
//         return response.json({
//             success: true,
//             message: `Data user has been updated`
//         })
//     })
//     .catch(error => {
//         return response.json({
//             success: false,
//             message: error.message
//         })
//     })
// }

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