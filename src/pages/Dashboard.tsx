import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS, GET_MY_PRODUCTS, GET_MY_ORDERS } from '../graphql/queries';
import ProductCard from '../components/ProductCard';
import OrderCard from '../components/OrderCard';
import { Stack, Title, Loader, Center } from '@mantine/core';

export default function Dashboard() {
  const { data: myProd, loading: myProdLoading } = useQuery(GET_MY_PRODUCTS);
  const { data: allProd, loading: allProdLoading } = useQuery(GET_ALL_PRODUCTS);
  const { data: myOrders, loading: ordersLoading } = useQuery(GET_MY_ORDERS);

  if (myProdLoading || allProdLoading || ordersLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Stack gap="xl" p="md">
      <Title order={3}>My Products</Title>
      {myProd.myProducts.map((p: any) => (
        <ProductCard key={p.id} product={p} />
      ))}

      <Title order={3}>All Products</Title>
      {allProd.products.map((p: any) => (
        <ProductCard key={p.id} product={p} />
      ))}

      <Title order={3}>My Orders</Title>
      {myOrders.myOrders.map((o: any) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </Stack>
  );
}
