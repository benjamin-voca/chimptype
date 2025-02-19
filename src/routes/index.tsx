import WordField from "~/components/WordField";

export default function Home() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <WordField text={["correct","horse","battery","staple"]} />
    </main>
  );
}
