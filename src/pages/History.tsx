import { useState } from 'react'
import {
  Tabs,
  Box,
  Title,
  Loader,
  Center,
  Card,
  Text,
  Group,
  Badge,
  Button,
} from '@mantine/core'
import { useQuery } from '@apollo/client'
import {
  GET_MY_BOUGHT_ORDERS,
  GET_MY_SOLD_PRODUCTS,
  GET_MY_BORROWED_PRODUCTS,
  GET_MY_LENT_PRODUCTS,
} from '../graphql/queries'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const [activeTab, setActiveTab] = useState<string | null>('bought')

  // Fetch data for each tab
  const { data: myBoughtOrders, loading: ordersLoading } = useQuery(
    GET_MY_BOUGHT_ORDERS,
    { fetchPolicy: 'no-cache' },
  )
  const { data: mySold, loading: soldLoading } = useQuery(
    GET_MY_SOLD_PRODUCTS,
    { fetchPolicy: 'no-cache' },
  )
  const { data: myBorrowed, loading: borrowedLoading } = useQuery(
    GET_MY_BORROWED_PRODUCTS,
    { fetchPolicy: 'no-cache' },
  )
  const { data: myLent, loading: lentLoading } = useQuery(
    GET_MY_LENT_PRODUCTS,
    { fetchPolicy: 'no-cache' },
  )
  const navigate = useNavigate()

  if (ordersLoading || soldLoading || borrowedLoading || lentLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader />
      </Center>
    )
  }

  const renderBoughtCard = (order: any) => (
    <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
      <Group mt="md" mb="xs">
        <Text>{order.product.title}</Text>
        <Badge color="pink">BUY</Badge>
      </Group>
      <Text size="sm" color="dimmed">
        Buyer: {order.buyer?.email || 'Email not available'}
      </Text>
    </Card>
  )

  const renderSoldCard = (order: any) => (
    <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
      <Group mt="md" mb="xs">
        <Text>{order.product.title}</Text>
        <Badge color="pink">SOLD</Badge>
      </Group>
      <Text size="sm" color="dimmed">
        Buyer: {order.buyer?.email || 'Email not available'}
      </Text>
    </Card>
  )

  const renderBorrowedCard = (order: any) => (
    <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
      <Group mt="md" mb="xs">
        <Text>{order.product.title}</Text>
        <Badge color="blue">BORROWED</Badge>
      </Group>
      <Text size="sm" color="dimmed">
        Rent Start: {new Date(order.rentStart).toLocaleDateString()}
      </Text>
      <Text size="sm" color="dimmed">
        Rent End: {new Date(order.rentEnd).toLocaleDateString()}
      </Text>
    </Card>
  )

  const renderLentCard = (order: any) => (
    <Card key={order.id} shadow="sm" padding="lg" radius="md" withBorder>
      <Group mt="md" mb="xs">
        <Text>{order.product.title}</Text>
        <Badge color="green">LENT</Badge>
      </Group>
      <Text size="sm" color="dimmed">
        Buyer: {order.buyer?.email || 'Email not available'}
      </Text>
      <Text size="sm" color="dimmed">
        Rent Start: {new Date(order.rentStart).toLocaleDateString()}
      </Text>
      <Text size="sm" color="dimmed">
        Rent End: {new Date(order.rentEnd).toLocaleDateString()}
      </Text>
    </Card>
  )

  return (
    <Box p="md">
      <Title order={3}>My History</Title>

      <Button
        onClick={() =>
          navigate('/dashboard', { state: { view: 'myProducts' } })
        }
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        Go to Dashboard
      </Button>

      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="outline"
        style={{ marginTop: 20 }}
      >
        <Tabs.List>
          <Tabs.Tab value="bought">Bought</Tabs.Tab>
          <Tabs.Tab value="sold">Sold</Tabs.Tab>
          <Tabs.Tab value="borrowed">Borrowed</Tabs.Tab>
          <Tabs.Tab value="lent">Lent</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bought">
          <Box>
            {myBoughtOrders?.buyerBoughtOrders?.length > 0 ? (
              myBoughtOrders.buyerBoughtOrders.map((order: any) =>
                renderBoughtCard(order),
              )
            ) : (
              <Text>No orders found.</Text>
            )}
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="sold">
          <Box>
            {mySold?.ownerSoldBoughtOrders?.length > 0 ? (
              mySold.ownerSoldBoughtOrders.map((order: any) =>
                renderSoldCard(order),
              )
            ) : (
              <Text>No products found.</Text>
            )}
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="borrowed">
          <Box>
            {myBorrowed?.buyerRentedOrders?.length > 0 ? (
              myBorrowed.buyerRentedOrders.map((order: any) =>
                renderBorrowedCard(order),
              )
            ) : (
              <Text>No borrowed products found.</Text>
            )}
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="lent">
          <Box>
            {myLent?.ownerSoldRentedOrders?.length > 0 ? (
              myLent.ownerSoldRentedOrders.map((order: any) =>
                renderLentCard(order),
              )
            ) : (
              <Text>No lent products found.</Text>
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}
