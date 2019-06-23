import { apiBaseUrl } from 'constants/values';

export function rewriteApiLinkToLocalOne(url: string) {
  return url.substring(apiBaseUrl.length - 1, url.length - 1);
}

export function decodeApiLink(link: string) {
  const [categoryName, id] = rewriteApiLinkToLocalOne(link)
    .split('/')
    .filter(Boolean);

  return { categoryName, id };
}

export function prettifyCategoryItemKey(text: string) {
  if (!text.length) {
    return text;
  }

  return (
    text[0].toUpperCase() +
    text
      .substr(1)
      .split('_')
      .join(' ')
  );
}
