import React, { useState } from 'react';
import { Card, Image, Text, Group, Button, Modal, Stack} from '@mantine/core';
import { useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import { DatePickerInput } from '@mantine/dates';
import { BUY_PRODUCT } from '../graphql/mutations';
import { RENT_PRODUCT } from '../graphql/mutations';

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
  refetch: () => void; 
  showActions?: boolean; 
}

export default function ProductCard({ product, refetch, showActions = false }: ProductCardProps) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [dates, setDates] = useState<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  });

  const openBuyModal = () => setIsBuyModalOpen(true);
  const closeBuyModal = () => setIsBuyModalOpen(false);
  const openRentModal = () => setIsRentModalOpen(true);
  const closeRentModal = () => setIsRentModalOpen(false);

  const [buyProduct, { loading: buyLoading, error: buyError }] = useMutation(BUY_PRODUCT);
  const [rentProduct, { loading: rentLoading, error: rentError }] = useMutation(RENT_PRODUCT);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [deleteProduct, { loading }] = useMutation(DELETE_PRODUCT, {
    variables: { productId: product.id },
    update(cache) {
      // update the cache if needed
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
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(); 
      refetch(); 
      setIsModalOpen(false); 
    } catch (error) {
      console.error('Error deleting product:', error);
    }
    setIsDeleting(false);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false); 
  };

  const handleConfirmBuy = async () => {
    try {
      await buyProduct({ variables: { id: product.id } });
      setIsBuyModalOpen(false);
    } catch (error) {
      console.error('Error buying product:', error);
      if (error instanceof Error) {
        alert(error.message); 
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

const handleConfirmRent = async () => {
  if (dates.from && dates.to) {
    const formattedFrom = new Date(dates.from).toISOString(); 
    const formattedTo = new Date(dates.to).toISOString();

    try {
      await rentProduct({
        variables: {
          id: product.id,
          from: formattedFrom,
          to: formattedTo,
        },
      });
      setIsRentModalOpen(false);
    } catch (error) {
      console.error('Error renting product:', error);
      if (error instanceof Error) {
        alert(error.message); 
      } else {
        alert('An unexpected error occurred.');
      }
    }
  }
};

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text fw={500} fz="lg" mt="md">
        {product.title}
      </Text>

      <Text fz="sm" c="dimmed">
        {product.description}
      </Text>

      <Group justify="space-between" mt="md">
        <Text fw={700}>${product.price.toFixed(2)}</Text>

        <Group gap="xs">
           {showActions && (
            <>
              <Button size="xs" variant="outline" onClick={() => navigate(`/products/edit/${product.id}`)}>
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
          </>
          )}
        </Group>
      </Group>

      <Group mt="sm" gap="xs">
      <Button size="xs" onClick={openBuyModal}>
        Buy
      </Button>

      <Button size="xs" onClick={openRentModal}>
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

      <Modal opened={isBuyModalOpen} onClose={() => { closeBuyModal(); setErrorMessage(null); }} title="Confirm Purchase" centered>
        <Text size="sm">
          Are you sure you want to purchase <strong>{product.title}</strong> for{' '}
          <strong>${product.price.toFixed(2)}</strong>?
        </Text>
        {errorMessage && <Text color="red" mt="md">{errorMessage}</Text>}
        <Group mt="md">
          <Button variant="outline" onClick={closeBuyModal}>
            Cancel
          </Button>
          <Button color="green" onClick={handleConfirmBuy} loading={buyLoading}>
            Confirm Purchase
          </Button>
        </Group>
      </Modal>

      <Modal opened={isRentModalOpen} onClose={() => { closeRentModal(); setErrorMessage(null); }} title="Select Rental Dates" centered>
        <Text size="sm">
          Are you sure you want to rent <strong>{product.title}</strong> for{' '}
          <strong>${product.rentPrice}/{product.rentUnit.toLowerCase()}</strong>?
        </Text>
        <Stack mt="md">
          <DatePickerInput
            label="From"
            placeholder="Pick start date"
            value={dates.from}
            onChange={(value) => setDates((prev) => ({ ...prev, from: value }))}
            required
            dropdownType="modal"
          />
          <DatePickerInput
            label="To"
            placeholder="Pick end date"
            value={dates.to}
            onChange={(value) => setDates((prev) => ({ ...prev, to: value }))}
            required
            dropdownType="modal"
          />
        </Stack>
        <Group mt="md">
          <Button variant="outline" onClick={closeRentModal}>
            Cancel
          </Button>
          <Button color="green" onClick={handleConfirmRent} loading={rentLoading}>
            Confirm Rent
          </Button>
        </Group>
      </Modal>
    </Card>
  );
}
