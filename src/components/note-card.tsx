import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDelete: (id: string) => void;
}

export function NoteCard({ note, onNoteDelete }: NoteCardProps) {
  const date = formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true });
  const dateFormatted = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-4 p-5 border-2 border-transparent rounded-md bg-zinc-900 text-left overflow-hidden outline-none transition-all focus-visible:border-lime-400 hover:border-zinc-600">
        <span className="text-sm font-medium text-zinc-300">{dateFormatted}</span>

        <p className="text-sm leading-6 text-zinc-400">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-950 to-zinc-950/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed inset-0 flex flex-col w-full overflow-hidden outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[640px] sm:h-[60vh] bg-zinc-700 sm:rounded-md">
          <Dialog.Close className="absolute top-0 right-0 p-1.5 bg-zinc-800 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-zinc-300">{dateFormatted}</span>

            <p className="text-sm leading-6 text-zinc-400">{note.content}</p>
          </div>

          <button
            onClick={() => onNoteDelete(note.id)}
            className="group w-full py-4 bg-zinc-800 text-center text-sm text-slate-300 font-medium outline-none"
          >
            Deseja <span className="text-red-500 group-hover:underline">apagar essa nota</span>?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}