/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { ChangeEventHandler, FunctionComponent } from 'react';

const CSS = {
  searchTextField: css`
    width: 100%;
  `
};

type Props = {
  onChange: ChangeEventHandler<HTMLInputElement>;
  defaultValue: string;
};

const SearchTextField: FunctionComponent<Props> = ({ onChange, defaultValue }) => (
  <TextField
    css={CSS.searchTextField}
    placeholder="Search..."
    defaultValue={defaultValue}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      )
    }}
  />
);

export default SearchTextField;
