/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import axios from 'axios';
import { FunctionComponent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import API from 'API';
import { SpinnerPlaceholder } from 'components';
import { lightBlue } from 'constants/colors';
import { CategoryItem } from 'types';
import { decodeApiLink, rewriteApiLinkToLocalOne } from 'utils';

type Props = {
  label: string;
  links: string[];
  onClick: VoidFunction;
};

type State =
  | {
      label: string;
      url: string;
    }[]
  | undefined;

const CSS = {
  linksFieldLink: css`
    color: ${lightBlue};
  `
};

const LinksField: FunctionComponent<Props> = ({ label, links, onClick }) => {
  const [items, setItems] = useState<State>();

  useEffect(() => {
    const signal = axios.CancelToken.source();

    const itemsPromises = links.map(async link => {
      const { categoryName, id } = decodeApiLink(link);

      const { categoryItem } = await API.getCategoryItem(categoryName, id, signal.token);

      return categoryItem
        ? {
            label: String(Object.values(categoryItem as CategoryItem)[0]),
            url: rewriteApiLinkToLocalOne((categoryItem as CategoryItem).url)
          }
        : { label: '', url: '' };
    });

    Promise.all(itemsPromises).then(items => setItems(items));

    return signal.cancel;
  }, [links]);

  if (!links.length) {
    return null;
  }

  return (
    <div>
      <h3>
        {label} <SpinnerPlaceholder show={!items} size={15} withWrapper={false} />
      </h3>

      {items &&
        items.map(({ label, url }, index) => (
          <span key={url}>
            <Link css={CSS.linksFieldLink} onClick={onClick} to={url}>
              {label}
            </Link>

            {index !== items.length - 1 && ', '}
          </span>
        ))}
    </div>
  );
};

export default LinksField;
