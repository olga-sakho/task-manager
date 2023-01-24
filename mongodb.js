// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectId = mongodb.ObjectId

const { MongoClient, ObjectID } = require('mongodb')

const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id.id.length)
// console.log(id.toHexString().length)

MongoClient.connect(connectionUrl, { useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database')
    }

    const db = client.db(databaseName)

    //  

    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 25
    //     }, {
    //         name: 'Mick',
    //         age: 30  
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert users')
    //     }
            
    //     console.log(result)
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean the house',
    //         completed: true
    //     },{
    //         description: 'Renew inspection',
    //         completed: false
    //     }, {
    //         description: 'Pot plants',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert tasks')
    //     }

    //     console.log(result)
    // })

    // db.collection('users').findOne({name: 'Oleg'}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     //console.log(user)
    // })

    // db.collection('users').find({age: 29}).toArray((error, users) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(users)
    // })

    // db.collection('tasks').findOne({}, {sort:{$natural:-1}}, (error, task) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(tasks)
    // })

    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("639af9503614e66d07bb74de")
    // }, {
    //     $set: {
    //         name: 'John'
    //     }
    // })

    // updatePromise.then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // db.collection('users').deleteMany({
    //     age: 29
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        description: "Pot plants"
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })
})