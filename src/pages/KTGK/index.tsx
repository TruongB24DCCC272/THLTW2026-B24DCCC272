import React, { useState } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
  Row,
  Col,
  Popconfirm,
  Divider
} from "antd";
import moment from "moment";

const TRANG_THAI = {
  PENDING: "Chờ xác nhận",
  SHIPPING: "Đang giao",
  DONE: "Hoàn thành",
  CANCEL: "Hủy"
};

const khachHangList = [
  { id: "kh01", name: "Nguyễn Văn An" },
  { id: "kh02", name: "Trần Thị Bình" },
  { id: "kh03", name: "Lê Văn Cường" },
  { id: "kh04", name: "Phạm Thị Dung" },
  { id: "kh05", name: "Nguyễn Văn Em" }
];

const sanPhamList = [
  { id: "sp01", name: "Áo sơ mi nam", price: 120000 },
  { id: "sp02", name: "Quần tây công sở", price: 180000 },
  { id: "sp03", name: "Kính mát thời trang", price: 480000 },
  { id: "sp04", name: "Mũ lưỡi trai", price: 150000 },
  { id: "sp05", name: "Giày convert", price: 350000 },
  { id: "sp06", name: "Chuột máy tính", price: 220000 },
  { id: "sp07", name: "Bàn phím giả cơ", price: 450000 }
];

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}


export default function QuanLyDonHang() {
  const [donHangList, setDonHangList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);

  const [form] = Form.useForm();


  const filteredData = donHangList.filter((item) => {
    const key = searchText.toLowerCase();

    if (key) {
      if (
        !item.maDon.toLowerCase().includes(key) &&
        !item.tenKhach.toLowerCase().includes(key)
      ) return false;
    }

    if (filterStatus !== "all" && item.trangThai !== filterStatus) {
      return false;
    }

    return true;
  });


  const handleSave = (values: any) => {
    if (!values.ngay) {
      message.error("Vui lòng chọn ngày");
      return;
    }

    if (!values.items?.length) {
      message.error("Chưa có sản phẩm");
      return;
    }

    const khach = khachHangList.find((k) => k.id === values.customerId);
    if (!khach) return;

    const items = values.items.map((i: any) => {
      const sp = sanPhamList.find((p) => p.id === i.productId)!;

      return {
        productId: sp.id,
        productName: sp.name,
        price: sp.price,
        quantity: i.quantity
      };
    });

    let total = 0;
    items.forEach((x) => (total += x.price * x.quantity));

    const newOrder = {
      id: editingOrder ? editingOrder.id : Date.now(),
      maDon: values.maDon,
      tenKhach: khach.name,
      ngay: moment(values.ngay).format("YYYY-MM-DD"),
      trangThai: values.trangThai,
      items,
      tongTien: total
    };

    if (editingOrder) {
      setDonHangList((prev) =>
        prev.map((d) => (d.id === editingOrder.id ? newOrder : d))
      );
      message.success("Đã sửa đơn");
    } else {
      setDonHangList((prev) => [...prev, newOrder]);
      message.success("Đã thêm đơn");
    }

    setModalOpen(false);
    setEditingOrder(null);
    form.resetFields();
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "maDon" },
    { title: "Khách hàng", dataIndex: "tenKhach" },
    { title: "Ngày", dataIndex: "ngay" },
    {
      title: "Tổng tiền",
      render: (r: any) => <b>{formatMoney(r.tongTien)}</b>
    },
    {
      title: "Trạng thái",
      render: (r: any) => {
        let color = "blue";
        if (r.trangThai === TRANG_THAI.DONE) color = "green";
        if (r.trangThai === TRANG_THAI.CANCEL) color = "red";
        if (r.trangThai === TRANG_THAI.SHIPPING) color = "orange";

        return <Tag color={color}>{r.trangThai}</Tag>;
      }
    },
    {
      title: "Thao tác",
      render: (r: any) => (
        <Space>
          <Button
            onClick={() => {
              setEditingOrder(r);

              form.setFieldsValue({
                maDon: r.maDon,
                customerId: khachHangList.find((k) => k.name === r.tenKhach)?.id,
                ngay: moment(r.ngay, "YYYY-MM-DD"),
                trangThai: r.trangThai,
                items: r.items.map((i: any) => ({
                  productId: i.productId,
                  quantity: i.quantity
                }))
              });

              setModalOpen(true);
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Hủy đơn này?"
            onConfirm={() => {
              setDonHangList((prev) =>
                prev.map((x) =>
                  x.id === r.id
                    ? { ...x, trangThai: TRANG_THAI.CANCEL }
                    : x
                )
              );
            }}
          >
            <Button danger disabled={r.trangThai !== TRANG_THAI.PENDING}>
              Hủy
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  
  return (
    <div style={{ padding: 20 }}>
      <Card title="Quản lý đơn hàng">

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            {Object.values(TRANG_THAI).map((s) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>

          <Button
            type="primary"
            onClick={() => {
              setEditingOrder(null);
              form.resetFields();

              form.setFieldsValue({
                trangThai: TRANG_THAI.PENDING,
                ngay: moment(),
                items: [{ productId: sanPhamList[0].id, quantity: 1 }]
              });

              setModalOpen(true);
            }}
          >
            Thêm
          </Button>
        </Space>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredData}
        />
      </Card>

      <Modal
        title={editingOrder ? "Sửa đơn hàng" : "Thêm đơn hàng"}
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>

          <Form.Item name="maDon" label="Mã đơn" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="customerId" label="Khách hàng" rules={[{ required: true }]}>
            <Select>
              {khachHangList.map((k) => (
                <Select.Option key={k.id} value={k.id}>
                  {k.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="ngay" label="Ngày" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="trangThai" label="Trạng thái">
            <Select>
              {Object.values(TRANG_THAI).map((s) => (
                <Select.Option key={s} value={s}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Divider>Danh sách sản phẩm</Divider>

          <Form.List name="items" initialValue={[]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Row key={field.key} gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name={[field.name, "productId"]}
                        rules={[{ required: true }]}
                      >
                        <Select placeholder="Sản phẩm">
                          {sanPhamList.map((p) => (
                            <Select.Option key={p.id} value={p.id}>
                              {p.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item
                        name={[field.name, "quantity"]}
                        rules={[{ required: true }]}
                      >
                        <InputNumber min={1} style={{ width: "100%" }} />
                      </Form.Item>
                    </Col>

                    <Col span={4}>
                      <Button onClick={() => remove(field.name)}>X</Button>
                    </Col>
                  </Row>
                ))}

                <Button onClick={() => add()} block>
                  + thêm sản phẩm
                </Button>
              </>
            )}
          </Form.List>

        </Form>
      </Modal>
    </div>
  );
}