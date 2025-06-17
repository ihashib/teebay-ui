import { useState } from 'react'
import {
  Button,
  Box,
  Title,
  TextInput,
  Textarea,
  NumberInput,
  Group,
  Text,
  MultiSelect,
  Select,
} from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import { CREATE_PRODUCT_MUTATION } from '../graphql/mutations'
import { GET_MY_PRODUCTS } from '../graphql/queries'

const steps = [
  { label: 'Product Title', component: 'title' },
  { label: 'Categories', component: 'categories' },
  { label: 'Description', component: 'description' },
  { label: 'Pricing', component: 'pricing' },
  { label: 'Summary', component: 'summary' },
]

type FormData = {
  title: string
  categories: string[]
  description: string
  price: number
  rentPrice: number
  rentUnit: string
}

export default function AddProductWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    categories: [],
    description: '',
    price: 0,
    rentPrice: 0,
    rentUnit: '',
  })

  const [createProduct] = useMutation(CREATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: GET_MY_PRODUCTS }],
    awaitRefetchQueries: true,
  })

  const [touched, setTouched] = useState(
    {} as Partial<Record<keyof FormData, boolean>>,
  )

  const errors: Partial<Record<keyof FormData, string>> = {}
  if (currentStep === 0 && touched.title && formData.title.trim() === '') {
    errors.title = 'Product title is required'
  }
  if (
    currentStep === 1 &&
    touched.categories &&
    formData.categories.length === 0
  ) {
    errors.categories = 'Select at least one category'
  }
  if (
    currentStep === 2 &&
    touched.description &&
    formData.description.trim() === ''
  ) {
    errors.description = 'Description is required'
  }
  if (currentStep === 3) {
    if (touched.price && formData.price <= 0) {
      errors.price = 'Price must be greater than zero'
    }
    if (touched.rentPrice && formData.rentPrice <= 0) {
      errors.rentPrice = 'Rent price must be greater than zero'
    }
    if (touched.rentUnit && formData.rentUnit === '') {
      errors.rentUnit = 'Select a rent unit'
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.title.trim() !== ''
      case 1:
        return formData.categories.length > 0
      case 2:
        return formData.description.trim() !== ''
      case 3:
        return (
          formData.price > 0 &&
          formData.rentPrice > 0 &&
          formData.rentUnit !== ''
        )
      default:
        return true
    }
  }

  const handleNext = () => {
    setTouched((prev) => ({
      ...prev,
      [steps[currentStep].component]: true,
    }))
    if (!isStepValid()) {
      return
    }
    setTouched({})
    setCurrentStep((s) => s + 1)
  }

  const handleBack = () => {
    setTouched({})
    setCurrentStep((s) => s - 1)
  }

  const handleChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBlur = <K extends keyof FormData>(field: K) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async () => {
    // mark all fields touched
    setTouched({
      title: true,
      categories: true,
      description: true,
      price: true,
      rentPrice: true,
      rentUnit: true,
    })
    if (!isStepValid()) return
    try {
      const { data } = await createProduct({
        variables: { input: formData },
      })
      navigate('/dashboard', { state: { view: 'myProducts' } })
    } catch (error) {
      console.error('Error creating product:', error)
    }
  }

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
            onBlur={() => handleBlur('title')}
            error={errors.title}
            required
          />
        )}

        {currentStep === 1 && (
          <MultiSelect
            label="Categories"
            placeholder="Pick one or more"
            data={[
              'ELECTRONICS',
              'FURNITURE',
              'HOME_APPLIANCES',
              'SPORTING_GOODS',
              'OUTDOOR',
              'TOYS',
            ]}
            value={formData.categories}
            onChange={(values) => handleChange('categories', values)}
            onBlur={() => handleBlur('categories')}
            error={errors.categories}
            required
          />
        )}

        {currentStep === 2 && (
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            error={errors.description}
            required
          />
        )}

        {currentStep === 3 && (
          <>
            <NumberInput
              label="Buy Price"
              value={formData.price}
              onChange={(value) =>
                handleChange(
                  'price',
                  typeof value === 'string'
                    ? parseFloat(value) || 0
                    : value || 0,
                )
              }
              onBlur={() => handleBlur('price')}
              error={errors.price}
              required
            />
            <NumberInput
              label="Rent Price"
              value={formData.rentPrice}
              onChange={(value) =>
                handleChange(
                  'rentPrice',
                  typeof value === 'string'
                    ? parseFloat(value) || 0
                    : value || 0,
                )
              }
              onBlur={() => handleBlur('rentPrice')}
              error={errors.rentPrice}
              required
            />
            <Select
              label="Rent Unit"
              data={['DAY', 'WEEK', 'MONTH']}
              value={formData.rentUnit}
              onChange={(value) => handleChange('rentUnit', value!)}
              onBlur={() => handleBlur('rentUnit')}
              error={errors.rentUnit}
              required
            />
          </>
        )}

        {currentStep === 4 && (
          <Box>
            <Title order={5}>Summary</Title>
            <Text>Title: {formData.title}</Text>
            <Text>Categories: {formData.categories.join(', ')}</Text>
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
  )
}
