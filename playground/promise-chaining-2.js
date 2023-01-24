require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('63a17ec9a44c9a8c6df7a752').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.log(error)
// })

const deletTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await  Task.countDocuments({ completed: false })

    return count
}

deletTaskAndCount('63a2cf655e11a2c8b1158df3').then((count) => {
    console.log(count)
}).catch((error) => {
    console.log(error)
})