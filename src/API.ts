import axios, { CancelToken } from 'axios';

import {
  CategoryItem,
  CategoryItemSchema,
  CategoryItemsPage,
  CategoryItemsPanelApiCallParams,
  CategoryNameToUrlMap
} from 'types';

axios.defaults.baseURL = 'https://swapi.co/api/';

const cachedCategoryItems: {
  [categoryName: string]: {
    [categoryItemId: string]: CategoryItem;
  };
} = {};

async function getCategoryItem(categoryName: string, id: string, cancelToken: CancelToken) {
  try {
    if (cachedCategoryItems[categoryName] && cachedCategoryItems[categoryName][id]) {
      return { categoryItem: cachedCategoryItems[categoryName][id] };
    }

    const { data } = await axios.get<CategoryItem>(`${categoryName}/${id}`, { cancelToken });

    if (cachedCategoryItems[categoryName]) {
      cachedCategoryItems[categoryName][id] = data;
    } else {
      cachedCategoryItems[categoryName] = { [id]: data };
    }

    return { categoryItem: data };
  } catch (ex) {
    return { error: ex.error };
  }
}

async function getCategoryItemsPage(
  categoryName: string,
  params: CategoryItemsPanelApiCallParams,
  cancelToken: CancelToken
) {
  try {
    // increase page number by 1, because api paginations starts from 1...
    const { data } = await axios.get<CategoryItemsPage>(categoryName, {
      params,
      cancelToken
    });

    return { categoryItemsPage: data };
  } catch (ex) {
    return { error: ex.error };
  }
}

async function getCategoryItemSchema(categoryName: string) {
  try {
    const { data } = await axios.get<CategoryItemSchema>(`${categoryName}/schema`);

    return { categoryItemSchema: data };
  } catch (ex) {
    return { error: ex.error };
  }
}

async function getCategoryNameToUrlMap() {
  try {
    const { data } = await axios.get<CategoryNameToUrlMap>('');

    return { categoryNameToUrlMap: data };
  } catch (ex) {
    return { error: ex.error };
  }
}

export default {
  getCategoryItem,
  getCategoryItemsPage,
  getCategoryItemSchema,
  getCategoryNameToUrlMap
};
