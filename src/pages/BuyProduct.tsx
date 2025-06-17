import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import { Button, Text, Group, Title, Center, Loader } from '@mantine/core';
import { BUY_PRODUCT } from '../graphql/mutations';


export default function BuyProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [buyProduct, { data, loading, error }] = useMutation(BUY_PRODUCT, {
    variables: { id: productId },
    onCompleted: () => navigate('/dashboard', { state: { view: 'history' } }),
  }); // run mutation and then navigate :contentReference[oaicite:3]{index=3}

  if (loading) return <Center><Loader /></Center>;
  if (error) return <Text color="red">Error: {error.message}</Text>;

  return (
    <Center style={{ flexDirection: 'column', marginTop: 40 }}>
      <Title order={2}>Confirm Purchase</Title>
      <Text>Are you sure you want to buy this product?</Text>
      <Group mt="md">
        <Button onClick={() => buyProduct()}>Yes, Buy Now</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
      </Group>
    </Center>
  );
}
