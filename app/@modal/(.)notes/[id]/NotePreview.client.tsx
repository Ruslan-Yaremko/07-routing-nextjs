
"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import NoteDetails from "@/components/NoteDetails/NoteDetails.client";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({
  id,
}: NotePreviewClientProps) {
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

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading...</p>}

      {isError && <p>Something went wrong. Please try again.</p>}

      {note && !isLoading && !isError && (
        <NoteDetails id={id} />
      )}
    </Modal>
  );
}