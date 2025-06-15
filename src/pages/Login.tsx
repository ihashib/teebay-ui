import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Center,
} from '@mantine/core';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION } from '../graphql/mutations';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);
  const form = useForm<LoginFormValues>({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email',
      password: (value) =>
        value.length >= 3 ? null : 'Password must be at least 3 characters',
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const { data } = await login({
        variables: { input: values },
      });
      localStorage.setItem('authToken', data.login);
      navigate('/'); // redirect to dashboard
    } catch {
      // error will appear below
    }
  };

  return (
    <Center style={{ width: '100%', height: '100vh' }}>
      <Paper
        radius="md"
        withBorder
        p="xl"
        style={{ minWidth: 320, maxWidth: 400, width: '100%' }}
      >
        {/* Center the heading via CSS since Title doesn’t support align */}
        <Title order={2} mb="lg" style={{ textAlign: 'center' }}>
          SIGN IN
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mb="sm"
            {...form.getInputProps('email')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mb="md"
            {...form.getInputProps('password')}
          />

          {error && (
            <Text color="red" size="sm" mb="sm">
              {error.message}
            </Text>
          )}

          <Button fullWidth type="submit" loading={loading} mb="md">
            LOGIN
          </Button>

          <Text ta="center" size="sm">
            Don’t have an account?{' '}
            <Anchor component={Link} to="/register">
              Signup
            </Anchor>
          </Text>
        </form>
      </Paper>
    </Center>
  );
}
