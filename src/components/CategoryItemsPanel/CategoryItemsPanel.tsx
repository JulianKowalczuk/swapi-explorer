/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import { debounce } from 'debounce';
import {
  ChangeEventHandler,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { RouteComponentProps } from 'react-router';
import qs from 'qs';

import API from 'API';
import { SpinnerPlaceholder } from 'components';
import { useStore } from 'hooks';
import { CategoryItemsPage, CategoryItemsPanelApiCallParams } from 'types';
import { prettifyCategoryItemKey, rewriteApiLinkToLocalOne } from 'utils';
import { getDefinedParams } from './categoryItemsPanelUtils';
import CategoryItemsTablePagination from './CategoryItemsTablePagination';
import SearchTextField from './SearchTextField';
import { Paper } from '@material-ui/core';

const CSS = {
  categoryItemsPanelWrapper: css`
    width: 100%;
  `,
  categoryItemsTable: css`
    background: #fff;
    border-radius: 0.5rem;
  `,
  categoryItemsTableBodyCell: css`
    max-width: 22rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  clickableRow: css`
    cursor: pointer;
  `,
  placeholderCell: css`
    height: 33.5rem;

    @media (max-width: 768px) {
      height: 30rem;
    }
  `,
  searchFieldWrapper: css`
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem 0.7rem 1rem;

    @media (max-width: 768px) {
      margin-top: 1rem;
    }
  `
};

type Props = RouteComponentProps<{ activeCategoryItemId?: string; activeCategoryName: string }>;

type State = {
  categoryItemsPage?: CategoryItemsPage;
  categoryName?: string;
} & CategoryItemsPanelApiCallParams;

const CategoryItemsPanel: FunctionComponent<Props> = ({
  history,
  location,
  match: {
    params: { activeCategoryItemId, activeCategoryName }
  }
}) => {
  const {
    categoryItemSchemas,
    fetchCategoryItemSchemaIfNotPresent,
    isDisplayingOnMobileDevice,
    setLastCategoryItemsPanelPath
  } = useStore();

  const [{ categoryItemsPage, categoryName, page = 1, search = '' }, setState] = useState<State>(
    {}
  );

  const fetchCategoryItemSchemaIfNotPresentRef = useRef(fetchCategoryItemSchemaIfNotPresent);

  const createUrlFromParams = useCallback(
    (params: CategoryItemsPanelApiCallParams) => {
      const definedPrams = getDefinedParams(params);

      return location.pathname + '?' + qs.stringify(definedPrams);
    },
    [location.pathname]
  );

  const onPageChange = useCallback(
    (page: number) => {
      const url = createUrlFromParams({ page, search });

      setLastCategoryItemsPanelPath(url);

      history.push(url);
    },
    [createUrlFromParams, history, search, setLastCategoryItemsPanelPath]
  );

  const searchByValue = useCallback(
    debounce((search: string) => {
      const url = createUrlFromParams({ page: 1, search });

      setLastCategoryItemsPanelPath(url);

      history.push(url);
    }, 200),
    [createUrlFromParams, history, setLastCategoryItemsPanelPath]
  );

  const onSearchTextFieldChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => searchByValue(e.target.value),
    [searchByValue]
  );

  useEffect(() => {
    fetchCategoryItemSchemaIfNotPresentRef.current = fetchCategoryItemSchemaIfNotPresent;
  }, [fetchCategoryItemSchemaIfNotPresent]);

  useEffect(() => {
    if (!activeCategoryItemId) {
      const { page, search } = qs.parse(location.search, { ignoreQueryPrefix: true });

      setState(prevState => ({ ...prevState, categoryName: activeCategoryName, page, search }));
    }
  }, [activeCategoryItemId, activeCategoryName, location.search]);

  useEffect(() => {
    if (categoryName) {
      fetchCategoryItemSchemaIfNotPresentRef.current(categoryName);
    }
  }, [categoryName]);

  useEffect(() => {
    const signal = axios.CancelToken.source();

    setState(prevState => ({ ...prevState, categoryItemsPage: undefined }));

    if (!categoryName) {
      return;
    }

    API.getCategoryItemsPage(
      categoryName,
      getDefinedParams({
        page,
        search
      }),
      signal.token
    ).then(({ categoryItemsPage }) => setState(prevState => ({ ...prevState, categoryItemsPage })));

    return signal.cancel;
  }, [categoryName, page, search]);

  if (activeCategoryItemId && !categoryItemsPage) {
    return null;
  }

  const renderFieldNames =
    categoryName && categoryItemSchemas[categoryName]
      ? categoryItemSchemas[categoryName].required
          .filter(
            fieldName => categoryItemSchemas[categoryName].properties[fieldName].format !== 'uri'
          )
          .splice(0, isDisplayingOnMobileDevice ? 1 : 3)
      : [];

  return (
    <div css={CSS.categoryItemsPanelWrapper}>
      <Paper css={CSS.searchFieldWrapper}>
        <SearchTextField onChange={onSearchTextFieldChange} defaultValue={search} />
      </Paper>

      <Table css={CSS.categoryItemsTable}>
        <TableHead>
          {!isDisplayingOnMobileDevice && categoryItemsPage && (
            <TableRow>
              {renderFieldNames.map(fieldName => (
                <TableCell key={fieldName}>
                  <b>{prettifyCategoryItemKey(fieldName)}</b>
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableHead>

        <TableBody>
          {categoryItemsPage ? (
            categoryItemsPage.results.map((row, index) => (
              <TableRow
                css={CSS.clickableRow}
                hover
                key={index}
                onClick={() => {
                  const currentUrl = createUrlFromParams({ page, search });

                  setLastCategoryItemsPanelPath(currentUrl);

                  history.push(rewriteApiLinkToLocalOne(row.url));
                }}
              >
                {renderFieldNames.map(fieldName => (
                  <TableCell
                    colSpan={isDisplayingOnMobileDevice ? 2 : 1}
                    css={CSS.categoryItemsTableBodyCell}
                    key={`${index}${fieldName}`}
                  >
                    {row[fieldName]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell css={CSS.placeholderCell} colSpan={9999}>
                <SpinnerPlaceholder size={70} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            {categoryItemsPage ? (
              <CategoryItemsTablePagination
                count={categoryItemsPage.count}
                onPageChange={onPageChange}
                page={page}
              />
            ) : (
              <TableCell />
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default CategoryItemsPanel;
