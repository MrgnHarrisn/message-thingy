// imports
const express = require('express');
const path = require('path');
require('dotenv').config();
const Message = require('./models/message')

// web server setup
const app = express();
app.use(express.json());

// public/ is a static front-end
app.use('/', express.static(path.resolve(__dirname, 'public')));

// Database
const mongoose = require("mongoose");
const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_url = `mongodb+srv://${user}:${password}@cluster0.nnjaw4t.mongodb.net/?retryWrites=true&w=majority`
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(db_url, options).then(() => {
    console.log('successfully connected!')
}).catch((e) => {
    console.error(e, 'could not connect!')
});

// CRUD: Read all messages
app.get('/api/all-messages', async (request, response) => {

	const messages = await Message.find({});

	response.json(messages);

})

// CRUD: Create 1 message
app.post('/api/create-message', async (request, response) => {
    // response.status(500).send("Can't Create");
	const message_document = {
		author: request.body.author,
		content: request.body.content,
		date: request.body.date,
	};

	const db_info = await Message.create(message_document);

	console.log(db_info, 'api/create-message response');

	response.send("Success! created message")

})

app.post('/api/delete-message', async (req, res) => {
	const id = req.body.id;
	const db_info = await Message.findOneAndRemove({_id: id})
	console.log(db_info, '/api/delete response');
	res.status(200).send("Success! deleted message")
})

app.post('/api/edit-message', async (req, res) => {
	const id = req.body.id;
	const content = req.body.content;
	const db_info = await Message.updateOne(
		{_id: id},
		{$set: {content: content}}
	)

		console.log(db_info, 'api/edit-message response');
		res.status(200).send("Success! edited Message")

})

// start the server on port 8080
app.listen(8080, () => {
	console.log('Server (re)started!');
})
