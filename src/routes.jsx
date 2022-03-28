
import { lazy } from 'react';
import { Navigate } from 'react-router-dom';


// lazy load check
function retry(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}


const Connect = lazy(() => retry(() => import('./pages/connect.wallet')));
const Landing = lazy(() => retry(() => import('./pages/landing')));
// const Create = lazy(() => retry(() => import('./pages/create_item')));
const Detail = lazy(() => retry(() => import('./pages/item_detail')));


const routes = (isLoggedIn) => [
  {
    path: '',
    element: isLoggedIn ? <Navigate to='/admin' /> : <Connect />,
  },
  {
    path: 'admin',
    element: isLoggedIn ? <Landing /> : <Navigate to='/' />,
    children: [
      { path: '', element: <Landing /> },
      // { path: 'create', element: <Create /> },
      { path: 'detail', element: <Detail /> },
    ]
  },
  { path: '*', element: <Navigate to='/404' /> },
];

export default routes;