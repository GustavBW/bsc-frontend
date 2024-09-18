import { css } from '@emotion/css'

/**
 * Small style fragments
 */
export const Styles = {
    NO_OVERFLOW: css`
        overflow: hidden !important;
    `
}

export const SHARED_CSS_STR =`
body {
    margin: 0;
    background-color: #000000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
        monospace;
}
`

export const SHARED_CSS = css`${SHARED_CSS_STR}`