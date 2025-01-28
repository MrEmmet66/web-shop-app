"use client"

import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, UploadFile, message, Select, SelectProps } from 'antd';
import SpecificationsEditor from '@/features/products/components/SpecificationsEditor';
import ProductImagesEditor from '@/features/products/components/ProductImagesEditor';
import { ProductDto } from '@/features/products/models/productDto';
import { useCreateProductMutation } from '@/features/products/productsEndpoints';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

function CreateProductPage() {
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState([{ name: '', value: '' }]);
  const [categories, setCategories] = useState<number[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [createProduct, { isLoading, error }] = useCreateProductMutation();

  const availableCategories = useAppSelector((state) => state.product.categories);
  const selectOptions: SelectProps<number>['options'] = availableCategories?.map((category) => ({ label: category.name, value: category.id }));

  const handleCategoryChange = (value: number[]) => setCategories(value);

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { name: '', value: '' }]);
  };

  const handleRemoveSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (index: number, field: string, value: string) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = { ...newSpecifications[index], [field]: value };
    setSpecifications(newSpecifications);
  };

  const onFormSubmit = async (values: ProductDto) => {
    values.images = fileList;
    values.specifications = specifications;
    values.categories = categories;
    try {
      await createProduct(values).unwrap().then(() => {
        message.success('Product created successfully');
      });
    } catch (e) {
      message.error('Failed to create product');
    }


  }


  const handleFileChange = (fileList: UploadFile[]) => setFileList(fileList);

  return (
    <Form layout="vertical" onFinish={onFormSubmit}>
      <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please input the product name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description (Markdown)" name="description">
      </Form.Item>
      <Form.Item label="Manufacturer" name="manufacturer" rules={[{ required: true, message: 'Please input the manufacturer!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Stock Quantity" name="stock" rules={[{ required: true, message: 'Please input the stock quantity!' }]}>
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
        <InputNumber min={0} step={0.01} />
      </Form.Item>
      <Form.Item label="Category" name="category">
        <Select mode={'multiple'} options={selectOptions} placeholder="Select Categories" style={{ width: '100%' }} allowClear onChange={handleCategoryChange} />
      </Form.Item>
      <Form.Item label="Specifications" name={'specifications'}>
        <SpecificationsEditor
          specifications={specifications}
          onSpecificationAdd={handleAddSpecification}
          onSpecificationRemove={handleRemoveSpecification}
          onSpecificationChange={handleSpecificationChange} />
      </Form.Item>
      <Form.Item label="Product Images" name={'images'}>
        <ProductImagesEditor images={fileList} onImagesChange={handleFileChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>Create Product</Button>
      </Form.Item>
      {error && <div style={{ color: 'red' }}>Failed to create product: {error}</div>}
    </Form>
  );
}

export default CreateProductPage;