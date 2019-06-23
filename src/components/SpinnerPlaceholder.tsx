/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { FunctionComponent } from 'react';

const CSS = {
  circularProgress: css`
    color: #000;
  `,
  spinnerPlaceholderWrapper: css`
    align-items: center;
    display: flex;
    height: 100%;
    justify-content: center;
    min-height: 20rem;
    width: 100%;
  `
};

type Props = {
  show?: boolean;
  size?: number;
  withWrapper?: boolean;
};

const SpinnerPlaceholder: FunctionComponent<Props> = ({
  show = true,
  size,
  withWrapper = true
}) => {
  if (!show) {
    return null;
  }

  const circularProgress = <CircularProgress css={CSS.circularProgress} size={size} />;

  return withWrapper ? (
    <div css={CSS.spinnerPlaceholderWrapper}>{circularProgress}</div>
  ) : (
    circularProgress
  );
};

export default SpinnerPlaceholder;
