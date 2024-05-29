const Images = require('../../api/v1/images/model')
const { checkingImage } = require('./images')
const { NotFoundError, BadRequestError } = require('../../errors')
const Product = require('../../api/v1/product/model')

const getAllProducts = async (req) => {
    const { keyword } = req.query

    let condition = {}

    if(keyword){
        condition = { ...condition, name: { $regex: keyword, $options: 'i'}}
    }

    const result = await Product.find(condition)
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name price image')

    return result
}

const getOneProduct = async (req) => {
    const { id } = req.params

    const result = await Product.findOne({ _id: id})
    .populate({
        path: 'image',
        select: '_id name dataImage typeImage'
    })
    .select('_id name price image')

    if(!result) throw new NotFoundError(`Tidak ada product dengan id: ${id}`)

    return result
}

const createProduct = async (req) => {
    const { name, price, image } = req.body

    await checkingImage(image)

    const check = await Product.findOne({ name})

    if(check) throw new BadRequestError('Product duplikat')

    const result = await Product.create({ name, price, image,})

    return result
}

const updateProduct = async (req) => {
    const { id } = req.params;
    const { name, image, price } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (image) {
        await checkingImage(image);
        updateFields.image = image;
    }
    if (price) updateFields.price = price;

    if (name) {
        const check = await Product.findOne({
            name,
            _id: { $ne: id }
        });
        if (check) throw new BadRequestError('Product nama duplikat');
    }

    const result = await Product.findOneAndUpdate(
        { _id: id },
        updateFields,
        { new: true, runValidators: true }
    );

    if (!result) throw new NotFoundError(`Tidak ada product dengan id: ${id}`);

    return result;
}

const deleteProduct = async (req) => {
    const { id } = req.params

    const result = await Product.findOneAndDelete({
        _id: id,
    })

    if(!result) throw new NotFoundError(`Tidak ada price dengan id: ${id}`)

    return result
}


module.exports = {
    createProduct,
    getAllProducts,
    getOneProduct,
    updateProduct,
    deleteProduct,
}

