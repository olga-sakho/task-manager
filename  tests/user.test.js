// const request = require('supertest')
// const jwt = require('jsonwebtoken')
// const app = require('../src/app')
// const mongoose = require('mongoose')
// const User = require('../src/models/user')

// const userOneId = new mongoose.Types.ObjectId()

// const userOne = {
//     _id: userOneId,
//     name: 'Mike',
//     email: 'mike@example.com',
//     password: '45qwerty!',
//     tokens: [{
//         token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
//     }]
// }

// beforeEach(async () => {
//     await User.deleteMany()
//     await new User(userOne).save()
// })

// afterAll(() => {
//     mongoose.connection.close();
//    },100000);

// test('Should sign up a new user', async () => {
//     await request(app).post('/users').send({
//         name: 'OlgaTest',
//         email: 'olga@example.com',
//         password: 'MyPass777!'
//     }).expect(201)
// })

// test('Should login existing user', async () => {
//     await request(app).post('/users/login').send({
//         email: userOne.email,
//         password: userOne.password
//     }).expect(200)
// })

// test('Should not login nonexisting user', async () => {
//     await request(app).post('/users/login').send({
//         email: userOne.email,
//         password:'isnotmypassword'
//     }).expect(400) 
// })

// test('Should get profile for user', async () => {
//     await request(app)
//         .get('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
// })

const request = require('supertest')
const User = require('../src/models/user')
const app = require('../src/app')
const { userOneId, userOne, setupDatabase} =require('./fixtures/db')


beforeEach(setupDatabase)

test('Should singup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'masa',
        email: 'marcsantamariatomasa@example.com',
        password: 'mA77667-'
    }).expect(201)


    // Assert that the database was changed correctly

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
    
    //assertions about the response

    expect(response.body).toMatchObject({
        user: {
            name: 'masa',
            email: 'marcsantamariatomasa@example.com',
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('mA77667-')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexisting user', async () => {
    await request(app).post('/users/login').send({
        email: 'john@example.com',
        password:'John123!-'
    }).expect(400) 
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete accouts for user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
    

})

test('Should not delete accouts for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401) 
})

// test('Should upload avatar image', async () => {
//     await request(app)
//         .post('/users/me/avatar')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .attach('avatar','tests/fixtures/profile-pic.jpg')
//         .expect(200)
//     const user = await User.findById(userOneId)
//     expect(user.avatar).toEqual(expect.any(Buffer))
// })

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({'name': 'John'})
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('John')
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({'localization': 'Mississipi'})
        .expect(400)
})
