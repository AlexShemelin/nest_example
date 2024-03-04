import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Paper, Title, Container, Button, Text } from '@mantine/core';
import classes from './AuthenticationForm.module.css';
import { loginAction } from '../../store/userActions';

export function AuthenticationForm() {
  const navigation = useNavigate();
  const [state, setState] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          onChange={(val) => setState({ ...state, username: val.currentTarget.value })}
          value={state.username}
          label="Username"
          placeholder="user123"
          required
        />
        <PasswordInput
          onChange={(val) => setState({ ...state, password: val.currentTarget.value })}
          value={state.password}
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Button
          onClick={async () => {
            const result = await loginAction(state.username, state.password);
            if (result?.status === 500) {
              setError(result.message);
            } else {
              navigation('/');
            }
          }}
          fullWidth
          mt="xl"
        >
          Sign in
        </Button>
        {error && <Text c="red">{error}</Text>}
      </Paper>
    </Container>
  );
}
