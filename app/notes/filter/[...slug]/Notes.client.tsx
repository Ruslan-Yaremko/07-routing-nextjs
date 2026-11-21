
"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/types/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Обробка пошуку та негайне скидання сторінки
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Debounce пошуку
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Отримання нотаток
  const {
    data,
    isLoading,
    isError,
  } = useQuery<FetchNotesResponse>({
    queryKey: [
      "notes",
      currentPage,
      debouncedQuery,
      tag,
    ],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedQuery,
        tag: tag === "all" ? undefined : tag,
      }),
  });

  // Відкриття модального вікна
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Закриття модального вікна
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  if (isError) {
    return (
      <p>
        Something went wrong. Please try again.
      </p>
    );
  }

  return (
    <div>
      {/* Пошук */}
      <SearchBox
        value={searchQuery}
        onSearch={handleSearch}
      />

      {/* Кнопка створення нотатки */}
      <button
        type="button"
        onClick={handleOpenModal}
      >
        Create note
      </button>

      {/* Список нотаток */}
      {data?.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {/* Якщо нотаток немає */}
      {data && data.notes.length === 0 && (
        <p>No notes found.</p>
      )}

      {/* Пагінація */}
      {data && (
        <Pagination
          page={currentPage}
          totalPages={data.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Модальне вікно */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}