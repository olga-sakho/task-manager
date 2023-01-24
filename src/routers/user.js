const { Router } = require('express')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({ user, token})
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(error) {
        res.status(400).json(error.message)
    }
})

router.get('/users', auth, async (req,res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (error){
        res.status(500).send(error)

    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error){
        res.status(500).send(error)

    }
})

router.get('/users/me', auth, async (req,res) => {
   res.send(req.user)
})

router.get('/users/:id', async (req,res) => {
    const id = req.params.id

    try {
        const user = await User.findById({_id: id})
        if (!user) {
            return res.status(404).json('User Not Found')
        } else {
            res.status(200).json(user)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.patch('/users/me', auth,  async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalide updates!'})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.delete('/users/me', auth,  async (req, res) => {
    try {  
        await req.user.remove()
        res.send(req.user)

    } catch (error) {
        res.status(500).json(error.message)
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jpg, jpeg or png.'))
        }
        cb(undefined, true)
        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})


router.delete('/user/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
})

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send()
    }
})

module.exports = router