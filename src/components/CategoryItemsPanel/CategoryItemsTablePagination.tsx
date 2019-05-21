/** @jsx jsx */
import { jsx } from '@emotion/core';
import TablePagination from '@material-ui/core/TablePagination';
import { FunctionComponent, useCallback } from 'react';

type Props = { count: number; onPageChange: (page: number) => void; page: number };

// Because pagination in Material-UI starts from zero,
// we need to make some effort for standard pagination control

const CategoryItemsTablePagination: FunctionComponent<Props> = ({ count, onPageChange, page }) => {
  const onChangePage = useCallback((_, page: number) => onPageChange(++page), [onPageChange]);

  return (
    <TablePagination
      count={count}
      page={page - 1}
      onChangePage={onChangePage}
      rowsPerPage={10}
      rowsPerPageOptions={[10]}
    />
  );
};

export default CategoryItemsTablePagination;
