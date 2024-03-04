import '@mantine/core/styles.css';
import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { getAllUsers, getAllArticles, getCurrentAuthState } from './store/userActions';

export default function App() {
  useEffect(() => {
    getAllUsers();
    getAllArticles();
    getCurrentAuthState();
  }, []);

  return (
    <MantineProvider theme={theme}>
      <Router />
    </MantineProvider>
  );
}
