import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS, GET_MY_PRODUCTS, GET_MY_ORDERS } from '../graphql/queries';
import ProductCard from '../components/ProductCard';
import OrderCard from '../components/OrderCard';
import { Stack, Title, Loader, Center, Button, Group, Menu } from '@mantine/core';
import { IconMenu2 } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const location = useLocation(); // Get the state passed during navigation
  const [view, setView] = useState<string>('allProducts');
  const { data: myProd, loading: myProdLoading, refetch } = useQuery(GET_MY_PRODUCTS);
  const { data: allProd, loading: allProdLoading } = useQuery(GET_ALL_PRODUCTS);
  const { data: myOrders, loading: ordersLoading } = useQuery(GET_MY_ORDERS);
  const navigate = useNavigate();

  // If state is passed via navigate, use it to set the view
  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view);  // Set view to 'myProducts' if passed
    }
  }, [location.state]);

  if (myProdLoading || allProdLoading || ordersLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    );
  }

  const handleViewChange = (view: string) => {
    setView(view);
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Hamburger Menu */}
      <Menu shadow="md" width={120} position="bottom-start">
        <Menu.Target>
          <Button variant="subtle" leftSection={<IconMenu2 size={18} />}>
            Menu
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => handleViewChange('allProducts')}>All Products</Menu.Item>
          <Menu.Item onClick={() => handleViewChange('myProducts')}>My Products</Menu.Item>
          <Menu.Item onClick={() => handleViewChange('history')}>History</Menu.Item>
        </Menu.Dropdown>
      </Menu>

      {/* Page Content */}
      {view === 'allProducts' && (
        <Stack gap="xl" p="md">
          <Title order={3}>All Products</Title>
          {allProd.products.map((p: any) => (
            <ProductCard key={p.id} product={p} refetch={refetch} />
          ))}
        </Stack>
      )}

      {view === 'myProducts' && (
        <Stack gap="xl" p="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>My Products</Title>
            <Button onClick={() => navigate('/products/add')}>Add Product</Button>
          </Group>
          {myProd.userProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} refetch={refetch} />
          ))}
        </Stack>
      )}

      {view === 'history' && (
        <Stack gap="xl" p="md">
          <Title order={3}>My Orders</Title>
          {myOrders.buyerOrders.map((o: any) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </Stack>
      )}
    </div>
  );
}
