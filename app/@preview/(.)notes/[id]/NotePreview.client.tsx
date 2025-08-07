'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      <NoteDetailsClient id={id} />
    </Modal>
  );
}
