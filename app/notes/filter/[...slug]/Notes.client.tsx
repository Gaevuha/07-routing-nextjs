'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Loading from '@/app/loading';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './NotesPage.module.css';
import type { FetchNotesResponse } from '@/lib/api';

interface NotesClientProps {
  initialData: FetchNotesResponse;
  initialTag?: string;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const tag = initialTag ?? 'All';
  const tagParam = tag === 'All' ? undefined : tag;

  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearchQuery] = useDebounce(inputValue, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error, refetch } =
    useQuery<FetchNotesResponse>({
      queryKey: ['notes', tagParam ?? 'All', debouncedSearchQuery, page],
      queryFn: () => fetchNotes(debouncedSearchQuery, page, 12, tagParam),
      initialData,
      refetchOnMount: false,
      placeholderData: keepPreviousData,
    });

  const handleNoteSaved = async () => {
    setIsModalOpen(false);
    await refetch();
  };

  if (isLoading) return <Loading />;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onSearch={value => {
            setInputValue(value);
            setPage(1);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </div>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data && data.notes.length === 0 && <p>No notes found.</p>}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSaved={handleNoteSaved}
            onCloseModal={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
