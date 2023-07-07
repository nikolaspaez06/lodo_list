const mongoose = require("mongoose")
const Schemas = mongoose.Schema;


const todoSchemas = new Schemas({
    todo:{
        type: String,
        required: true

    }
})
const todo = mongoose.model("todo",todoSchemas)
module.exports = todo