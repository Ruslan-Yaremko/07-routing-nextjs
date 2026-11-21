"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fetchNotes } from "@/lib/api";
import type { FetchNotesResponse } from "@/types/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

 
  if (isLoading) {
    return <p>Loading notes...</p>;
  }

  // Стан помилки
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
        onSearch={setSearchQuery}
      />

      {/* Список нотаток */}
      {data && (
        <>
          <NoteList notes={data.notes} />

          {/* Пагінація */}
          <Pagination
            page={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}