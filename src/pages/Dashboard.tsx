import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import {
  GET_ALL_PRODUCTS,
  GET_MY_PRODUCTS,
  GET_MY_ORDERS,
} from '../graphql/queries'
import ProductCard from '../components/ProductCard'
import OrderCard from '../components/OrderCard'
import {
  Stack,
  Title,
  Loader,
  Center,
  Button,
  Group,
  Menu,
} from '@mantine/core'
import { IconMenu2 } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const location = useLocation() // Get the state passed during navigation
  const [view, setView] = useState<string>('allProducts')
  const {
    data: myProd,
    loading: myProdLoading,
    refetch: refetchMy,
  } = useQuery(GET_MY_PRODUCTS)
  const {
    data: allProd,
    loading: allProdLoading,
    refetch: refetchAll,
  } = useQuery(GET_ALL_PRODUCTS)
  const { data: myOrders, loading: ordersLoading } = useQuery(GET_MY_ORDERS)
  const navigate = useNavigate()

  // Logout handler clears auth token and redirects to login page
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // If state is passed via navigate, use it to set the view
  useEffect(() => {
    if (location.state?.view) {
      setView(location.state.view)
      if (location.state.view === 'allProducts') {
        refetchAll()
      } else if (location.state.view === 'myProducts') {
        refetchMy()
      }
    }
  }, [location.state, refetchAll, refetchMy])

  if (myProdLoading || allProdLoading || ordersLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    )
  }

  const handleViewChange = (newView: string) => {
    setView(newView)
    if (newView === 'allProducts') refetchAll()
    if (newView === 'myProducts') refetchMy()
  }

  return (
    <div style={{ padding: '16px' }}>
      <Group justify="space-between" align="center" mb="md">
        <Menu shadow="md" width={140} position="bottom-start">
          <Menu.Target>
            <Button variant="subtle" leftSection={<IconMenu2 size={18} />}>
              Menu
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => handleViewChange('allProducts')}>
              All Products
            </Menu.Item>
            <Menu.Item onClick={() => handleViewChange('myProducts')}>
              My Products
            </Menu.Item>
            <Menu.Item onClick={() => navigate('/history')}>History</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Button color="red" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </Group>

      {/* Page Content */}
      {view === 'allProducts' && (
        <Stack gap="xl" p="md">
          <Title order={3}>All Products</Title>
          {allProd.products.map((p: any) => (
            <ProductCard key={p.id} product={p} refetch={refetchMy} />
          ))}
        </Stack>
      )}

      {view === 'myProducts' && (
        <Stack gap="xl" p="md">
          <Group justify="space-between" mb="md">
            <Title order={3}>My Products</Title>
            <Button onClick={() => navigate('/products/add')}>
              Add Product
            </Button>
          </Group>
          {myProd.userProducts.map((p: any) => (
            <ProductCard
              key={p.id}
              product={p}
              refetch={refetchMy}
              showActions
            />
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
  )
}
