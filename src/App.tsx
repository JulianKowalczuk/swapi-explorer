/** @jsx jsx */
import { jsx } from '@emotion/core';
import { HashRouter, Route } from 'react-router-dom';

import { AppContainer, CategoryItemModal, CategoryItemsPanel, Menu } from 'components';
import { routes } from 'constants/values';
import { useStore } from 'hooks';

const App = () => (
  <HashRouter>
    <useStore.Provider>
      <AppContainer>
        <Route
          path={[routes.categoryNameWithItemId, routes.categoryName, routes.default]}
          component={Menu}
        />

        <Route
          path={[routes.categoryNameWithItemId, routes.categoryName]}
          component={CategoryItemsPanel}
        />

        <Route path={routes.categoryNameWithItemId} component={CategoryItemModal} />
      </AppContainer>
    </useStore.Provider>
  </HashRouter>
);

export default App;
