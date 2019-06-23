export type Category = {
  name: string;
  url: string;
};

export type CategoryItem = {
  url: string;
  [key: string]: CategoryItemValue;
};

export type CategoryItemFieldFormat = 'date' | 'date-time' | 'uri';

export type CategoryItemFieldType = 'array' | 'integer' | 'string';

export type CategoryItemSchema = {
  properties: {
    [key: string]: {
      format?: CategoryItemFieldFormat;
      type: CategoryItemFieldType;
    };
  };
  required: string[];
};

export type CategoryItemValue = number | string | string[];

export type CategoryItemsPage = {
  count: number;
  next?: string;
  previous?: string;
  results: CategoryItem[];
};

export type CategoryItemsPanelApiCallParams = { page?: number; search?: string };

export type CategoryNameToUrlMap = {
  [name: string]: string;
};
