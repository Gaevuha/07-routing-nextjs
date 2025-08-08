'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
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
  initialSearchQuery: string;
  initialPage: number;
  initialTag?: string;
}

export default function NotesClient({
  initialData,
  initialSearchQuery,
  initialPage,
  initialTag,
}: NotesClientProps) {
  const params = useParams();

  // Визначаємо поточний тег: з URL або initialTag, або 'All'
  const currentTag =
    Array.isArray(params.slug) && params.slug.length > 0
      ? params.slug[0]
      : initialTag || 'All';

  // Якщо тег "All" — не передаємо його в API
  const tagParam = currentTag === 'All' ? undefined : currentTag;

  // Ініціалізуємо стани з початкових пропсів
  const [inputValue, setInputValue] = useState(initialSearchQuery);
  const [page, setPage] = useState(initialPage);
  const [searchQuery] = useDebounce(inputValue, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Скидаємо сторінку на 1 при зміні пошукового запиту або тегу
  useEffect(() => {
    setPage(1);
  }, [searchQuery, tagParam]);

  // Запит даних з React Query, передаємо initialData для кешу
  const { data, isLoading, isError, error, refetch } =
    useQuery<FetchNotesResponse>({
      queryKey: ['notes', searchQuery, page, tagParam],
      queryFn: () => fetchNotes(searchQuery, page, 12, tagParam),
      initialData,
      refetchOnMount: false,
    });

  const handleNoteCreated = () => {
    setIsModalOpen(false);
    refetch();
  };

  if (isLoading) return <Loading />;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={setInputValue} />

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
            onCloseModal={() => setIsModalOpen(false)}
            onNoteCreated={handleNoteCreated}
          />
        </Modal>
      )}
    </div>
  );
}
