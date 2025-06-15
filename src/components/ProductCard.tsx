import { Card, Image, Text, Group, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '../graphql/mutations';
import { GET_MY_PRODUCTS, GET_ALL_PRODUCTS } from '../graphql/queries';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    price: number;
    rentPrice: number;
    rentUnit: string;
    owner: { id: string; email: string };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT, {
    variables: { productId: product.id },
    update(cache) {
      cache.modify({
        fields: {
          myProducts(existingRefs = [], { readField }) {
            return existingRefs.filter(
              (ref: any) => readField('id', ref) !== product.id
            );
          },
          products(existingRefs = [], { readField }) {
            return existingRefs.filter(
              (ref: any) => readField('id', ref) !== product.id
            );
          },
        },
      });
    },
  });

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Image src="/placeholder.png" height={160} alt={product.title} />

      {/* fw (font-weight) and fz (font-size) replace weight/size :contentReference[oaicite:0]{index=0} */}
      <Text fw={500} fz="lg" mt="md">
        {product.title}
      </Text>

      <Text fz="sm" c="dimmed">
        {product.description}
      </Text>

      {/* justify replaces position="apart" :contentReference[oaicite:1]{index=1} */}
      <Group justify="space-between" mt="md">
        <Text fw={700}>${product.price.toFixed(2)}</Text>

        {/* gap replaces spacing :contentReference[oaicite:2]{index=2} */}
        <Group gap="xs">
          <Button
            size="xs"
            variant="light"
            onClick={() => navigate(`/products/edit/${product.id}`)}
          >
            Edit
          </Button>
          <Button
            size="xs"
            color="red"
            loading={loading}
            onClick={() => deleteProduct()}
          >
            Delete
          </Button>
        </Group>
      </Group>

      <Group mt="sm" gap="xs">
        <Button size="xs" onClick={() => navigate(`/products/buy/${product.id}`)}>
          Buy
        </Button>
        <Button size="xs" onClick={() => navigate(`/products/rent/${product.id}`)}>
          Rent
        </Button>
      </Group>
    </Card>
  );
}
