import { createSignal, For, onCleanup, onMount, createEffect, createMemo } from "solid-js";
import { diffTuple } from "~/utils";

export default function WordField(props: { text: string[] }) {
  const [idx, setIdx] = createSignal(0);
  const inputs = props.text.map(() => createSignal(""));
  const setInput = () => inputs[idx()][1];
  const input = () => inputs[idx()][0]();
  let new_word_space = false;
  let wordElements: HTMLSpanElement[] = [];
  let containerRef: HTMLDivElement;

  // Memoized diff calculation
  const diff = () => diffTuple(props.text[idx()] || "", input());

  // Effect to update index when word is fully typed
  createEffect(() => {
    const target = props.text[idx()];
    if (diff()[1] === "" && input().length === target.length && input() !== "") {
      new_word_space = true;
      setIdx((prev) => (prev + 1 < props.text.length ? prev + 1 : prev));
    }
  });

  // Scroll to current word when index changes
  createEffect(() => {
    const currentIdx = idx();
    const element = wordElements[currentIdx];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  // Handle keyboard events
  const handleKeydown = (event: KeyboardEvent) => {
    if (new_word_space && event.key === " ") {
      new_word_space = false;
      return;
    }
    if (event.key === "Backspace") {
      if (input() === "" && idx() > 0) {
        const prevIdx = idx() - 1;
        setIdx(prevIdx);
        const [, setPrevInput] = inputs[prevIdx];
        setPrevInput((prev) => prev.slice(0, -1));
      } else {
        setInput()((prev) => prev.slice(0, -1));
      }
      return;
    }
    if (event.key.length === 1) {
      setInput()((prev) => prev + event.key);
    }
  };

  // Lifecycle
  onMount(() => {
    document.addEventListener("keydown", handleKeydown);
    onCleanup(() => document.removeEventListener("keydown", handleKeydown));
  });

  // DiffedWords component
  const DiffedWords = (props: { word: string, i: number }) => {
    const diffWatcher = createMemo(() => diffTuple(props.word, inputs[props.i][0]()));
    return (
      <div class="inline">
        <span class="m-0 p-0 text-white">{diffWatcher()[0]}</span>
        <span class="m-0 p-0 text-red-500">{diffWatcher()[1]}{" "}</span>
      </div>
    );
  };

  return (
    <div ref={containerRef!} class="relative inline-block w-3/4 text-left max-h-[15rem] overflow-y-auto text-[3rem]">
      {/* Base text layer */}
      <div class="leading-tight">
        <For each={props.text}>
          {(word, i) => {
            const index = i();
            return (
              <span
                ref={(el) => (wordElements[index] = el)}
                class="inline align-baseline text-gray-500"
              >
                {word}{" "}
              </span>
            );
          }}
        </For>
      </div>

      {/* Overlay layer */}
      <div class="absolute top-0 left-0 p-0 leading-tight">
        <For each={props.text}>
          {(word, index) => (
            <span class="inline align-baseline">
              <DiffedWords word={word} i={index()} />
            </span>
          )}
        </For>
      </div>
    </div>
  );
}
