
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { createNote } from "@/lib/api";
import type { NoteFormValues } from "@/types/note";
import styles from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),

  content: Yup.string()
    .max(500, "Content must be at most 500 characters"),

  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Invalid tag"
    )
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      onClose();
    },
  });

  const initialValues: NoteFormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };

  const handleSubmit = (values: NoteFormValues) => {
    mutation.mutate({
      title: values.title.trim(),
      content: values.content.trim(),
      tag: values.tag,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className={styles.form}>
        <h2>Create a note</h2>

        <Field
          type="text"
          name="title"
          placeholder="Note title"
        />
        <ErrorMessage
          name="title"
          component="p"
        />

        <Field
          as="textarea"
          name="content"
          placeholder="Note content"
          rows={4}
        />
        <ErrorMessage
          name="content"
          component="p"
        />

        <Field as="select" name="tag">
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </Field>
        <ErrorMessage
          name="tag"
          component="p"
        />

        {mutation.isError && (
          <p>Could not create the note. Try again.</p>
        )}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create note"}
        </button>

        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </Form>
    </Formik>
  );
}