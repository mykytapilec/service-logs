import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useDispatch } from 'react-redux';
import { deleteLog } from '../redux/slices/logsSlice';

interface DeleteLogModalProps {
  logId: string;
  open: boolean;
  onClose: () => void;
}

export const DeleteLogModal: React.FC<DeleteLogModalProps> = ({ logId, open, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(deleteLog(logId));
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/30" />
      <Dialog.Content className="fixed top-1/2 left-1/2 bg-white p-6 rounded shadow -translate-x-1/2 -translate-y-1/2 w-80">
        <Dialog.Title className="text-lg font-bold mb-4">Confirm Deletion</Dialog.Title>
        <p className="mb-4">Are you sure you want to delete this service log?</p>
        <div className="flex justify-end gap-2">
          <button className="bg-gray-400 text-white rounded p-2" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-red-500 text-white rounded p-2" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};
