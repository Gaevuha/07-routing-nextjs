import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function FilteredNotesPage({ params }: Props) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0];
  const tagParam = tag === 'all' ? undefined : tag;

  const data = await fetchNotes('', 1, 12, tagParam);

  if (tag && data.notes.length === 0) {
    notFound();
  }

  return (
    <NotesClient
      initialData={data}
      initialSearchQuery=""
      initialPage={1}
      initialTag={tagParam || ''}
    />
  );
}
