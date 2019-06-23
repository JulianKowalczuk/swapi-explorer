import { CategoryItem, CategoryItemSchema, CategoryItemValue } from 'types';

const noneValues = ['n/a', 'N/A', 'unknown'];
const renderFieldNamesToSkip = ['url', 'edited', 'created'];

export function renderCategoryItemTextFieldValue(key: string, value: CategoryItemValue) {
  switch (key) {
    case 'height':
      return `${value} cm`;
    case 'length':
      return `${value} m`;
    case 'mass':
      return `${value} kg`;
    default:
      return String(value);
  }
}

export function getModalRenderFields(
  categoryItem?: CategoryItem,
  categoryItemSchema?: CategoryItemSchema
) {
  if (!categoryItem || !categoryItemSchema) {
    return undefined;
  }

  const linksFields: { [key: string]: CategoryItemValue } = {};
  const textFields: { [key: string]: CategoryItemValue } = {};

  const firstRequiredFieldName = categoryItemSchema.required[0];

  Object.keys(categoryItem)
    .filter(
      fieldName =>
        fieldName !== firstRequiredFieldName &&
        !renderFieldNamesToSkip.includes(fieldName) &&
        !noneValues.includes(categoryItem[fieldName] as string)
    )
    .forEach(fieldName => {
      const { format, type } = categoryItemSchema.properties[fieldName];

      const isLinkField =
        format === 'uri' ||
        type === 'array' ||
        (type === 'string' && String(categoryItem[fieldName]).includes('http'));

      (isLinkField ? linksFields : textFields)[fieldName] = categoryItem[fieldName];
    });

  return { linksFields, textFields, title: String(categoryItem[firstRequiredFieldName]) };
}
