import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api';

export default async function Default() {
  const data = await fetchNotes();

  return <NoteList notes={data.notes} />;
}
