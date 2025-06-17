import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_BY_ID } from '../graphql/queries';  
import { UPDATE_PRODUCT_MUTATION } from '../graphql/mutations'; 
import { TextInput, NumberInput, Select, Button, Box, Title, Group, Textarea, Text, MultiSelect} from '@mantine/core';

type FormData = {
  title: string;
  description: string;
  price: number;
  rentPrice: number;
  rentUnit: string;
  categories: string[];
};

export default function EditProduct() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { productId },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT_MUTATION);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    rentPrice: 0,
    rentUnit: '',
    categories: [],
  });

  useEffect(() => {
    if (data?.productById) {
      const p = data.productById;
      setFormData({
        title: p.title,
        description: p.description || '',
        price: p.price,
        rentPrice: p.rentPrice,
        rentUnit: p.rentUnit,
        categories: p.categories,
      });
    }
  }, [data]);

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateProduct({
        variables: {
          input: {
            id: productId,                  
            title: formData.title,
            description: formData.description,
            price: formData.price,
            rentPrice: formData.rentPrice,
            rentUnit: formData.rentUnit,
            categories: formData.categories,
          },
        },
      });
      navigate('/dashboard', { state: { view: 'myProducts' } });
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error)   return <Text color="red">{error.message}</Text>;

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
        <MultiSelect
          label="Categories"
          data={[
            'ELECTRONICS',
            'FURNITURE',
            'HOME_APPLIANCES',
            'SPORTING_GOODS',
            'OUTDOOR',
            'TOYS',
          ]}
          value={formData.categories}
          onChange={(val) => handleChange('categories', val)}
          required
        />
      </Box>

      <Group>
        <Button onClick={handleSubmit}>Save Changes</Button>
      </Group>
    </Box>
  );
};