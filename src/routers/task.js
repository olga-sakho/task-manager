const { Router } = require('express')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()
const Task = require('../models/task')


router.post('/tasks', auth, async (req, res) => {
    //const taskBody = new Task(req.body)
    const taskBody = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        const task = await taskBody.save()
        res.status(201).json(task)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.get('/tasks', auth, async (req,res) => {
    const match = {}
    if (req.query.completed) {
        match.completed = req.query.completed
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] ==='desk' ? -1 : 1
    }
    try {
        //const tasks = await Task.find({ owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    createdAt: -1
                }
            }
        })
        res.send(req.user.tasks)
    } catch (error) {
        res.status(400).json(error.message)
    }
    
})

router.get('/tasks/:id', auth, async (req,res) => {
    const id = req.params.id
    try {
        //const task = await Task.findById({_id: id})
        const task = await Task.findOne({_id: id, owner: req.user._id})

        if (!task) {
            return res.status(404).json('Task Not Found')
        } else {
            res.status(200).json(task)
        } 
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalide updates!'})
    }
    const id = req.params.id
    try {
        const updateTask = await Task.findOne({_id: id, owner: req.user._id})
        //const updateTask = await Task.findById(id)
        //const updateTask = await Task.findByIdAndUpdate(id , {$set: req.body }, {new: true, runValidators: true})
        if (!updateTask) {
            return res.status(404).json('Task Not Found')
        } else {
            updates.forEach((update) => updateTask[update] = req.body[update])
            await updateTask.save()
            res.status(200).json(updateTask)
        }

    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const id = req.params.id
        // const deleteTask = await Task.findByIdAndDelete(id)
        const deleteTask = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!deleteTask){
            return res.status(404).json('Task Not Found')
        } else {
            res.status(200).json('Task deleted successfully')
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
})

module.exports = router