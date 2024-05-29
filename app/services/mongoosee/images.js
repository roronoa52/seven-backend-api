const Images = require("../../api/v1/images/model")
const { NotFoundError } = require("../../errors")


const generateUrlImage = async (req) => {
    const result = `uploads/${req.file.filename}`
}

const createImages = async (req) => {
    const result = await Images.create({
        name: req.file ? `uploads/${req.file.filename}`: 'uploads/avatar/default.jpg',
        dataImage : req.file.buffer,
        typeImage : req.file.mimetype
    })

    return result
}

const checkingImage = async (id) => {
    const result = await Images.findOne({ _id: id})

    if(!result) throw new NotFoundError(`Tidak ada gambar dengan id: ${id}`)

    return result
}

module.exports = {
    createImages,
    generateUrlImage,
    checkingImage
}