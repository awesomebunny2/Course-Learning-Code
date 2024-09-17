const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("Give password as argument");
    process.exit(1);
};

const password = process.argv[2];

const url = `mongodb+srv://awesomebunny:${password}@cluster0.kizfh.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean
});

const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//     content: "But React is difficult",
//     important: false
// });

// note.save().then(result => {
//     console.log("Note saved!");
//     mongoose.connection.close();
// });

Note.find({ important: true }).then(result => {
    result.forEach(note => {
        console.log(note);
    });
    mongoose.connection.close();
});

