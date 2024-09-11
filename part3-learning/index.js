const express = require("express");
const app = express();

const cors = require("cors");

app.use(cors());

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
        response.json(notes);
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
    });



    app.post("/api/notes", (request, response) => {
        const body = request.body;

        if (!body.content) {
            return response.status(400).json({
                error: "Body Content Missing..."
            });
        };

        const note = {
            content: body.content,
            important: Boolean(body.important) || false,
            id: generateId()
        };

        notes = notes.concat(note);

        console.log(note);
        response.json(note);
    });

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region CALL MIDDLEWARE ----------------------------------------------------------------------------------------------------------------------------

    app.use(unknownEndpoint);

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------


//#region APP LISTEN ---------------------------------------------------------------------------------------------------------------------------------

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

//#endregion -----------------------------------------------------------------------------------------------------------------------------------------
