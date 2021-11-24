const express = require('express')
const router = express.Router()
const Log = require('../models/log')
//GET ALL
router.get('/', async (req, res) => {
    try {
        const log = await Log.find()
        res.send(log)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//GET One
router.get('/.id', getLogs, (req, res) => {
    res.send(res.log)
})
//Create
router.post('/', async (req, res) => {
    const log = new Log({
        name: req.body.name,
        dateRequested: req.body.dateRequested
    })
    try {
        const newLog = await log.save()
        res.status(201).json(newLog)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
//Update
router.get('/', getLogs, async (req, res) => {
    if (req.body.name != null){
        res.log.name = req.body.name
    }
    try {
        const upd1atedLog = await res.log.save()
        res.json(upd1atedLog)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})
//Delete
router.get('/', getLogs, async (req, res) => {
    try {
        await res.log.remove()
        res.json({message :"Deleted log"})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
})

async function getLogs(req, res, next) {
    let log
    try {
        log = await Log.findById(req.params.id)
        if (log == null) {
            return res.status(404).message({ message: 'Cannot find log !' })
        }
    } catch (err) {
        return res.status(500).message({ message: err.message })
    }
    res.log = log
    next()
}

module.exports = router