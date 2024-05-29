const Images = require('../../api/v1/images/model')
const { checkingImage } = require('./images')
const { NotFoundError, BadRequestError } = require('../../errors')
const Bank = require('../../api/v1/banks/model')

const getAllBanks = async (req) => {
    const { keyword } = req.query

    let condition = {}

    if(keyword){
        condition = { ...condition, name: { $regex: keyword, $options: 'i'}}
    }

    const result = await Bank.find(condition)
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name rek image')

    return result
}

const getOneBank = async (req) => {
    const { id } = req.params

    const result = await Bank.findOne({ _id: id})
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name rek image')

    if(!result) throw new NotFoundError(`Tidak ada bank dengan id: ${id}`)

    return result
}

const createBank = async (req) => {
    const { name, rek, image } = req.body

    await checkingImage(image)

    const check = await Bank.findOne({ name})

    if(check) throw new BadRequestError('Bank duplikat')

    const result = await Bank.create({ name, image, rek,})

    return result
}

const updateBank = async (req) => {
    const { id } = req.params;
    const { name, image, rek } = req.body;

    // Create an update object with only provided fields
    const updateFields = {};
    if (name) updateFields.name = name;
    if (image) {
        await checkingImage(image);
        updateFields.image = image;
    }
    if (rek) updateFields.rek = rek;

    // Check for duplicate bank name
    if (name) {
        const check = await Bank.findOne({
            name,
            _id: { $ne: id }
        });
        if (check) throw new BadRequestError('Bank nama duplikat');
    }

    // Update bank
    const result = await Bank.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada bank dengan id: ${id}`);

    return result;
}

const deleteBanks = async (req) => {
    const { id } = req.params

    const result = await Bank.findOneAndDelete({
        _id: id,
    })

    if(!result) throw new NotFoundError(`Tidak ada bank dengan id: ${id}`)

    return result
}


module.exports = {
    createBank,
    getAllBanks,
    getOneBank,
    updateBank,
    deleteBanks,
}

