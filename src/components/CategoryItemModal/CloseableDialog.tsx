/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { FunctionComponent } from 'react';

type Props = {
  isOpen?: boolean;
  onClose?: VoidFunction;
};

const CSS = {
  closeButton: css`
    position: absolute;
    right: 1rem;
    top: 1rem;
  `,
  closeableDialogContent: css`
    padding: 1rem;
  `
};

const emptyFunc = () => {};

const CloseableDialog: FunctionComponent<Props> = ({ children, isOpen = true, onClose }) => {
  return (
    <Dialog fullWidth maxWidth="md" open={isOpen} onClose={onClose || emptyFunc}>
      <div css={CSS.closeableDialogContent}>
        {onClose && (
          <div css={CSS.closeButton}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </div>
        )}

        {children}
      </div>
    </Dialog>
  );
};

export default CloseableDialog;
