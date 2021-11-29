const express = require('express')
const router = express.Router()
const Licence = require('../models/licence')
//GET ALL
router.get('/', async (req, res) => {
    try {
        const licence = await Licence.find()
        res.send(licence)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//GET One
router.get('/:licence_key', async (req, res) => {
    try {
        const licence = await Licence.findOne({licence_key: req.params.licence_key})
        if (licence == null) {
            res.status(404).json({ message: 'Cannot find licence !' }) 
        }else{
            res.send(licence)
        } 
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}) 
//Create
router.post('/', async (req, res) => {
    var newDate = dateAddMonths(1);

    const {ObjectId} = require('mongodb'); 
    var myLicence = "SSN" + new ObjectId(); 

    const licence = new Licence({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        subscription_end_date: newDate,
        licence_key: myLicence,
        subscription_add_date: req.body.subscription_add_date
    })
    try {
        const newLicence = await licence.save()
        res.status(201).json(newLicence)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
//Update
// router.get('/', getLogs, async (req, res) => {
//     if (req.body.name != null){
//         res.log.name = req.body.name
//     }
//     try {
//         const upd1atedLog = await res.log.save()
//         res.json(upd1atedLog)
//     } catch (err) {
//         res.status(400).json({message:err.message})
//     }
// })
//Delete
router.get('/', getLicences, async (req, res) => {
    try {
        await res.licence.remove()
        res.json({ message: "Deleted licence" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getLicences(req, res, next) {
    let licence
    try {
        licence = await Licence.findById(req.params.id)
        if (licence == null) {
            return res.status(404).message({ message: 'Cannot find licence !' })
        }
    } catch (err) {
        return res.status(500).message({ message: err.message })
    }
    res.licence = licence
    next()
}

function dateAddMonths(months) {
    const date = new Date()
    date.setMonth(date.getMonth() + months)
    return date
}
 
module.exports = router