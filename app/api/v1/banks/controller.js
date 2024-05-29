const { createBank, getOneBank, getAllBanks, updateBank, deleteBanks } = require('../../../services/mongoosee/bank')
const { StatusCodes } = require('http-status-codes')
const { bufferToBase64 } = require('../../../utils/base64')

const create = async (req, res, next) => {
    try{
        const result = await createBank(req)

        res.status(StatusCodes.CREATED).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const index = async (req, res, next) => {
    try{
        const result = await getAllBanks(req)

        const resultCopy = JSON.parse(JSON.stringify(result));

          for (const data of resultCopy) {
            if (data && data.image.dataImage) {
              data.image.dataImage = bufferToBase64(data.image.dataImage);
            }
          }

        res.status(StatusCodes.OK).json({
            data: resultCopy 
        })
    }catch(err){
        next(err)
    }
}

const find = async (req, res, next) => {
    try{
        const result = await getOneBank(req)

        const resultCopy = JSON.parse(JSON.stringify(result)); 
        
        resultCopy.image.dataImage = bufferToBase64(result.image.dataImage);

        res.status(StatusCodes.OK).json({
            data: resultCopy
        })
    }catch(err){
        next(err)
    }
}

const update = async (req, res, next) => {
    try{
        const result = await updateBank(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

const destroy = async (req, res, next) => {
    try{
        const result = await deleteBanks(req)

        res.status(StatusCodes.OK).json({
            data: result
        })
    }catch(err){
        next(err)
    }
}

module.exports = {
    create,
    index,
    find,
    update,
    destroy
}