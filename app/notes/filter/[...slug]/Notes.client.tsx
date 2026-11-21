
"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import styles from "./Notes.module.css";

export default function Notes() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
      }),
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (isError) return <p>Failed to load notes.</p>;

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h1>My notes</h1>

        <SearchBox
          value={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create note
        </button>
      </div>

    <NoteList notes={data?.notes ?? []} />

  {data && data.totalPages > 1 && (
  <Pagination
    page={page}
    totalPages={data.totalPages}
    onPageChange={setPage}
  />
)}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </section>
  );
}