require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('63a089b8489dadad66046f82', { age: 30}).then((user) => {
//     console.log(user)
//     return User.countDocuments({age: 30})
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age: age})
    const count = await  User.countDocuments({ age })

    return count
}

updateAgeAndCount('63a089b8489dadad66046f82', 29).then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})