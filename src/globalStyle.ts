// styles/global.ts
import { createGlobalStyle } from "styled-components";
import { themes } from "./themes/themes";

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${themes.backgroud};
  }
`;
