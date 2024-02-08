import { ChangeEvent, FormEvent, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mic, Plus, Type, X } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

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

    speechRecognition.lang = "en-US";
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

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (!content) return;

    onNoteCreated(content);
    setContent("");
    setShouldShowOnBoarding(true);

    toast.success("Note created successfully");
  }

  function handleOpenModalChange() {
    setIsRecording(false);
    if (speechRecognition !== null) speechRecognition.stop();

    setContent("");
    setShouldShowOnBoarding(true);
  }

  return (
    <Dialog.Root onOpenChange={handleOpenModalChange}>
      <Dialog.Trigger
        className={clsx(
          "flex flex-col justify-center items-center gap-2 rounded-md bg-dark-gray border-2 border-dark-gray outline-none overflow-hidden transition-all",
          "text-left",
          "focus-visible:bg-black focus-visible:border-white  hover:bg-black hover:border-white/70"
        )}
      >
        <div className="flex justify-center items-center size-20 rounded-full bg-dark-gray">
          <Plus className="size-12 stroke-white transition-all" />
        </div>

        <span className="text-lg font-semibold text-white transition-all">New note</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className={clsx(
            "fixed inset-0 flex flex-col w-full bg-dark-gray overflow-hidden outline-none",
            "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-[640px] sm:h-[60vh] sm:rounded-lg"
          )}
        >
          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-6 p-5">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium text-white">Create a new note</span>

                <Dialog.Close className="group p-1.5 rounded-full transition-all hover:bg-white">
                  <X className="size-5 stroke-white transition-all group-hover:stroke-black" />
                </Dialog.Close>
              </div>

              {shouldShowOnBoarding ? (
                <div className="flex flex-grow flex-col justify-center items-center gap-8 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleStartRecord}
                    className="flex flex-col justify-center items-center gap-2 py-10 px-2 max-w-40 w-full border-2 border-gray rounded-md font-medium text-white outline-none transition-all focus-visible:border-white hover:border-white"
                  >
                    <Mic className="size-6" />
                    Record
                  </button>

                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="flex flex-col justify-center items-center gap-2 py-10 px-2 max-w-40 w-full border-2 border-gray rounded-md font-medium text-white outline-none transition-all focus-visible:border-white hover:border-white"
                  >
                    <Type className="size-6" />
                    Type
                  </button>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  autoFocus
                  className="flex-1 bg-transparent leading-6 resize-none outline-none text-white"
                />
              )}
            </div>

            {isRecording && (
              <button
                type="button"
                onClick={handleStopRecording}
                className="flex justify-center items-center gap-2 w-full min-h-[52px] text-center text-sm text-white font-semibold outline-none transition-all hover:text-red"
              >
                <div className="size-3 rounded-full bg-red animate-pulse" />
                Recording! (click here to stop)
              </button>
            )}

            {!shouldShowOnBoarding && !isRecording && (
              <button
                type="button"
                onClick={handleSaveNote}
                className="min-h-[52px] w-full bg-white text-center text-black font-semibold outline-none transition-all hover:bg-white/80"
              >
                Save
              </button>
            )}

            {shouldShowOnBoarding && (
              <span className="flex justify-center items-center min-h-[52px] w-full text-sm text-white font-medium">Select one method</span>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
