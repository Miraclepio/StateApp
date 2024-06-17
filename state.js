const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB using the URL from the environment variable
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Define the schema for a state
const StateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capital: {
        type: String,
        required: true
    },
    governor: {
        type: String,
        required: true
    }
});

// Create the model from the schema
const State = mongoose.model('State', StateSchema);

// Create a new state
app.post('/create', async (req, res) => {
    try {
        const state = new State(req.body);
        await state.save();
        res.status(201).send({message:"successfully created to the DataBase", data:state})
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all states
app.get('/getall', async (req, res) => {
    try {
        const states = await State.find();
        if (states=="" || states==0) {
            return res.status(404).send("not found")
        }
        res.status(200).json({message:`this are the currect information and  there are ${states.length} in the DataBase`,
        data:states});
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a state by ID
app.get('/getone/:id', async (req, res) => {
    try {
        const state = await State.findById(req.params.id);
        if (!state) {
            return res.status(404).send("NOT FOUND");
        }
        res.status(200).json({message:`thE  id:${req.params.id}  is below:`,
            data:state});
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a state by ID
app.put('/Update/:id', async (req, res) => {
    try {
        const state = await State.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!state) {
            return res.status(404).send("NOT FOUND");
        }
        res.status(200).json({message:`updated successfully`,
            data:state});
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a state by ID
app.delete('/delete/:id', async (req, res) => {
    try {
        const state = await State.findByIdAndDelete(req.params.id);
        if (!state) {
            return res.status(404).send("NOT FOUND");
        }
        res.status(200).json({message:`DELETED Successfully from the Data Base`});
    } catch (error) {
        res.status(500).send(error);
    }
});

// Start the server
const PORT = process.env.PORT || 9696;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
