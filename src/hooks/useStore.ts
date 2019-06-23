import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
import createUseContext from 'constate';
import { useState, useEffect, useMemo, useRef } from 'react';

import API from 'API';
import { CategoryItemSchema, CategoryItemsPage } from 'types';

type State = {
  categoryItemSchemas: { [categoryName: string]: CategoryItemSchema };
  lastCategoryItemsPanelPath?: string;
  categoryItemsPanelPage?: CategoryItemsPage;
  categoryItemsPanelCategoryName?: string;
};

const useStore = createUseContext(() => {
  const [state, setState] = useState<State>({ categoryItemSchemas: {} });
  const isDisplayingOnMobileDevice = useMediaQuery('(max-width:768px)');
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  async function fetchCategoryItemSchemaIfNotPresent(categoryName: string) {
    if (!stateRef.current.categoryItemSchemas[categoryName]) {
      const { categoryItemSchema } = await API.getCategoryItemSchema(categoryName);

      if (!categoryItemSchema) {
        return;
      }

      setState(prevState => ({
        ...prevState,
        categoryItemSchemas: {
          ...prevState.categoryItemSchemas,
          [categoryName]: categoryItemSchema
        }
      }));
    }
  }

  function setLastCategoryItemsPanelPath(path: string) {
    setState(prevState => ({ ...prevState, lastCategoryItemsPanelPath: path }));
  }

  return useMemo(
    () => ({
      ...state,
      isDisplayingOnMobileDevice,
      fetchCategoryItemSchemaIfNotPresent,
      setLastCategoryItemsPanelPath
    }),
    [isDisplayingOnMobileDevice, state]
  );
});

export default useStore;
