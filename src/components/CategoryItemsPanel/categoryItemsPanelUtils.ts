import { CategoryItemsPanelApiCallParams } from 'types';

export function getDefinedParams({ page, search }: CategoryItemsPanelApiCallParams) {
  const params: CategoryItemsPanelApiCallParams = {};

  if (page !== 1) {
    params.page = page;
  }

  if (search) {
    params.search = search;
  }

  return params;
}
