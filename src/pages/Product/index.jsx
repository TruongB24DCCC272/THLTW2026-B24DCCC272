import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm, Space } from 'antd';

const initialData = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

export default function ProductPage() {
  const [products, setProducts] = useState(initialData);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAdd = (values) => {
    setProducts([
      ...products,
      { id: Date.now(), ...values },
    ]);
    message.success('Thêm sản phẩm thành công');
    form.resetFields();
    setOpen(false);
  };

  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  const filteredData = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      title: 'STT',
      render: (_t, _r, index) => index + 1,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (v) => v.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="primary" onClick={() => setOpen(true)}>
          Thêm sản phẩm
        </Button>
      </Space>

      <Table rowKey="id" columns={columns} dataSource={filteredData} />

      <Modal
        title="Thêm sản phẩm mới"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Bắt buộc nhập tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Bắt buộc nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải là số dương' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Bắt buộc nhập số lượng' },
              { type: 'number', min: 1, message: 'Số lượng phải > 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
