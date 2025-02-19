import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "~/components/ui/select"
import { createMemo, createResource, createSignal } from "solid-js";
import { useLocation } from "@solidjs/router";
import { For } from "solid-js";
import { getLists } from "~/utils";

interface Group {
  name: string;
  languages: string[];
}

export default function Nav() {
  const [group, setGroup]= createSignal("english");
  const [groupList] = createResource<Group[]>(async () => {
    const response = await getLists();
    return response.json();
  });
  const names = createMemo(() => groupList()?.map(group => group.name) || []);
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-sky-600" : "border-transparent hover:border-sky-600";

  return (
    <nav class="bg-sky-800">
      <ul class="container flex items-center p-3 text-gray-200">
        <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
          <a href="/">Home</a>
        </li>
        <li class={`border-b-2 ${active("/about")} mx-1.5 sm:mx-6`}>
          <a href="/about">About</a>
        </li>

      <Select
          value={group()}
          onChange={setGroup}
          options={names()}
          placeholder="English"
          itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>}
      >
          <SelectTrigger aria-label="Fruit" class="w-[180px]">
              <SelectValue<string>>{(state) => state.selectedOption()}</SelectValue>
          </SelectTrigger>
          <SelectContent />
      </Select>
      </ul>
    </nav>
  );
}
