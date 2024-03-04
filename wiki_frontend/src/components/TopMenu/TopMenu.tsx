import { Autocomplete, Group, Burger, rem, useMantineColorScheme, Button } from '@mantine/core';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch, IconBrandWikipedia } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/store';
import { handleSearchInput } from '../../store/userActions';
import classes from './TopMenu.module.css';
import { debounce } from '../../utils/debounce';

const linksAuth = [
  { link: '/', label: 'Home' },
  { link: '/admin', label: 'Admin' },
  { link: '/logout', label: 'Logout' },
];

const linksNotAuth = [
  { link: '/', label: 'Home' },
  { link: '/login', label: 'Login' },
];

export function TopMenu() {
  const authStore = useAuthStore((state) => state);
  const [keywords, setKeywords] = useState('');
  const [opened, { toggle }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const links = authStore.auth.token ? linksAuth : linksNotAuth;

  const items = links.map((link) => (
    <Link key={link.label} to={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  const debounceHandleSearchInput = debounce(handleSearchInput, 450);

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <IconBrandWikipedia
            style={{ width: rem(32), height: rem(45), color: 'grey' }}
            stroke={1.5}
          />
          <Button onClick={() => toggleColorScheme()}>
            {colorScheme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </Group>
        <Group>
          {authStore.auth.user && <Group>Profile: {authStore.auth.user}</Group>}
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>
          <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            data={['React', 'Angular', 'Vue', 'Next.js', 'Riot.js', 'Svelte', 'Blitz.js']}
            visibleFrom="xs"
            value={keywords}
            onChange={(data) => {
              setKeywords(data);
              debounceHandleSearchInput.call(null, data.split(' '));
            }}
          />
        </Group>
      </div>
    </header>
  );
}
