const express = require('express');
const mongoose = require ('mongoose')
const bodyParser = require('body-parser');
const { json } = require('express');

const app = express();
const port = process.env.PORT || 8082;


//Connecting to mongoose
mongoose.connect('mongodb://localhost/',{
    useNewURLParser: true,
    useUnifiedTopology: true,
});

app.listen(port, () => {
    console.log(`Server is up at Port :${port}`);
})


const contactSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
});

const Contact = mongoose.model('Contact', contactSchema);

// Middleware

app.use(bodyParser.json())

// My Routes

app.post('/v1/contacts', async (req, res) => {

    try {
        let contact = new Contact(req.body);
        let result = await contact.save();
        res.status(201).json(result);
    }
    catch(err){
        res.status(400).json({err: err.message});
    }
});

app.get('/v1/contacts', async (req, res) => {
    
    try {
        let contacts = await Contact.find();
        res.status(200).json(contacts);
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
});

app.get('/v1/contacts/:id', async (req, res) => {
    
    try {
        let contact = await Contact.findById(req.params.id);
        if(contact){
            res.status(200).json(contact);
        } else {
            res.status(404).json({err: "There is no contact with that id"})
        }
    }
    catch(err){
        res.status(500).json({err: err.message});
    }
});

app.delete('/v1/contacts/:id', async(req, res) => {
    try{
        let result = await Contact.deleteOne({_id: req.params.id});
        if(result.deletedCount === 1){
            res.sendStatus(204)
        }
        else{
            res.status(404),json({ err: "There is no contact with that id"})
        }
    }
    catch(err) {
        res.status(500).json({err: err.message});
    }
});

app.put('/v1/contacts/:id', async (req, res) => {

    try{
        let result = await Contact.updateOne({ _id: req.params.id }, { $set: req.body });
    
        if(result.modifiedCount === 1){
            res.sendStatus(200);
        }
        else{
            res.status(404).json({ err: "There is no contact with that id"})
        }
    }
    catch (err){
        res.status(500).json({err: err.message});
    }
});

app.patch('/v1/contacts/:id', async (req, res) => {

    try{
        let result = await Contact.updateOne({ _id: req.params.id }, { $set: req.body });
    
        if(result.modifiedCount === 1){
            res.sendStatus(204);
        }
        else{
            res.status(404).json({ err: "There is no contact with that id"})
        }
    }
    catch (err){
        res.status(500).json({err: err.message});
    }
});

// app.use((error, req, res, next))