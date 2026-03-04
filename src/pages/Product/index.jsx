import React, { useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Space,
  Tag,
} from 'antd';

const initialData = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 8 },
];

export default function Product() {
  const [products, setProducts] = useState(initialData);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // ===== Trạng thái tồn kho =====
  const renderStatus = (quantity) => {
    if (quantity === 0) return <Tag color="red">Hết hàng</Tag>;
    if (quantity <= 10) return <Tag color="orange">Sắp hết</Tag>;
    return <Tag color="green">Còn hàng</Tag>;
  };

  // ===== Thêm / Sửa =====
  const handleSubmit = (values) => {
    if (editing) {
      setProducts(
        products.map((p) =>
          p.id === editing.id ? { ...editing, ...values } : p,
        ),
      );
      message.success('Cập nhật sản phẩm thành công');
    } else {
      setProducts([
        ...products,
        {
          id: Date.now(),
          ...values,
        },
      ]);
      message.success('Thêm sản phẩm thành công');
    }

    setOpen(false);
    setEditing(null);
    form.resetFields();
  };

  // ===== Xóa =====
  const handleDelete = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    message.success('Xóa sản phẩm thành công');
  };

  // ===== Tìm kiếm =====
  const filteredData = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  // ===== Cột Table =====
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
      title: 'Danh mục',
      dataIndex: 'category',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (v) => v.toLocaleString('vi-VN') + ' đ',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
    },
    {
      title: 'Trạng thái',
      render: (_, record) => renderStatus(record.quantity),
    },
    {
      title: 'Thao tác',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setEditing(record);
              form.setFieldsValue(record);
              setOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
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

        <Button
          type="primary"
          onClick={() => {
            setEditing(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          Thêm sản phẩm
        </Button>
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Bắt buộc nhập tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: 'Bắt buộc nhập danh mục' }]}
          >
            <Input placeholder="Laptop / Điện thoại / Máy tính bảng..." />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: 'Bắt buộc nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: 'Bắt buộc nhập số lượng' },
              { type: 'number', min: 0, message: 'Số lượng ≥ 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
