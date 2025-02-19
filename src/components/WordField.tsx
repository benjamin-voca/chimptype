import { createSignal, onCleanup, onMount } from "solid-js";
import diffTuple from "~/utils";

export default function WordField(props: { text: [string] }) {
  const [input, setInput] = createSignal("");

  const diff = (): [string, string] => diffTuple(props.text, input());

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }
    if (event.key.length === 1) {
      setInput((prev) => prev + event.key);
    }
  };

  // Attach event listener on mount
  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
    onCleanup(() => document.removeEventListener("keydown", handleKeydown));
  });

  return (
    <div class="relative inline-block">
      {/* Base text (gray, bottom layer) */}
      <span class="text-gray-500">{props.text}</span>

      {/* Overlapping typed text */}
      <div class="absolute top-0 left-0">
        <span class="text-white">{diff()[0]}</span>

        {/* Overlapping typo text */}
        <span class="text-red-500">{diff()[1]}</span>
      </div>
    </div>
  );
};



