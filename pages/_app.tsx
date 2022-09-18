import type { AppProps } from "next/app";
import GlobalStyles from "../globalStyles";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DndProvider backend={TouchBackend}>
      <GlobalStyles />
      <Component {...pageProps} />
    </DndProvider>
  );
}

export default MyApp;
