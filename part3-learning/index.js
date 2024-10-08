require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());

const Note = require("./models/note");


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


//#region REQUEST LOGGER -----------------------------------------------------------------------------------------------------------------------

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};



//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region CALL MIDDLEWARE ----------------------------------------------------------------------------------------------------------------------------

app.use(express.static("dist"));
app.use(express.json());
app.use(requestLogger);


//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region FUNCTIONS ----------------------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
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

app.get("/api/notes/:id", (request, response, next) => {
    Note.findById(request.params.id).then(note => {
        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        };
    }).catch(error => next(error));
    // const id = request.params.id;
    // const note = notes.find(note => note.id === id);

    // if (note) {
    //     response.json(note);
    // } else {
    //     response.statusMessage = `There is no note with the id of ${id} in the database`;
    // };
});

app.delete("/api/notes/:id", (request, response, next) => {

    Note.findByIdAndDelete(request.params.id).then(_result => {
        response.status(204).end();
    }).catch(error => next(error));

});

app.put("/api/notes/:id", (request, response, next) => {
    const { content, important } = request.body;

    // const note = {
    //     content: body.content,
    //     important: body.important
    // };

    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: "query" }
    ).then(updatedNote => {
        response.json(updatedNote);
    }).catch(error => next(error));
});



app.post("/api/notes", (request, response, next) => {
    const body = request.body;

    // if (body.content === undefined) {
    //     return response.status(400).json({
    //         error: "Body Content Missing..."
    //     });
    // };

    const note = new Note({
        content: body.content,
        important: Boolean(body.important) || false
        // id: generateId()
    });

    note.save().then(savedNote => {
        response.json(savedNote);
    }).catch(error => next(error));

    // notes = notes.concat(note);

    // console.log(note);
    // response.json(note);
});




//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region ERROR HANDLING ----------------------------------------------------------------------------------------------------------------------------

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "Unknown Endpoint..." });
};

app.use(unknownEndpoint);


const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "Malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    };
    next(error);
};

app.use(errorHandler);

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region APP LISTEN ---------------------------------------------------------------------------------------------------------------------------------

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------
