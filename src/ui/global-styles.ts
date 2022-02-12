import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const GlobalStyle = createGlobalStyle`
    ${reset}
    html, body, #root {
    	margin: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        align-items: center;
        background: ${({ theme }: { theme: any }) => theme.bgColor};
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin: 0;
        padding: 0;
        /* transition: all 0.1s linear; */
        color: ${({ theme }: { theme: any }) => theme.textColor};
    }
    button { 
        cursor: pointer;
        border: none;
        outline: none;
        color: ${({ theme }: { theme: any }) => theme.bgColor};
        background-color: ${({ theme }: { theme: any }) => theme.textColor};
    }
`;
