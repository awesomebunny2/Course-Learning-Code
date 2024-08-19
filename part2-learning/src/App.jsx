import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Note from './components/Note'



const App = (props) => {

	const [notes, setNotes] = useState(props.notes);

	const [newNote, setNewNote] = useState("");

	const [showAll, setShowAll] = useState(true);

	const addNote = (event) => {
		event.preventDefault();
		const noteObj = {
			content: newNote,
			important: Math.random() < 0.5,
			id: String(notes.length + 1)
		};

		setNotes(notes.concat(noteObj));
		setNewNote("");
	};

	const handleNoteChange = (event) => {
		console.log(event.target.value);
		setNewNote(event.target.value);
	};

	const notesToShow = showAll ? notes : notes.filter(note => note.important);

	return (
		<>
			<h1>Notes</h1>
			<>
				<button onClick={() => setShowAll(!showAll)}>
					Show {showAll ? "Important" : "All"} Notes
				</button>
			</>
			<ul>
			{notesToShow.map(note => 
				<Note key ={note.id} note={note} />
			)}
			</ul>
			<form onSubmit={addNote}>
				<input defaultValue={newNote} onChange={handleNoteChange}/>
				<button type="submit">Save</button>
			</form>
		</>
	);
};

export default App
