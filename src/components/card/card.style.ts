import styled from "styled-components";
import { themes } from "../../themes/themes";

export const Container = styled.div`
    background: ${themes.backgroundCard};
    padding: 20px;
    border-radius: 12px;
    transition: 0.2s;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-3px);
  }
`;

export const Title = styled.p`
    font-size: 16px;
    color: ${themes.titleCardColor};
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

export const Value = styled.h2`
    font-size: 20px;
    margin-top: 8px;
    color:${themes.valueCardColor};
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

export const Subtitle = styled.p`
    font-size: 14px;
    color: ${themes.SubtitleCardColor};
    margin-top: 4px;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`