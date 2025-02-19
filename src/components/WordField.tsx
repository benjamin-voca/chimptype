import { createSignal, For, onCleanup, onMount, createEffect, createMemo } from "solid-js";
import { diffTuple } from "~/utils";

export default function WordField(props: { text: string[] }) {
  const [idx, setIdx] = createSignal(0);
  const inputs = props.text.map(() => createSignal(""));
  const setInput = () => inputs[idx()][1];
  const input = () => inputs[idx()][0]();
  let new_word_space = false;

  // Memoized diff calculation
  const diff = () => diffTuple(props.text[idx()] || "", input());

  // Effect to update index when word is fully typed
  createEffect(() => {
    const target = props.text[idx()];
    console.log("Diff:", diff());
    console.log("Input:", input());

    if (diff()[1] === "" && input().length === target.length && input() !== "") {
      new_word_space = true;
      setIdx((prev) => (prev + 1 < props.text.length ? prev + 1 : prev));
      console.log("Updated idx:", idx());
    }
  });

  const handleKeydown = (event: KeyboardEvent) => {
    if (new_word_space && event.key === " ") {
      new_word_space = false;
      return;
    }
    if (event.key === "Backspace") {
      // If current input is empty and there's a previous word:
      if (input() === "" && idx() > 0) {
        const prevIdx = idx() - 1;
        // Move to the previous word
        setIdx(prevIdx);
        // Delete the last character from the previous word's input
        const [, setPrevInput] = inputs[prevIdx];
        setPrevInput((prev) => prev.slice(0, -1));
      } else {
        // Otherwise, delete from the current word's input
        setInput()((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (event.key.length === 1) {
      setInput()((prev) => prev + event.key);
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
    onCleanup(() => document.removeEventListener("keydown", handleKeydown));
  });

  // Component to display diffed words
  const DiffedWords = (props: { word: string, i: number }) => {
    const diffWatcher = createMemo(() => diffTuple(props.word, inputs[props.i][0]()));
    return (
      <div class="inline">
        <span class="text-white">{diffWatcher()[0]}</span>
        <span class="text-red-500">{diffWatcher()[1]}&nbsp;</span>
      </div>
    );
  };

  return (
    <div class="relative inline-block">
      {/* Base text (gray, bottom layer) */}
      <For each={props.text}>
        {(word) => ( <span class="text-gray-500">{word} </span> )}
      </For>
      <div class="absolute top-0 left-0">
        <For each={props.text}>
          {(word, index) => ( < DiffedWords word={word} i={index()} /> )}
        </For>
      </div>
    </div>
  );
}
