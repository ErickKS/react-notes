import { ChangeEvent, FormEvent, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null = null;

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleContentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = event.target;

    setContent(value);

    if (value === "") setShouldShowOnBoarding(true);
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (!content) return;

    onNoteCreated(content);
    setContent("");
    setShouldShowOnBoarding(true);

    toast.success("Nota criada com sucesso");
  }

  function handleStartRecord() {
    const isSpeechRecognitionAPIAvailable = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("infleizmente seu navegador não suporta a API de gravação!");
      return;
    }

    setIsRecording(true);
    setShouldShowOnBoarding(false);

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognitionAPI();

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) speechRecognition.stop();
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="relative flex flex-col gap-4 p-5 rounded-md bg-zinc-800 border-2 border-transparent text-left outline-none overflow-hidden focus-visible:border-lime-400 hover:border-zinc-600">
        <span className="text-sm font-medium text-zinc-100">Adicionar nota</span>

        <p className="text-sm leading-6 text-zinc-400">Grave uma nota em áudio que será convertida para texto automaticamente.</p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed inset-0 flex flex-col w-full overflow-hidden outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[640px] sm:h-[60vh] bg-zinc-700 sm:rounded-md">
          <Dialog.Close className="absolute top-0 right-0 p-1.5 bg-zinc-800 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-zinc-300 capitalize">Adicionar uma nota</span>

              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-zinc-400">
                  Comece{" "}
                  <button type="button" onClick={handleStartRecord} className="font-medium text-lime-400 hover:underline">
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button type="button" onClick={handleStartEditor} className="font-medium text-lime-400 hover:underline">
                    utilize apenas texto
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  autoFocus
                  className="flex-1 bg-transparent text-sm leading-6 resize-none outline-none"
                />
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="group flex justify-center items-center gap-2 w-full py-4 bg-zinc-900 text-center text-sm text-slate-300 font-semibold outline-none transition-all hover:text-slate-100"
              >
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                Gravando! (clique p/ interromper)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="group w-full py-4 bg-lime-400 text-center text-sm text-black font-semibold outline-none transition-all hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
