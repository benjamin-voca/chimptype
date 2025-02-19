import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import Nav from "~/components/Nav";
import { GroupProvider } from "~/contexts/GroupContext";

import "@fontsource/inter";
import "./app.css";

export default function App() {
  return (
    <GroupProvider>
      <Router
        root={props => (
          <>
            <Nav />
            <Suspense>{props.children}</Suspense>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </GroupProvider>
  );
}
