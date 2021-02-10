const mongoose = require('mongoose')
const env = require('dotenv')
env.config()

module.exports = async () => {
    await mongoose.connect(process.env.ZJ11DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })

    return mongoose
}