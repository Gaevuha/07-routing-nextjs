import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] || 'All';
  const tagParam = tag === 'All' ? undefined : tag;

  const data = await fetchNotes('', 1, 12, tagParam);

  if (tagParam && data.notes.length === 0) {
    notFound();
  }

  return (
    <NotesClient
      initialData={data}
      initialSearchQuery=""
      initialPage={1}
      initialTag={tag}
    />
  );
}
