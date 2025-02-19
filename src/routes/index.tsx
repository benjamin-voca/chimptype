import { createResource, Show } from "solid-js";
import WordField from "~/components/WordField";
import { getWords } from "~/utils";
import { useGroup } from "~/contexts/GroupContext";

interface Words {
  "name": boolean,
  "noLazyMode": boolean,
  "orderedByFrequency": boolean,
  "words": string[]
}

export default function Home() {
  const { group } = useGroup();  // Get group from context

  const [words] = createResource<Words, string>(
    group,  // Use group as the source
    async (g) => {
      const response = await getWords(g);
      return response.json();
    }
  );

  return (
    <main class="text-center mx-auto text-gray-700 p-4 bg-gray-700">
      <Show when={words()}>
        <WordField text={words()!.words} />
      </Show>
    </main>
  );
}
