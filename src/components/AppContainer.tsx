/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { CssBaseline } from '@material-ui/core';
import { Fragment, FunctionComponent } from 'react';

const CSS = {
  appContent: css`
    display: flex;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  `,
  global: css`
    body {
      background: #000;
      overflow-x: hidden;
      padding: 2rem;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    /* fix for Material-UI table component */
    tbody tr:last-child td {
      border-bottom: 0;
    }
  `
};

const AppContainer: FunctionComponent = ({ children }) => {
  return (
    <Fragment>
      <CssBaseline />

      <Global styles={CSS.global} />

      <div css={CSS.appContent}>{children}</div>
    </Fragment>
  );
};

export default AppContainer;
