const mongoose = require("mongoose");

// create a schema
const messageSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, reqired: true },
    date: { type: Number, required: true },
})

// compile the schema into a model (named 'message')
const Message = mongoose.model('message', messageSchema);

// export the model
module.exports = Message;