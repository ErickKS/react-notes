import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

import { Input } from "./components/input";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import logo from "./assets/logo.svg";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const noteOnStorage = localStorage.getItem("notes");

    if (noteOnStorage) return JSON.parse(noteOnStorage);

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const noteArray = [newNote, ...notes];

    setNotes(noteArray);

    localStorage.setItem("notes", JSON.stringify(noteArray));
  }

  function onNoteDelete(id: string) {
    const noteArray = notes.filter((note) => {
      return note.id !== id;
    });

    setNotes(noteArray);

    localStorage.setItem("notes", JSON.stringify(noteArray));

    toast.error("Note deleted successfully");
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value;

    setSearch(query);
  }

  const filteredNotes =
    search !== "" ? notes.filter((note) => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) : notes;

  return (
    <div className="max-w-6xl mx-auto my-12 space-y-6 px-4">
      <img src={logo} alt="NLW Expert" className="mx-auto" />

      <form className="w-full">
        <Input onChange={handleSearch} />
      </form>

      <div className="h-px bg-gray" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
        ))}
      </div>
    </div>
  );
}
