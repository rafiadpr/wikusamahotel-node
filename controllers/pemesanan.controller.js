const { where } = require("sequelize")
const pemesananModel = require(`../models/index`).pemesanan
const detailsOfPemesananModel = require(`../models/index`).detail_pemesanan
// const memberModel = require(`../models/index`).member
const Op = require(`sequelize`).Op

exports.getAllPemesanan = async (request, response) => {
    let pemesanan = await pemesananModel.findAll()
    return response.json({
        success: true,
        data: pemesanan,
        message: `All pemesanan have been loaded` 
    })
}

exports.getPemesanan = async (request, response) => {
    const {id}  = request.params;
    let pemesanan = await pemesananModel.findOne(
        {
            where: {
                id
            }
        }
    )
    
    return response.json({
        success: true,
        data: pemesanan,
        message: `pemesanan loaded`
    })
}

exports.findPemesanan = async (request, response) => {
    let keyword = request.body.keyword
    let pemesanan = await pemesananModel.findAll({
        where: {
            [Op.or]: [
                {id_pemesanan: {[Op.substring]: keyword}},
                {nomor_pemesanan: {[Op.substring]: keyword}},
                {nama_pemesan: {[Op.substring]: keyword}},
                {email_pemesan: {[Op.substring]: keyword}},
                {tgl_pemesanan: {[Op.substring]: keyword}},
                {tgl_check_in: {[Op.substring]: keyword}},
                {tgl_check_out: {[Op.substring]: keyword}},
                {nama_tamu: {[Op.substring]: keyword}},
                {jumlah_kamar: {[Op.substring]: keyword}},
                {id_tipe_kamar: {[Op.substring]: keyword}},
                {status_pemesanan: {[Op.substring]: keyword}},
                {id_user: {[Op.substring]: keyword}},
            ]
        }
    })
    return response.json({
        success: true,
        data: pemesanan,
        message: `All pemesanan have been loaded`
    })
}

exports.addPemesanan = async (request, response) => {
    const newPemesanan = {
        nomor_pemesanan: request.body.nomor_pemesanan,
        nama_pemesan: request.body.nama_pemesan,
        email_pemesan: request.body.email_pemesan,
        tgl_pemesanan: Date.now(),
        tgl_check_in: request.body.tgl_check_in,
        tgl_check_out: request.body.tgl_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: request.body.id_tipe_kamar,
        status_pemesanan: 'baru',
        id_user: request.body.id_user
    };

    try {
        const pemesanan = await pemesananModel.create(newPemesanan);
        const pemesananID = pemesanan.id;
        const detailsOfPemesanan = request.body.detail_pemesanan.map(detail => ({
            id_kamar: detail.id_kamar,
            tgl_akses: Date.now(),
            harga: detail.harga,
            id_pemesanan: pemesananID
        }));

        const createdDetails = await detailsOfPemesananModel.bulkCreate(detailsOfPemesanan);
        return response.json({
            success: true,
            message: `New pemesanan has been inserted with ${createdDetails.length} details.`
        });
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        });
    }
};

  

exports.updatePemesanan = async (request, response) => {
    let newData = {
        nomor_pemesanan : request.body.nomor_pemesanan,
        nama_pemesan : request.body.nama_pemesanan,
        email_pemesan : request.body.email_pemesanan,
        tgl_pemesanan : request.body.tgl_pemesanan,
        tgl_check_in : request.body.tgl_check_in,
        tgl_check_out : request.body.tgl_check_out,
        nama_tamu : request.body.nama_tamu,
        jumlah_kamar : request.body.jumlah_kamar,
        id_tipe_kamar : request.body.id_tipe_kamar,
        status_pemesanan : request.body.status_pemesanan,
        id_user : request.body.id_user
    }

    let pemesananID = request.params.id
    pemesananModel.update(newData, {where: {id: pemesananID}})
    .then(async result => {
        await detailsOfPemesananModel.destroy(
            {where: {pemesananID: pemesananID}}
        )
        let detailsOfPemesanan = request.body.detail_pemesanan
        for (let i=0; i<detailsOfPemesanan.length; i++){
            detailsOfPemesanan[i].pemesananID = pemesananID
        }
        detailsOfPemesananModel.bulkCreate(detailsOfPemesanan)
        .then(result => {
            return response.json({
                success: true,
                message: `pemesanan has updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.deletePemesanan = async (request, response) => {
    let pemesananID = request.params.id

    detailsOfPemesananModel.destroy(
        {where: {pemesananID: pemesananID}}
    )
    .then(result => {
        pemesananModel.destroy({where: {id:pemesananID}})
            .then(result => {
                return response.json({
                    success: true,
                    message: `pemesanan has deleted`
                })
            })
            .catch(error => {
                return response.json ({
                    success: false,
                    message: error.message
                })
            })
        })
    .catch(error => {
        return response.json ({
            success: false,
            message: error.message
        })
    })
}

exports.getPemesanan = async (request, response) => {
    let data = await pemesananModel.findAll(
        {
            include: [
                'resepsionis',
                'admin',
                {
                    model: detailsOfPemesananModel,
                    as: `detail_pemesanan`,
                    include: ["pemesanan"]
                }
            ]
        }
    )
    
    return response.json({
        success: true,
        data: data,
        message: `all pemesanan have been loaded`
    })
}

exports.filterPemesanan = async (request, response) => {
    let keyword = request.body.keyword
    let data = await pemesananModel.findAll(
        {
            where: {memberID:keyword},
            include: [
                'resepsionis','admin',
                {
                    model: detailsOfPemesananModel,
                    as: `detail_pemesanan`,
                    include: ["pemesanan"]
                }
            ]
        }
    )
    return response.json({
        success: true,
        data: data,
        message: `all pemesanan have been loaded`
    })
}