import { createSignal, createContext, useContext, JSX } from "solid-js";

interface GroupContextType {
  group: () => string;
  setGroup: (value: string) => void;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider(props: { children: JSX.Element }) {
  const [group, setGroup] = createSignal("english");
  
  return (
    <GroupContext.Provider value={{ group, setGroup }}>
      {props.children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
}
