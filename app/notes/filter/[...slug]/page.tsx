
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import Notes from "@/components/Notes/Notes.client";

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug?.[0] ?? "all";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        search: "",
        tag: tag === "all" ? undefined : tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Notes tag={tag} />
      </main>
    </HydrationBoundary>
  );
}