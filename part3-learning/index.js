require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());

const Note = require("./models/note");

// const mongoose = require("mongoose");

// const url = process.env.MONGODB_URI;

// mongoose.set("strictQuery", false);

// mongoose.connect(url);

// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean
// });

// const Note = mongoose.model("Note", noteSchema);

// const mongoose = require('mongoose')

// // const password = process.argv[2]

// // const url = `mongodb+srv://awesomebunny:${password}@cluster0.kizfh.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;
// const url = process.env.MONGODB_URI;

// mongoose.set('strictQuery',false);
// mongoose.connect(url);

// const noteSchema = new mongoose.Schema({
//     content: String,
//     important: Boolean,
// });

// noteSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString();
//         delete returnedObject._id;
//         delete returnedObject._v;
//     }
// });

// const Note = mongoose.model('Note', noteSchema);


//#region NOTES --------------------------------------------------------------------------------------------------------------------------------------

    let notes = [
        {
            id: "1",
            content: "HTML is easy",
            important: true
        },
        {
            id: "2",
            content: "Browser can execute only JavaScript",
            important: false
        },
        {
            id: "3",
            content: "GET and POST are the most important methods of HTTP protocol",
            important: true
        }
    ];

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region MIDDLEWARE FUNCTIONS -----------------------------------------------------------------------------------------------------------------------
    
    const requestLogger = (request, response, next) => {
        console.log('Method:', request.method)
        console.log('Path:  ', request.path)
        console.log('Body:  ', request.body)
        console.log('---')
        next()
    };

    const unknownEndpoint = (request, response) => {
        response.status(404).send({error: "Unknown Endpoint..."});
    };

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region CALL MIDDLEWARE ----------------------------------------------------------------------------------------------------------------------------
    
    app.use(express.json());
    app.use(requestLogger);
    app.use(express.static("dist"));

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region FUNCTIONS ----------------------------------------------------------------------------------------------------------------------------------

    const generateId = () => {
        const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
        return String(maxId + 1);
    };

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region ROUTES -------------------------------------------------------------------------------------------------------------------------------------

    app.get("/", (request, response) => {
        response.send("<h1>Hello World!</h1>");
    });

    app.get("/api/notes", (request, response) => {
        Note.find({}).then(notes => {
            response.json(notes);
        });
    });

    app.get("/api/notes/:id", (request, response) => {
        const id = request.params.id;
        const note = notes.find(note => note.id === id);

        if (note) {
            response.json(note);
        } else {
            response.statusMessage = `There is no note with the id of ${id} in the database`;
            response.status(404).end();
        };
    });

    app.delete("/api/notes/:id", (request, response) => {
        const id = request.params.id;
        notes = notes.filter(note => note.id !==id);
        response.status(204).end();

        Note.findById(request.params.id).then(note => {
            response.json(note);
        });
    });



    app.post("/api/notes", (request, response) => {
        const body = request.body;

        if (body.content === undefined) {
            return response.status(400).json({
                error: "Body Content Missing..."
            });
        };

        const note = new Note({
            content: body.content,
            important: Boolean(body.important) || false
            // id: generateId()
        });

        note.save().then(savedNote => {
            response.json(savedNote);
        });

        // notes = notes.concat(note);

        // console.log(note);
        // response.json(note);
    });

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region CALL MIDDLEWARE ----------------------------------------------------------------------------------------------------------------------------

    app.use(unknownEndpoint);

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region APP LISTEN ---------------------------------------------------------------------------------------------------------------------------------

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------
