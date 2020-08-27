import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Items from './items';
import ItemsDetail from './items-detail';
import ItemsUpdate from './items-update';
import ItemsDeleteDialog from './items-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ItemsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ItemsUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ItemsDetail} />
      <ErrorBoundaryRoute path={match.url} component={Items} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={ItemsDeleteDialog} />
  </>
);

export default Routes;
