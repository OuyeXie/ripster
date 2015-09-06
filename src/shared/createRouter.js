import {createRouter} from 'vstack-router';
import {createRouterListener} from 'redux-vstack-router';

import transition from './transition';

export default function createAppRouter(history, store) {
  const router = createRouter(
    history,
    transition(store)
  );

  router.listen(createRouterListener(store));

  return router;
}
