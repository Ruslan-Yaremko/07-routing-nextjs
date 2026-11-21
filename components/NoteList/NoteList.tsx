"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api";
import styles from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
  });

  if (notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.item}>
          <Link href={`/notes/${note.id}`} className={styles.link}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <span>{note.tag}</span>
          </Link>

          <button
            type="button"
            className={styles.deleteButton}
            onClick={() => deleteMutation.mutate(note.id)}
            disabled={deleteMutation.isPending}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}