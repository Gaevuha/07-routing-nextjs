// app/@preview/(.)notes/[id]/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';

type Props = {
  params: { id: string };
};

export default function NotePreview({ params }: Props) {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      <NoteDetailsClient id={params.id} />
    </Modal>
  );
}
