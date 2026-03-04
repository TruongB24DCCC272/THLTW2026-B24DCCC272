import React, { useState, useEffect } from 'react';
import {
  Card,
  Tabs,
  Input,
  Button,
  Table,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  message,
  Tag,
  Space,
} from 'antd';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { Option } = Select;

export default function StudyApp() {
  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [goals, setGoals] = useState([]);

  const [subjectModal, setSubjectModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);
  const [editingSession, setEditingSession] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);

  const [subjectForm] = Form.useForm();
  const [sessionForm] = Form.useForm();
  const [goalForm] = Form.useForm();

  // Load localStorage
  useEffect(() => {
    setSubjects(JSON.parse(localStorage.getItem('subjects')) || []);
    setSessions(JSON.parse(localStorage.getItem('sessions')) || []);
    setGoals(JSON.parse(localStorage.getItem('goals')) || []);
  }, []);

  // Save localStorage
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  // ================= SUBJECT CRUD =================

  const saveSubject = (values) => {
    if (editingSubject) {
      setSubjects(subjects.map(s =>
        s.id === editingSubject.id ? { ...s, ...values } : s
      ));
      message.success('Đã cập nhật môn');
    } else {
      setSubjects([...subjects, { id: Date.now(), ...values }]);
      message.success('Đã thêm môn');
    }
    setSubjectModal(false);
    subjectForm.resetFields();
    setEditingSubject(null);
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
    message.success('Đã xóa môn');
  };

  const showSubjectModal = (record = null) => {
    if (record) {
      setEditingSubject(record);
      subjectForm.setFieldsValue(record);
    } else {
      setEditingSubject(null);
      subjectForm.resetFields();
    }
    setSubjectModal(true);
  };

  // ================= SESSION CRUD =================

  const saveSession = (values) => {
    const newData = {
      ...values,
      date: values.date.format('YYYY-MM-DD'),
    };

    if (editingSession) {
      setSessions(sessions.map(s =>
        s.id === editingSession.id ? { ...s, ...newData } : s
      ));
      message.success('Đã cập nhật lịch học');
    } else {
      setSessions([...sessions, { id: Date.now(), ...newData }]);
      message.success('Đã thêm lịch học');
    }
    setSessionModal(false);
    sessionForm.resetFields();
    setEditingSession(null);
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    message.success('Đã xóa lịch học');
  };

  const showSessionModal = (record = null) => {
    if (record) {
      setEditingSession(record);
      sessionForm.setFieldsValue({
        ...record,
        date: dayjs(record.date),
      });
    } else {
      setEditingSession(null);
      sessionForm.resetFields();
    }
    setSessionModal(true);
  };

  // ================= GOAL CRUD =================

  const saveGoal = (values) => {
    if (editingGoal) {
      setGoals(goals.map(g =>
        g.id === editingGoal.id ? { ...g, ...values } : g
      ));
      message.success('Đã cập nhật mục tiêu');
    } else {
      setGoals([...goals, { id: Date.now(), ...values }]);
      message.success('Đã thêm mục tiêu');
    }
    setGoalModal(false);
    goalForm.resetFields();
    setEditingGoal(null);
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
    message.success('Đã xóa mục tiêu');
  };

  const showGoalModal = (record = null) => {
    if (record) {
      setEditingGoal(record);
      goalForm.setFieldsValue(record);
    } else {
      setEditingGoal(null);
      goalForm.resetFields();
    }
    setGoalModal(true);
  };

  // ================= TÍNH TIẾN ĐỘ =================

  const calculateHours = (subjectId, month) => {
    return sessions
      .filter(s =>
        s.date.startsWith(month) &&
        (subjectId ? s.subjectId === subjectId : true)
      )
      .reduce((total, s) => total + s.duration, 0);
  };

  // ================= UI =================

  return (
    <Card title="Quản lý học tập">
      <Tabs defaultActiveKey="1">

        {/* ===== SUBJECT TAB ===== */}
        <TabPane tab="Môn học" key="1">
          <Button type="primary" onClick={() => showSubjectModal()}>
            Thêm môn
          </Button>

          <Table
            rowKey="id"
            dataSource={subjects}
            style={{ marginTop: 20 }}
            columns={[
              { title: 'Tên môn', dataIndex: 'name' },
              {
                title: 'Hành động',
                render: (_, record) => (
                  <Space>
                    <Button onClick={() => showSubjectModal(record)}>Sửa</Button>
                    <Button danger onClick={() => deleteSubject(record.id)}>
                      Xóa
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </TabPane>

        {/* ===== SESSION TAB ===== */}
        <TabPane tab="Lịch học" key="2">
          <Button type="primary" onClick={() => showSessionModal()}>
            Thêm lịch học
          </Button>

          <Table
            rowKey="id"
            dataSource={sessions}
            style={{ marginTop: 20 }}
            columns={[
              {
                title: 'Môn',
                render: (_, r) =>
                  subjects.find(s => s.id === r.subjectId)?.name,
              },
              { title: 'Ngày', dataIndex: 'date' },
              { title: 'Thời lượng (giờ)', dataIndex: 'duration' },
              { title: 'Nội dung', dataIndex: 'content' },
              { title: 'Ghi chú', dataIndex: 'note' },
              {
                title: 'Hành động',
                render: (_, record) => (
                  <Space>
                    <Button onClick={() => showSessionModal(record)}>Sửa</Button>
                    <Button danger onClick={() => deleteSession(record.id)}>
                      Xóa
                    </Button>
                  </Space>
                ),
              },
            ]}
          />
        </TabPane>

        {/* ===== GOAL TAB ===== */}
        <TabPane tab="Mục tiêu tháng" key="3">
          <Button type="primary" onClick={() => showGoalModal()}>
            Thêm mục tiêu
          </Button>

          <Table
            rowKey="id"
            dataSource={goals}
            style={{ marginTop: 20 }}
            columns={[
              {
                title: 'Môn',
                render: (_, r) =>
                  r.subjectId
                    ? subjects.find(s => s.id === r.subjectId)?.name
                    : 'Tổng tất cả',
              },
              { title: 'Tháng', dataIndex: 'month' },
              { title: 'Mục tiêu (giờ)', dataIndex: 'targetHours' },
              {
                title: 'Trạng thái',
                render: (_, r) => {
                  const hours = calculateHours(r.subjectId, r.month);
                  return hours >= r.targetHours
                    ? <Tag color="green">Đã đạt</Tag>
                    : <Tag color="red">Chưa đạt</Tag>;
                },
              },
              {
                title: 'Hành động',
                render: (_, record) => (
                  <Button danger onClick={() => deleteGoal(record.id)}>
                    Xóa
                  </Button>
                ),
              },
            ]}
          />
        </TabPane>

      </Tabs>

      {/* ================= SUBJECT MODAL ================= */}
      <Modal
        title={editingSubject ? 'Sửa môn' : 'Thêm môn'}
        visible={subjectModal}
        onOk={() => subjectForm.submit()}
        onCancel={() => {
          setSubjectModal(false);
          subjectForm.resetFields();
          setEditingSubject(null);
        }}
      >
        <Form
          form={subjectForm}
          layout="vertical"
          onFinish={saveSubject}
        >
          <Form.Item
            name="name"
            label="Tên môn"
            rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
          >
            <Input placeholder="Nhập tên môn" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= SESSION MODAL ================= */}
      <Modal
        title={editingSession ? 'Sửa lịch học' : 'Thêm lịch học'}
        visible={sessionModal}
        onOk={() => sessionForm.submit()}
        onCancel={() => {
          setSessionModal(false);
          sessionForm.resetFields();
          setEditingSession(null);
        }}
      >
        <Form
          form={sessionForm}
          layout="vertical"
          onFinish={saveSession}
        >
          <Form.Item
            name="subjectId"
            label="Chọn môn"
            rules={[{ required: true, message: 'Vui lòng chọn môn' }]}
          >
            <Select placeholder="Chọn môn">
              {subjects.map(s => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời lượng (giờ)"
            rules={[{ required: true, message: 'Vui lòng nhập thời lượng' }]}
          >
            <InputNumber min={0} step={0.5} />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
          >
            <Input.TextArea rows={3} placeholder="Nhập nội dung bài học" />
          </Form.Item>
          <Form.Item
            name="note"
            label="Ghi chú"
          >
            <Input.TextArea rows={2} placeholder="Ghi chú thêm" />
          </Form.Item>
        </Form>
      </Modal>

      {/* ================= GOAL MODAL ================= */}
      <Modal
        title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
        visible={goalModal}
        onOk={() => goalForm.submit()}
        onCancel={() => {
          setGoalModal(false);
          goalForm.resetFields();
          setEditingGoal(null);
        }}
      >
        <Form
          form={goalForm}
          layout="vertical"
          onFinish={saveGoal}
        >
          <Form.Item
            name="subjectId"
            label="Môn (để trống = tổng tất cả)"
          >
            <Select placeholder="Chọn môn (tùy chọn)" allowClear>
              {subjects.map(s => (
                <Option key={s.id} value={s.id}>{s.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="month"
            label="Tháng (YYYY-MM)"
            rules={[{ required: true, message: 'Vui lòng nhập tháng' }]}
          >
            <Input placeholder="VD: 2024-03" />
          </Form.Item>
          <Form.Item
            name="targetHours"
            label="Mục tiêu (giờ)"
            rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]}
          >
            <InputNumber min={0} step={0.5} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}