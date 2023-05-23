const { where } = require("sequelize")
const kamarModel = require(`../models/index`).kamar
const pemesananModel = require(`../models/index`).pemesanan
const detailsOfPemesananModel = require(`../models/index`).detail_pemesanan
// const memberModel = require(`../models/index`).member
const Op = require(`sequelize`).Op
// const crypto = require("crypto");

// Fungsi untuk menghasilkan nomor acak dengan panjang n
function generateRandomNumber(n) {
    let randomNumber = ""
    for (let i = 0; i < n; i++) {
      randomNumber += Math.floor(Math.random() * 10)
    }
    return randomNumber
  }
  
  // Fungsi untuk memeriksa apakah nomor pemesanan sudah ada di database atau belum
  async function isDuplicateBookingNumber(bookingNumber) {
    const result = await pemesananModel.findOne({ where: { nomor_pemesanan: bookingNumber } })
    return !!result
  }
  
  // Fungsi untuk menghasilkan nomor pemesanan yang belum digunakan sebelumnya
  async function generateUniqueBookingNumber() {
    let bookingNumber = generateRandomNumber(6) // Menghasilkan nomor acak dengan 6 digit
    while (await isDuplicateBookingNumber(bookingNumber)) {
      // Jika nomor pemesanan sudah ada di database, menghasilkan nomor acak baru
      bookingNumber = generateRandomNumber(6)
    }
    return bookingNumber
  }

exports.getCheck = async (req, res) => {
    const { tgl_check_in, tgl_check_out } = req.body;
    try {
      const availableRooms = await pemesananModel.findAll({
        where: {
          [Op.or]: [
            {
              tgl_check_in: {
                [Op.gte]: tgl_check_in,
              },
              tgl_check_out: {
                [Op.lte]: tgl_check_out,
              },
            },
          ],
        },
      });
      if (availableRooms === null || availableRooms.length === 0) {
        res.json({ message: 'Room Available' });
      } else {
        res.json({ message: 'Room Not Available' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed' });
    }
}; 

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

exports.getPemesanan = async (request, response) => {
    let data = await pemesananModel.findAll(
        {
            include: [
                // 'resepsionis',
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

exports.findPemesanan = async (request, response) => {
    let keyword = request.body.keyword
    let pemesanan = await pemesananModel.findAll({
        where: {
            [Op.or]: [
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
                {id_user: {[Op.substring]: keyword}}
            ]
        }
    })
    return response.json({
        success: true,
        data: pemesanan,
        message: `pemesanan have been loaded`
    })
}

exports.addPemesanan = async (request, response) => {
    const today = new Date();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const nomorPemesanan = await generateUniqueBookingNumber();
  
    // Tanggal check-in yang dimasukkan oleh pengguna
    const tglCheckIn = new Date(request.body.tgl_check_in);
    tglCheckIn.setHours(12, 0, 0); // Set jam 12:00:00
  
    // Tanggal check-out yang dimasukkan oleh pengguna
    const tglCheckOut = new Date(request.body.tgl_check_out);
    tglCheckOut.setHours(12, 0, 0); // Set jam 12:00:00
  
    try {
      // Periksa apakah ada pemesanan dengan tanggal check-in yang sama
      const existingPemesanan = await pemesananModel.findOne({
        where: {
          tgl_check_in: tglCheckIn
        }
      });
  
      if (existingPemesanan) {
        return response.json({
          success: false,
          message: "Pemesanan pada tanggal tersebut sudah ada."
        });
      }
  
      const newPemesanan = {
        nomor_pemesanan: nomorPemesanan,
        nama_pemesan: request.body.nama_pemesan,
        email_pemesan: request.body.email_pemesan,
        tgl_pemesanan: time,
        tgl_check_in: tglCheckIn,
        tgl_check_out: tglCheckOut,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: request.body.id_tipe_kamar,
        status_pemesanan: 'baru',
        id_user: request.body.id_user
      };
  
      const pemesanan = await pemesananModel.create(newPemesanan);
      const pemesananID = pemesanan.id;
      
      if (request.body.detail_pemesanan && request.body.detail_pemesanan.length > 0) {
        const detailsOfPemesanan = request.body.detail_pemesanan.map(detail => ({
          id_kamar: detail.id,
          tgl_akses: Date.now(),
          harga: detail.harga,
          id_pemesanan: pemesananID
        }));
  
        const createdDetails = await detailsOfPemesananModel.bulkCreate(detailsOfPemesanan);
        
        return response.json({
          success: true,
          message: `New pemesanan has been inserted with details.`
        });
      } else {
        return response.json({
          success: true,
          message: 'New pemesanan has been inserted without any details.'
        });
      }
    } catch (error) {
      return response.json({
        success: false,
        message: error.message
      });
    }
  };  

exports.updatePemesanan = async (request, response) => {
    const nomorPemesanan = await generateUniqueBookingNumber()
    let dataPemesanan = {
        nomor_pemesanan: nomorPemesanan,
        nama_pemesan : request.body.nama_pemesan,
        email_pemesan : request.body.email_pemesan,
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
    pemesananModel.update(dataPemesanan, {where: {id:pemesananID}})
    .then(result => {
        return response.json({
            success: true,
            message: `Data pemesanan has been updated`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.updateDetailPemesanan = async (request, response) => {
    // const nomorPemesanan = await generateUniqueBookingNumber()
    let dataDetailPemesanan = {
        id_kamar: request.body.id_kamar,
        harga : request.body.harga,
    }
    let detailpemesananID = request.params.id
    detailsOfPemesananModel.update(dataDetailPemesanan, {where: {id:detailpemesananID}})
    .then(result => {
        return response.json({
            success: true,
            message: `Data Detail pemesanan has been updated`
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