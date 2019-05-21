/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import alphaSort from 'alpha-sort';
import axios from 'axios';
import { FunctionComponent, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';

import API from 'API';
import { SpinnerPlaceholder } from 'components';
import { useStore } from 'hooks';
import { CategoryItem } from 'types';
import { prettifyCategoryItemKey } from 'utils';
import CloseableDialog from './CloseableDialog';
import LinksField from './LinksField';
import { renderCategoryItemTextFieldValue, getModalRenderFields } from './categoryItemModalUtils';

type Props = RouteComponentProps<{ activeCategoryItemId: string; activeCategoryName: string }>;

const CSS = {
  textField: css`
    width: 100%;
  `
};

const textFieldInputProps = { readOnly: true };

const CategoryItemModal: FunctionComponent<Props> = ({
  history,
  match: {
    params: { activeCategoryItemId, activeCategoryName }
  }
}) => {
  const {
    categoryItemSchemas,
    fetchCategoryItemSchemaIfNotPresent,
    lastCategoryItemsPanelPath
  } = useStore();

  const [categoryItem, setCategoryItem] = useState<CategoryItem | undefined>();

  const refs = useRef({ fetchCategoryItemSchemaIfNotPresent, history });

  const onDialogClose = useCallback(
    () => refs.current.history.push(lastCategoryItemsPanelPath || `/${activeCategoryName}`),
    [activeCategoryName, lastCategoryItemsPanelPath]
  );

  const onLinksFieldClick = useCallback(() => setCategoryItem(undefined), []);

  const renderFields = useMemo(
    () => getModalRenderFields(categoryItem, categoryItemSchemas[activeCategoryName]),
    [activeCategoryName, categoryItem, categoryItemSchemas]
  );

  useEffect(() => {
    refs.current = { fetchCategoryItemSchemaIfNotPresent, history };
  }, [categoryItemSchemas, fetchCategoryItemSchemaIfNotPresent, history]);

  useEffect(() => {
    refs.current.fetchCategoryItemSchemaIfNotPresent(activeCategoryName);
  }, [activeCategoryName]);

  useEffect(() => {
    const signal = axios.CancelToken.source();

    API.getCategoryItem(activeCategoryName, activeCategoryItemId, signal.token).then(
      ({ categoryItem }) => setCategoryItem(categoryItem)
    );

    return signal.cancel;
  }, [activeCategoryItemId, activeCategoryName]);

  if (!renderFields) {
    return (
      <CloseableDialog>
        <SpinnerPlaceholder size={70} />
      </CloseableDialog>
    );
  }

  const { linksFields, textFields, title } = renderFields;

  return (
    <CloseableDialog onClose={onDialogClose}>
      <h2>{title}</h2>

      <Grid container justify="space-between">
        <Grid container direction="column" item md={3}>
          {Object.keys(textFields)
            .filter(fieldName => textFields[fieldName])
            .sort(alphaSort.ascending)
            .map(fieldName => (
              <Grid item key={fieldName}>
                <TextField
                  css={CSS.textField}
                  defaultValue={renderCategoryItemTextFieldValue(fieldName, textFields[fieldName])}
                  InputProps={textFieldInputProps}
                  label={prettifyCategoryItemKey(fieldName)}
                  margin="normal"
                  multiline
                  variant="outlined"
                />
              </Grid>
            ))}
        </Grid>

        <Grid container direction="column" item md={8} spacing={16}>
          {Object.keys(linksFields)
            .sort(alphaSort.ascending)
            .map(fieldName => (
              <Grid item key={fieldName}>
                <LinksField
                  label={prettifyCategoryItemKey(fieldName)}
                  links={
                    Array.isArray(linksFields[fieldName])
                      ? (linksFields[fieldName] as string[])
                      : ([linksFields[fieldName]] as string[])
                  }
                  onClick={onLinksFieldClick}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </CloseableDialog>
  );
};

export default CategoryItemModal;
