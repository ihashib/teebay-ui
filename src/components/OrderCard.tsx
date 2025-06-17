import { Card, Text, Group, Badge } from '@mantine/core'

interface OrderCardProps {
  order: {
    id: string
    product: { title: string }
    type: 'BUY' | 'RENT'
    rentStart?: string
    rentEnd?: string
    buyer: { email: string }
  }
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <Card shadow="xs" padding="md" radius="md" withBorder>
      {/* justify="space-between" replaces position="apart" */}
      <Group justify="space-between" mb="xs">
        {/* fw prop replaces weight */}
        <Text fw={500}>{order.product.title}</Text>
        <Badge color={order.type === 'BUY' ? 'blue' : 'green'}>
          {order.type}
        </Badge>
      </Group>

      {order.type === 'RENT' && (
        <Text size="sm" color="dimmed">
          {new Date(order.rentStart!).toLocaleDateString()} –{' '}
          {new Date(order.rentEnd!).toLocaleDateString()}
        </Text>
      )}

      <Text size="sm" color="dimmed" mt="xs">
        Buyer: {order.buyer.email}
      </Text>
    </Card>
  )
}
