
"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import styles from "./NoteDetails.module.css";

interface NoteDetailsProps {
  id: string;
}

export default function NoteDetails({ id }: NoteDetailsProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p className={styles.message}>Loading note...</p>;
  }

  if (isError || !note) {
    return <p className={styles.message}>Could not load this note.</p>;
  }

  return (
    <main className={styles.container}>
      <button
        type="button"
        className={styles.backLink}
        onClick={() => router.back()}
      >
        ← Back to notes
      </button>

      <article className={styles.card}>
        <h1>{note.title}</h1>
        <p className={styles.content}>{note.content}</p>
        <p className={styles.tag}>Category: {note.tag}</p>

        <p className={styles.date}>
          Created: {new Date(note.createdAt).toLocaleString()}
        </p>
      </article>
    </main>
  );
}