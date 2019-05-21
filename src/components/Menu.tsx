/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Grid from '@material-ui/core/Grid';
import { FunctionComponent, useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import API from 'API';
import { routes, assetsPaths } from 'constants/values';
import { useStore } from 'hooks';
import { CategoryNameToUrlMap } from 'types';

const CSS = {
  activeMenuItemLink: css`
    color: #fff;

    :hover {
      color: #fff;
    }
  `,
  centeredMenuItem: css`
    text-align: center;
    transition: 0.4s;

    :hover {
      transform: scale(1.1);
    }
  `,
  fullWidth: css`
    width: 100%;
  `,
  logo: css`
    max-height: 20vh;
    max-width: 100%;
  `,
  menu: css`
    color: #fff;
    font-size: 4em;
    font-weight: bold;
    padding-right: 2rem;

    @media (max-width: 768px) {
      font-size: 3em;
      margin: 0 0 0 -0.3rem;
      padding-right: 0;
    }
  `,

  menuItem: css`
    transition: 0.4s;

    :hover {
      transform: translate3d(-1rem, 0, 0);
    }
  `,

  menuItemLink: css`
    color: #bdbdbd;

    :hover {
      color: #e0e0e0;
    }
  `,
  menuWrapper: css`
    font-family: Starjedi;
  `,
  textCenter: css`
    text-align: center;
  `
};

type Props = RouteComponentProps<{ activeCategoryItemId?: string; activeCategoryName: string }>;

type State = { categoryName?: string; categoryNameToUrlMap?: CategoryNameToUrlMap };

const Menu: FunctionComponent<Props> = ({
  match: {
    params: { activeCategoryItemId, activeCategoryName }
  }
}) => {
  const { isDisplayingOnMobileDevice } = useStore();
  const [{ categoryNameToUrlMap, categoryName }, setState] = useState<State>({});

  useEffect(() => {
    API.getCategoryNameToUrlMap().then(({ categoryNameToUrlMap: fetchedCategoryNameToUrlMap }) => {
      if (fetchedCategoryNameToUrlMap) {
        setState(prevState => ({
          ...prevState,
          categoryNameToUrlMap: fetchedCategoryNameToUrlMap
        }));
      }
    });
  }, []);

  useEffect(() => {
    if (!activeCategoryItemId) {
      setState(prevState => ({ ...prevState, categoryName: activeCategoryName }));
    }
  }, [activeCategoryItemId, activeCategoryName]);

  if (!categoryNameToUrlMap) {
    return null;
  }

  const shouldExpandMenu = isDisplayingOnMobileDevice || !categoryName;

  return (
    <div css={shouldExpandMenu ? [CSS.menuWrapper, CSS.fullWidth] : CSS.menuWrapper}>
      <Grid container css={CSS.menu} direction="column">
        <Grid item css={shouldExpandMenu ? CSS.textCenter : null}>
          <Link replace to={routes.default}>
            <img css={CSS.logo} src={assetsPaths.logo} alt="logo" />
          </Link>
        </Grid>

        {Object.keys(categoryNameToUrlMap).map(name => (
          <Grid
            item
            css={shouldExpandMenu ? [CSS.menuItem, CSS.centeredMenuItem] : CSS.menuItem}
            key={name}
          >
            <Link
              css={
                name === categoryName
                  ? [CSS.menuItemLink, CSS.activeMenuItemLink]
                  : CSS.menuItemLink
              }
              onClick={() =>
                setState(prevState => ({ ...prevState, lastClickedCategoryName: name }))
              }
              to={`/${name}`}
            >
              {name}
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Menu;
