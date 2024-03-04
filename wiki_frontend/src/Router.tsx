import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { Admin } from './pages/Admin.page';
import { Login } from './pages/Login.page';
import { Logout } from './pages/Logout.page';
import { ArticlePage } from './pages/Article.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/article',
    element: <ArticlePage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
