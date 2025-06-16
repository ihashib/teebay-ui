import { useState } from 'react';
import { Button, Box, Title, TextInput, Select, Textarea, NumberInput, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_PRODUCT_MUTATION } from '../graphql/mutations';

const steps = [
  { label: 'Product Title', component: 'title' },
  { label: 'Category', component: 'category' },
  { label: 'Description', component: 'description' },
  { label: 'Pricing', component: 'pricing' },
  { label: 'Summary', component: 'summary' },
];

export default function AddProductWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: 0,
    rentPrice: 0,
    rentUnit: '',
  });

  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { data } = await createProduct({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            categories: [formData.category],
            price: formData.price,
            rentPrice: formData.rentPrice,
            rentUnit: formData.rentUnit,
          },
        },
      });

      console.log('Product created:', data.createProduct);

      // Redirect to dashboard and set the view to 'myProducts'
      navigate('/dashboard', { state: { view: 'myProducts' } });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <Box style={{ maxWidth: 600 }} mx="auto" py="xl">
      <Title order={2} mb="md">
        Add New Product
      </Title>

      <Box mb="md">
        <Title order={4}>{steps[currentStep].label}</Title>
        {currentStep === 0 && (
          <TextInput
            label="Product Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        )}
        {currentStep === 1 && (
          <Select
            label="Category"
            value={formData.category}
            onChange={(value) => handleChange('category', value)}
            data={['ELECTRONICS', 'FURNITURE', 'HOME_APPLIANCES', 'SPORTING_GOODS', 'OUTDOOR', 'TOY']}
            required
          />
        )}
        {currentStep === 2 && (
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            required
          />
        )}
        {currentStep === 3 && (
          <>
            <NumberInput
              label="Buy Price"
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
          </>
        )}
        {currentStep === 4 && (
          <Box>
            <Title order={5}>Summary</Title>
            <Text>Title: {formData.title}</Text>
            <Text>Category: {formData.category}</Text>
            <Text>Description: {formData.description}</Text>
            <Text>Price: ${formData.price}</Text>
            <Text>Rent Price: ${formData.rentPrice}</Text>
            <Text>Rent Unit: {formData.rentUnit}</Text>
          </Box>
        )}
      </Box>

      <Group justify="space-between">
        {currentStep > 0 && <Button onClick={handleBack}>Back</Button>}
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button onClick={handleSubmit}>Submit</Button>
        )}
      </Group>
    </Box>
  );
}
