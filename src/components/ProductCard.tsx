import React, { useState } from 'react';
import { Card, Image, Text, Group, Button, Modal } from '@mantine/core';
import { useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '../graphql/mutations';
import { GET_MY_PRODUCTS } from '../graphql/queries';
import { useNavigate } from 'react-router-dom';

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
  refetch: () => void; // Add refetch as a prop
}

export default function ProductCard({ product, refetch }: ProductCardProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT, {
    variables: { productId: product.id },
    update(cache) {
      // Optimistically update the cache if needed
      cache.modify({
        fields: {
          myProducts(existingRefs = [], { readField }) {
            return existingRefs.filter(
              (ref: any) => readField('id', ref) !== product.id
            );
          },
        },
      });
    },
  });

  const handleDeleteClick = () => {
    setIsModalOpen(true); // Open confirmation modal
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(); // Perform the deletion mutation
      refetch(); // Refetch "My Products" after deletion
      setIsModalOpen(false); // Close modal after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setIsDeleting(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false); // Close modal if user cancels
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Image src="/placeholder.png" height={160} alt={product.title} />

      <Text fw={500} fz="lg" mt="md">
        {product.title}
      </Text>

      <Text fz="sm" c="dimmed">
        {product.description}
      </Text>

      <Group justify="space-between" mt="md">
        <Text fw={700}>${product.price.toFixed(2)}</Text>

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
            onClick={handleDeleteClick}
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

      {/* Confirmation Modal */}
      <Modal
        opened={isModalOpen}
        onClose={handleCancelDelete}
        title="Confirm Deletion"
      >
        <Text size="sm">
          Are you sure you want to delete this product? This action cannot be undone.
        </Text>
        <Group mt="md">
          <Button onClick={handleCancelDelete} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="red"
            loading={isDeleting}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
