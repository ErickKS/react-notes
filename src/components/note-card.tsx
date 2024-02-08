import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { X } from "lucide-react";
import clsx from "clsx";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDelete: (id: string) => void;
}

export function NoteCard({ note, onNoteDelete }: NoteCardProps) {
  const date = formatDistanceToNow(note.date, { locale: enUS, addSuffix: true });
  const dateFormatted = date.charAt(0).toUpperCase() + date.slice(1);

  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-4 p-5 border-2 border-[#151515] rounded-lg bg-dark-gray text-left overflow-hidden outline-none transition-all focus-visible:border-white hover:bg-[#151515]">
        <span className="text-sm font-medium text-white">{dateFormatted}</span>

        <p className="leading-6 text-gray">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-950 to-zinc-950/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className={clsx(
            "fixed inset-0 flex flex-col w-full bg-dark-gray overflow-hidden outline-none",
            "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[640px] sm:h-[60vh] sm:rounded-lg"
          )}
        >
          <div className="flex flex-1 flex-col gap-6 p-5">
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium text-white">{dateFormatted}</span>

              <Dialog.Close className="group p-1.5 rounded-full transition-all hover:bg-white">
                <X className="size-5 stroke-white transition-all group-hover:stroke-black" />
              </Dialog.Close>
            </div>

            <div className="flex flex-1 flex-col">
              <p className="leading-6 text-white">{note.content}</p>
            </div>
          </div>

          <button
            onClick={() => onNoteDelete(note.id)}
            className="w-full py-4 text-center text-sm text-white bg-red/80 font-medium outline-none transition-all hover:opacity-80"
          >
            Delete note
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
