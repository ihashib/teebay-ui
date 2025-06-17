import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { DatePickerInput } from '@mantine/dates';
import { Button, Text, Group, Title, Center, Loader, Stack } from '@mantine/core';
import { RENT_PRODUCT } from '../graphql/mutations';


export default function RentProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  // store dates as ISO strings
  const [dates, setDates] = useState<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  });

  const [rentProduct, { loading, error }] = useMutation(RENT_PRODUCT, {
    onCompleted: () => navigate('/dashboard', { state: { view: 'history' } }),
  });

  const handleRent = () => {
    if (!dates.from || !dates.to) return;
    rentProduct({
      variables: {
        id: productId,
        from: dates.from,
        to: dates.to,
      },
    });
  };

  if (loading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  return (
    <Center style={{ display: 'flex', flexDirection: 'column', marginTop: 40 }}>
      <Title order={2}>Rent Product</Title>
      <Text>Select rental period:</Text>
      <Group style={{ gap: 16 }}>
        <Stack style={{ gap: 8 }}>
          <DatePickerInput
            label="From"
            placeholder="Pick start date"
            value={dates.from}
            onChange={(value: string | null) => setDates(old => ({ ...old, from: value }))}
            required
          />
        </Stack>
        <Stack style={{ gap: 8 }}>
          <DatePickerInput
            label="To"
            placeholder="Pick end date"
            value={dates.to}
            onChange={(value: string | null) => setDates(old => ({ ...old, to: value }))}
            required
          />
        </Stack>
      </Group>
      {error && (
        <Text color="red" style={{ marginTop: 16 }}>
          Error: {error.message}
        </Text>
      )}
      <Group style={{ gap: 16, marginTop: 16 }}>
        <Button onClick={handleRent}>Confirm Rent</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
      </Group>
    </Center>
  );
}
