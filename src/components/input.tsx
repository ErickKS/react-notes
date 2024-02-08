import { Search } from "lucide-react";
import { ComponentPropsWithRef } from "react";

interface InputProps extends ComponentPropsWithRef<"input"> {}

export function Input({ ...props }: InputProps) {
  return (
    <label
      htmlFor="search"
      className="group flex items-center gap-4 h-14 px-4 bg-dark-gray border-2 border-transparent rounded-lg cursor-text focus-within:border-gray"
    >
      <Search className="size-6 stroke-gray transition-all group-focus-within:stroke-white" />

      <input
        id="search"
        type="text"
        placeholder="Search notes"
        onChange={props.onChange}
        className="w-full h-full bg-transparent text-lg text-white tracking-tight outline-none placeholder:text-gray"
      />
    </label>
  );
}
