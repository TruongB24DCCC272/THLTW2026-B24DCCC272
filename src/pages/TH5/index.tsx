import React, { useState } from "react";
import { Tabs, Table, Button, Input, Select, Space, Tag, Modal, Card } from "antd";
import type { ColumnsType } from 'antd/es/table';

const { TabPane } = Tabs;
const { Option } = Select;

// --- Định nghĩa kiểu dữ liệu ---
interface Club {
  id: number;
  name: string;
  image: string;
  founded: string;
  description: string;
  leader: string;
  active: boolean;
}

interface Application {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  skill: string;
  club: number | string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  note?: string;
}

interface HistoryLog {
  key: number;
  action: string;
  ids: React.Key[];
  time: string;
  reason?: string;
}

export default function TH5(): React.ReactElement {
  // --- Khởi tạo State với Type ---
  const [clubs, setClubs] = useState<Club[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [search, setSearch] = useState<string>("");

  const [clubForm, setClubForm] = useState<Omit<Club, "id">>({
    name: "",
    image: "",
    founded: "",
    description: "",
    leader: "",
    active: true
  });

  const [appForm, setAppForm] = useState<Omit<Application, "id">>({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    skill: "",
    club: "",
    reason: "",
    status: "Pending",
    note: ""
  });

  const [editingClub, setEditingClub] = useState<number | null>(null);
  const [detailApp, setDetailApp] = useState<Application | null>(null);

  // ================= LOGIC CLB =================
  const addClub = () => {
    if (!clubForm.name) return;
    if (editingClub) {
      setClubs(clubs.map(c => (c.id === editingClub ? { ...clubForm, id: editingClub } : c)));
      setEditingClub(null);
    } else {
      setClubs([...clubs, { id: clubs.length + 1, ...clubForm }]);
    }
    setClubForm({ name: "", image: "", founded: "", description: "", leader: "", active: true });
  };

  const editClub = (club: Club) => {
    setEditingClub(club.id);
    setClubForm(club);
  };

  const deleteClub = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa CLB?",
      onOk() {
        setClubs(clubs.filter(c => c.id !== id));
      }
    });
  };

  const filteredClubs = clubs.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ================= LOGIC ĐƠN =================
  const addApplication = () => {
    if (!appForm.name || !appForm.club) {
      Modal.warning({ title: "Vui lòng nhập tên và chọn CLB" });
      return;
    }
    setApplications([...applications, { id: applications.length + 1, ...appForm }]);
    setAppForm({
      name: "", email: "", phone: "", gender: "", address: "",
      skill: "", club: "", reason: "", status: "Pending", note: ""
    });
  };

  const deleteApplication = (id: number) => {
    Modal.confirm({
      title: "Bạn có chắc muốn xóa đơn?",
      onOk() {
        setApplications(applications.filter(a => a.id !== id));
      }
    });
  };

  // ================= LOGIC DUYỆT =================
  const approveSelected = () => {
    if (selectedRows.length === 0) {
      Modal.warning({ title: "Vui lòng chọn đơn" });
      return;
    }
    const updated = applications.map(a =>
      selectedRows.includes(a.id) ? { ...a, status: "Approved" as const } : a
    );
    setApplications(updated);
    setHistory([...history, {
      key: Date.now(),
      action: "Approved",
      ids: [...selectedRows],
      time: new Date().toLocaleString()
    }]);
    setSelectedRows([]);
  };

  const rejectSelected = () => {
    if (selectedRows.length === 0) {
      Modal.warning({ title: "Vui lòng chọn đơn" });
      return;
    }
    Modal.confirm({
      title: "Nhập lý do từ chối",
      content: <Input id="rejectReason" />,
      onOk() {
        const inputElement = document.getElementById("rejectReason") as HTMLInputElement;
        const reason = inputElement ? inputElement.value : "";
        const updated = applications.map(a =>
          selectedRows.includes(a.id) ? { ...a, status: "Rejected" as const, note: reason } : a
        );
        setApplications(updated);
        setHistory([...history, {
          key: Date.now(),
          action: "Rejected",
          ids: [...selectedRows],
          reason,
          time: new Date().toLocaleString()
        }]);
        setSelectedRows([]);
      }
    });
  };

  // ================= THÀNH VIÊN =================
  const members = applications.filter(a => a.status === "Approved");

  const changeClub = (clubId: number) => {
    if (selectedRows.length === 0) {
      Modal.warning({ title: "Vui lòng chọn thành viên" });
      return;
    }
    const updated = applications.map(a =>
      selectedRows.includes(a.id) ? { ...a, club: clubId } : a
    );
    setApplications(updated);
    setSelectedRows([]);
  };

  // ================= TABLE COLUMNS =================
  const clubColumns: ColumnsType<Club> = [
    { title: "Ảnh", dataIndex: "image", render: i => (i ? <img src={i} alt="club" width="40" /> : "") },
    { title: "Tên CLB", dataIndex: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Ngày thành lập", dataIndex: "founded" },
    { title: "Chủ nhiệm", dataIndex: "leader" },
    { title: "Hoạt động", render: (_, r) => (r.active ? <Tag color="green">Có</Tag> : <Tag>Không</Tag>) },
    {
      title: "Thao tác",
      render: (_, r) => (
        <Space>
          <Button onClick={() => editClub(r)}>Sửa</Button>
          <Button danger onClick={() => deleteClub(r.id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  const appColumns: ColumnsType<Application> = [
    { title: "Họ tên", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "SĐT", dataIndex: "phone" },
    { title: "Giới tính", dataIndex: "gender" },
    { title: "Địa chỉ", dataIndex: "address" },
    { title: "Sở trường", dataIndex: "skill" },
    { title: "CLB", render: (_, r) => clubs.find(c => c.id === r.club)?.name },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s: string) => {
        if (s === "Approved") return <Tag color="green">Approved</Tag>;
        if (s === "Rejected") return <Tag color="red">Rejected</Tag>;
        return <Tag>Pending</Tag>;
      }
    },
    {
      title: "Thao tác",
      render: (_, r) => (
        <Space>
          <Button onClick={() => setDetailApp(r)}>Xem</Button>
          <Button danger onClick={() => deleteApplication(r.id)}>Xóa</Button>
        </Space>
      )
    }
  ];

  const historyColumns: ColumnsType<HistoryLog> = [
    { title: "Action", dataIndex: "action" },
    { title: "IDs", render: (_, r) => r.ids.join(",") },
    { title: "Reason", dataIndex: "reason" },
    { title: "Time", dataIndex: "time" }
  ];

  // ================= UI =================
  return (
    <div style={{ padding: 20 }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Câu lạc bộ" key="1">
          <Space wrap>
            <Input placeholder="Tìm CLB" onChange={e => setSearch(e.target.value)} />
            <Input placeholder="Tên CLB" value={clubForm.name} onChange={e => setClubForm({ ...clubForm, name: e.target.value })} />
            <Input placeholder="Ảnh URL" value={clubForm.image} onChange={e => setClubForm({ ...clubForm, image: e.target.value })} />
            <Input placeholder="Ngày thành lập" value={clubForm.founded} onChange={e => setClubForm({ ...clubForm, founded: e.target.value })} />
            <Input placeholder="Chủ nhiệm" value={clubForm.leader} onChange={e => setClubForm({ ...clubForm, leader: e.target.value })} />
            <Input placeholder="Mô tả HTML" value={clubForm.description} onChange={e => setClubForm({ ...clubForm, description: e.target.value })} />
            <Button type="primary" onClick={addClub}>{editingClub ? "Cập nhật" : "Thêm CLB"}</Button>
          </Space>
          <Table style={{ marginTop: 20 }} columns={clubColumns} dataSource={filteredClubs} rowKey="id" />
        </TabPane>

        <TabPane tab="Đơn đăng ký" key="2">
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Input placeholder="Họ tên" value={appForm.name} onChange={e => setAppForm({ ...appForm, name: e.target.value })} />
              <Input placeholder="Email" value={appForm.email} onChange={e => setAppForm({ ...appForm, email: e.target.value })} />
              <Input placeholder="SĐT" value={appForm.phone} onChange={e => setAppForm({ ...appForm, phone: e.target.value })} />
              <Input placeholder="Giới tính" value={appForm.gender} onChange={e => setAppForm({ ...appForm, gender: e.target.value })} />
              <Input placeholder="Địa chỉ" value={appForm.address} onChange={e => setAppForm({ ...appForm, address: e.target.value })} />
              <Input placeholder="Sở trường" value={appForm.skill} onChange={e => setAppForm({ ...appForm, skill: e.target.value })} />
              <Select
                placeholder={clubs.length === 0 ? "Chưa có CLB" : "Chọn CLB"}
                value={appForm.club || undefined}
                style={{ width: '100%' }}
                onChange={v => setAppForm({ ...appForm, club: v })}
              >
                {clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
              </Select>
              <Input placeholder="Lý do đăng ký" value={appForm.reason} onChange={e => setAppForm({ ...appForm, reason: e.target.value })} />
              <Button type="primary" onClick={addApplication}>Gửi đơn</Button>
            </Space>
            <Space style={{ marginTop: 20 }}>
              <Button onClick={approveSelected}>Duyệt đơn</Button>
              <Button danger onClick={rejectSelected}>Từ chối</Button>
            </Space>
            <Table
              style={{ marginTop: 20 }}
              columns={appColumns}
              dataSource={applications}
              rowKey="id"
              rowSelection={{ onChange: (rows) => setSelectedRows(rows) }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Thành viên" key="3">
          <Select placeholder="Chuyển CLB" style={{ width: 200 }} onChange={changeClub}>
            {clubs.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
          </Select>
          <Table
            style={{ marginTop: 20 }}
            columns={appColumns}
            dataSource={members}
            rowKey="id"
            rowSelection={{ onChange: (rows) => setSelectedRows(rows) }}
          />
        </TabPane>

        <TabPane tab="Thống kê" key="4">
          <Card>
            <h3>Số CLB: {clubs.length}</h3>
            <h3>Pending: {applications.filter(a => a.status === "Pending").length}</h3>
            <h3>Approved: {applications.filter(a => a.status === "Approved").length}</h3>
            <h3>Rejected: {applications.filter(a => a.status === "Rejected").length}</h3>
          </Card>
        </TabPane>

        <TabPane tab="Lịch sử thao tác" key="5">
          <Table columns={historyColumns} dataSource={history} rowKey="key" />
        </TabPane>
      </Tabs>

      <Modal
        visible={!!detailApp} // Antd v4 dùng visible
        onCancel={() => setDetailApp(null)}
        footer={null}
        title="Chi tiết đơn đăng ký"
      >
        {detailApp && (
          <div>
            <p>Họ tên: {detailApp.name}</p>
            <p>Email: {detailApp.email}</p>
            <p>SĐT: {detailApp.phone}</p>
            <p>Địa chỉ: {detailApp.address}</p>
            <p>Sở trường: {detailApp.skill}</p>
            <p>Lý do: {detailApp.reason}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}