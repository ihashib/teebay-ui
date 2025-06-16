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
  Grid,
  Checkbox,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '../graphql/mutations';

interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
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
      confirmPassword: '',
      firstName: '',
      lastName: '',
      address: '',
      phoneNumber: '',
      userType: 'USER',
    },
    validate: {
      email: (v) =>
        /^\S+@\S+\.\S+$/.test(v) ? null : 'Invalid email format', 
      phoneNumber: (v) =>
        /^[0-9]{11}$/.test(v) ? null : 'Phone number must be 10 digits', 
      password: (v) =>
        v.length >= 6 ? null : 'Password must be at least 6 characters', 
      firstName: (v) => (v ? null : 'First name is required'),
      lastName: (v) => (v ? null : 'Last name is required'),
      address: (v) => (v ? null : 'Address is required'),
      confirmPassword: (v, values) =>
        v === values.password ? null : 'Passwords must match',
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
  try {
    const { confirmPassword, ...restOfValues } = values;

    await register({
      variables: { input: restOfValues }, 
    });
    
    navigate('/login');
  } catch (err) {
  q
  }
};

  return (
    <Center style={{ width: '100%', height: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 650 }}>
        <Title order={2} mb="lg" style={{ textAlign: 'center' }}>
          SIGN UP
        </Title>
        <Paper radius="md" withBorder p="xl" style={{ maxWidth: 650, width: '100%' }}>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Grid gutter="sm">
              <Grid.Col span={6}>
                <TextInput
                  required
                  placeholder="First Name"
                  {...form.getInputProps('firstName')}
                  mt="sm"
                  mb="sm"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  required
                  placeholder="Last Name"
                  {...form.getInputProps('lastName')}
                  mt="sm"
                  mb="sm"
                />
              </Grid.Col>
            </Grid>

            <TextInput
              required
              placeholder="Address"
              {...form.getInputProps('address')}
              mt="sm"
              mb="sm"
            />

            <Grid gutter="sm">
              <Grid.Col span={6}>
                <TextInput
                  required
                  placeholder="Phone Number"
                  {...form.getInputProps('phoneNumber')}
                  mt="sm"
                  mb="sm"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  required
                  placeholder="Email"
                  {...form.getInputProps('email')}
                  mt="sm"
                  mb="sm"
                />
              </Grid.Col>
            </Grid>

            <PasswordInput
              required
              placeholder="Password"
              {...form.getInputProps('password')}
              mt="sm"
              mb="sm"
            />
            <PasswordInput
              required
              placeholder="Confirm Password"
              {...form.getInputProps('confirmPassword')}
              mt="sm"
              mb="sm"
            />

            {error && (
              <Text color="red" size="sm" mb="sm">
                {(error as Error).message}
              </Text>
            )}

            <Center>
              <Button
                type="submit"
                loading={loading}
                mt="sm"
                mb="sm"
                fullWidth={false}
                style={{ width: '200px' }}
              >
                Register
              </Button>
            </Center>

            <Text ta="center" size="sm">
              Already have an account?{' '}
              <Anchor component={Link} to="/login">
                Sign In
              </Anchor>
            </Text>
          </form>
        </Paper>
      </div>
    </Center>
  );
}
