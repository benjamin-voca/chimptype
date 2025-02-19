import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { createResource } from "solid-js";
import { useLocation } from "@solidjs/router";
import { For } from "solid-js";
import { getLists } from "~/utils";
import { useGroup } from "~/contexts/GroupContext";

interface Group {
  name: string;
  languages: string[];
}

export default function Nav() {
  const { group, setGroup } = useGroup(); // Access shared state
  const [groupList] = createResource<Group[]>(async () => {
    const response = await getLists();
    return response.json();
  });

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

        <DropdownMenu>
          <DropdownMenuTrigger as={Button<"button">}>Language</DropdownMenuTrigger>
          <DropdownMenuContent class="w-48 max-h-60 overflow-y-auto bg-sky-600">
            <For each={groupList()}>
              {(l_group) => (
                <DropdownMenuGroup>
                  <DropdownMenuGroupLabel>{l_group.name}</DropdownMenuGroupLabel>
                  <DropdownMenuRadioGroup value={group()} onChange={setGroup}>
                    <For each={l_group.languages}>
                      {(lang) => (
                        <DropdownMenuRadioItem value={lang}>{lang}</DropdownMenuRadioItem>
                      )}
                    </For>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              )}
            </For>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
    </nav>
  );
}
