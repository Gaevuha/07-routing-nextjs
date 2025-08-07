'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';

import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

import css from './NotesPage.module.css';
import fetchNotesProps from '@/lib/api';

interface NotesClientProps {
  initialData: fetchNotesProps;
  initialSearchQuery: string;
  initialPage: number;
  initialTag?: string;
}

export default function NotesClient({
  initialData,
  initialSearchQuery,
  initialPage,
  initialTag = '',
}: NotesClientProps) {
  const [inputValue, setInputValue] = useState(initialSearchQuery);
  const [page, setPage] = useState(initialPage);
  const [searchQuery] = useDebounce(inputValue, 300);
  const [tag] = useState(initialTag);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, tag]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['notes', searchQuery, page, tag],
    queryFn: () => fetchNotes(searchQuery, page, 12, tag),
    initialData,
    refetchOnMount: false,
  });

  const handleNoteCreated = () => {
    closeModal();
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={setInputValue} />

        {data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </div>

      {data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm
            onCloseModal={closeModal}
            onNoteCreated={handleNoteCreated}
          />
        </Modal>
      )}
    </div>
  );
}
