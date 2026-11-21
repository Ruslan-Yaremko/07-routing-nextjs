"use client";

import { useRouter } from "next/navigation";
import NoteDetails from "@/components/NoteDetails/NoteDetails.client";
import Modal from "@/components/Modal/Modal";

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({
  id,
}: NotePreviewClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <NoteDetails id={id} />
    </Modal>
  );
}