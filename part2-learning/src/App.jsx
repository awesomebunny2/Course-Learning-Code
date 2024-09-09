import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'
import Note from './components/Note'
import noteService from "./services/notes"

const Notification = ({ message }) => {
	if (message === null) {
		return null;
	};

	return (
		<div className="error">
			{message}
		</div>
	)
};


const Footer = () => {
	const footerStyle = {
		color: "grey",
		fontStyle: "italic",
		fontSize: 12,
		textAlign: "center"
	};
	return (
		<div style={footerStyle}>
			<br/>
			<br/>
			<em>©2024 Note App, DevOps Department of Developer Solutions, Mail Shark™</em>
		</div>
	);
};

const App = () => {

	const [notes, setNotes] = useState(null);

	const [newNote, setNewNote] = useState("");

	const [showAll, setShowAll] = useState(true);

	const [errorMessage, setErrorMessage] = useState(null);



	//useEffect only runs after the App is rendered, and the [] at the end tells it to only run the first time the app is rendered, not any other times the app component is triggered
	useEffect(() => {
		console.log("effect");
		noteService.getAll().then(initialNotes => {
			setNotes(initialNotes);
		});
	}, []);

	if (!notes) {
		return null;
	};


	const toggleImportanceOf = (id) => {
		const url = `http://localhost:3001/notes/${id}`;

		//returns all properties of the note with the provided id
		const note = notes.find(n => n.id === id);

		//creates a copy of the note object with inverted values for the "important" property (true -> false & false -> true)
		//! it's important to make a copy of note and modify that instead of directly modifying the notes state. Directly modifying a state breaks undo/redo functionality and makes debugging previous states vs current states more difficult since they will be the same. Instead, modify a copy of the state and then push it to update the state with setNotes, this way the previous state will remain in memory or something like that 
		const changedNote = {...note, important: !note.important};

		noteService.update(id, changedNote).then(returnedNote => {
			//rebuilds notes in the setNotes state, but once it gets to the changed id, it uses the response instead of the original note value
			setNotes(notes.map(n => n.id !== id ? n : returnedNote));
		}).catch(error => {

			setErrorMessage(`The note "${note.content}" was already deleted from the server`);

			setTimeout(() => {
				setErrorMessage(null)
			}, 5000);

			setNotes(notes.filter(n => n.id !== id));
		});

	};



	console.log("Render", notes.length, "notes");

	const addNote = (event) => {
		event.preventDefault();
		const noteObj = {
			content: newNote,
			important: Math.random() < 0.5,
			// id: String(notes.length + 1)
		};


		noteService.create(noteObj).then(returnedNote => {
			console.log(returnedNote);
			setNotes(notes.concat(returnedNote));
			setNewNote("");
		});

	};

	const handleNoteChange = (event) => {
		console.log(event.target.value);
		setNewNote(event.target.value);
	};

	const notesToShow = showAll ? notes : notes.filter(note => note.important);

	return (
		<>
			<h1>Notes</h1>
			<Notification message = {errorMessage}/>
			<>
				<button onClick={() => setShowAll(!showAll)}>
					Show {showAll ? "Important" : "All"} Notes
				</button>
			</>
			<ul>
			{notesToShow.map(note => 
				<Note key ={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
			)}
			</ul>
			<form onSubmit={addNote}>
				<input defaultValue={newNote} onChange={handleNoteChange}/>
				<button type="submit">Save</button>
			</form>

			<Footer/>
		</>
	);
};

export default App
