import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Select,
  Button,
  Paper,
  Title,
  Text,
  Anchor,
  Center,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../graphql/mutations';

interface RegisterFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  userType: 'USER' | 'ADMIN';
}

export default function Register() {
  const navigate = useNavigate();
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);
  const form = useForm<RegisterFormValues>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      userType: 'USER',
    },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length >= 3 ? null : 'Password at least 3 chars'),
      firstName: (v) => (v ? null : 'Required'),
      lastName: (v) => (v ? null : 'Required'),
      address: (v) => (v ? null : 'Required'),
      phoneNumber: (v) => (v ? null : 'Required'),
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      await register({ variables: { input: values } });
      navigate('/login');
    } catch {
      // show error below
    }
  };

  return (
    <Center style={{ width: '100%', height: '100vh' }}>
      <Paper radius="md" withBorder p="xl" style={{ maxWidth: 400, width: '100%' }}>
        <Title order={2} mb="lg" style={{ textAlign: 'center' }}>
          SIGN UP
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="First Name" required mb="sm" {...form.getInputProps('firstName')} />
          <TextInput label="Last Name" required mb="sm" {...form.getInputProps('lastName')} />
          <TextInput label="Email" required mb="sm" {...form.getInputProps('email')} />
          <PasswordInput label="Password" required mb="sm" {...form.getInputProps('password')} />
          <TextInput label="Address" required mb="sm" {...form.getInputProps('address')} />
          <TextInput label="Phone" required mb="sm" {...form.getInputProps('phoneNumber')} />
          <Select
            label="User Type"
            data={[
              { value: 'USER', label: 'User' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
            mb="md"
            {...form.getInputProps('userType')}
          />

          {error && (
            <Text color="red" size="sm" mb="sm">
              {(error as Error).message}
            </Text>
          )}

          <Button fullWidth type="submit" loading={loading} mb="md">
            REGISTER
          </Button>

          <Text ta="center" size="sm">
            Already have an account?{' '}
            <Anchor component={Link} to="/login">
              Login
            </Anchor>
          </Text>
        </form>
      </Paper>
    </Center>
  );
}
