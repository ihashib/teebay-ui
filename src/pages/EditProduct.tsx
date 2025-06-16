import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '../graphql/queries';  
import { UPDATE_PRODUCT } from '../graphql/mutations'; 
import { TextInput, NumberInput, Select, Button, Box, Title, Group, Textarea, Text } from '@mantine/core';

const EditProduct = () => {
  const { productId } = useParams();  // Get productId from the URL
  const navigate = useNavigate();

  // Fetch the product details using the productId
  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId },
  });

  // Mutation to update the product
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  // State to hold the form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    rentPrice: 0,
    rentUnit: '',
    category: '',
  });

  // Populate form data when the product data is fetched
  useEffect(() => {
    if (data) {
      const product = data.product;
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price,
        rentPrice: product.rentPrice,
        rentUnit: product.rentUnit,
        category: product.category,
      });
    }
  }, [data]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateProduct({
        variables: {
          productId,
          input: formData,  // Send the updated product data
        },
      });
      navigate('/dashboard');  // Redirect to dashboard after update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Show loading or error message
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">{error.message}</Text>;

  return (
    <Box style={{ maxWidth: 600 }} mx="auto" py="xl">
      <Title order={2}>Edit Product</Title>
      <Box mb="md">
        <TextInput
          label="Product Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
        />
        <NumberInput
          label="Price"
          value={formData.price}
          onChange={(value) => handleChange('price', value)}
          required
        />
        <NumberInput
          label="Rent Price"
          value={formData.rentPrice}
          onChange={(value) => handleChange('rentPrice', value)}
          required
        />
        <Select
          label="Rent Unit"
          value={formData.rentUnit}
          onChange={(value) => handleChange('rentUnit', value)}
          data={['DAY', 'WEEK', 'MONTH']}
          required
        />
        <Select
          label="Category"
          value={formData.category}
          onChange={(value) => handleChange('category', value)}
          data={['ELECTRONICS', 'FURNITURE', 'HOME_APPLIANCES', 'SPORTING_GOODS', 'OUTDOOR', 'TOY']}
          required
        />
      </Box>

      <Group>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </Group>
    </Box>
  );
};

export default EditProduct;
