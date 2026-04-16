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
import moment from 'moment';

const { TabPane } = Tabs;


type Subject = {
  id: number;
  name: string;
};

type Session = {
  id: number;
  subjectId: number;
  date: string;
  duration: number;
  content?: string;
  note?: string;
};

type Goal = {
  id: number;
  subjectId?: number;
  month: string;
  targetHours: number;
};

export default function StudyApp(): JSX.Element {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [subjectModal, setSubjectModal] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const [goalModal, setGoalModal] = useState(false);

  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [subjectForm] = Form.useForm();
  const [sessionForm] = Form.useForm();
  const [goalForm] = Form.useForm();

  
  useEffect(() => {
    setSubjects(JSON.parse(localStorage.getItem('subjects') || '[]'));
    setSessions(JSON.parse(localStorage.getItem('sessions') || '[]'));
    setGoals(JSON.parse(localStorage.getItem('goals') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

 
  const saveSubject = (values: { name: string }) => {
    if (editingSubject) {
      setSubjects(subjects.map(s =>
        s.id === editingSubject.id ? { ...s, ...values } : s
      ));
      message.success('Đã cập nhật môn học');
    } else {
      setSubjects([...subjects, { id: Date.now(), name: values.name }]);
      message.success('Đã thêm môn học');
    }

    setSubjectModal(false);
    subjectForm.resetFields();
    setEditingSubject(null);
  };

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
    message.success('Đã xóa môn học');
  };

  const showSubjectModal = (record: Subject | null = null) => {
    if (record) {
      setEditingSubject(record);
      subjectForm.setFieldsValue(record);
    } else {
      setEditingSubject(null);
      subjectForm.resetFields();
    }
    setSubjectModal(true);
  };

  
  const saveSession = (values: any) => {
    const newData: Session = {
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

  const deleteSession = (id: number) => {
    setSessions(sessions.filter(s => s.id !== id));
    message.success('Đã xóa lịch học');
  };

  const showSessionModal = (record: Session | null = null) => {
    if (record) {
      setEditingSession(record);
      sessionForm.setFieldsValue({
        ...record,
        date: moment(record.date),
      });
    } else {
      setEditingSession(null);
      sessionForm.resetFields();
    }
    setSessionModal(true);
  };


  const saveGoal = (values: Goal) => {
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

  const deleteGoal = (id: number) => {
    setGoals(goals.filter(g => g.id !== id));
    message.success('Đã xóa mục tiêu');
  };

  const showGoalModal = (record: Goal | null = null) => {
    if (record) {
      setEditingGoal(record);
      goalForm.setFieldsValue(record);
    } else {
      setEditingGoal(null);
      goalForm.resetFields();
    }
    setGoalModal(true);
  };

 
  const calculateHours = (subjectId?: number, month?: string) => {
    if (!month) return 0;

    return sessions
      .filter(s =>
        s.date.startsWith(month) &&
        (subjectId ? s.subjectId === subjectId : true)
      )
      .reduce((total, s) => total + s.duration, 0);
  };

 
  return (
    <Card title="Quản lý học tập">
      <Tabs defaultActiveKey="1">

        
        <TabPane tab="Môn học" key="1">
          <Button type="primary" onClick={() => showSubjectModal()}>
            Thêm môn
          </Button>

          <Table
            rowKey="id"
            dataSource={subjects}
            style={{ marginTop: 20 }}
            columns={[
              { title: 'Tên môn học', dataIndex: 'name' },
              {
                title: 'Hành động',
                render: (_, record: Subject) => (
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
                title: 'Môn học',
                render: (_, r: Session) =>
                  subjects.find(s => s.id === r.subjectId)?.name,
              },
              { title: 'Ngày học', dataIndex: 'date' },
              { title: 'Thời lượng (giờ)', dataIndex: 'duration' },
              { title: 'Nội dung', dataIndex: 'content' },
              { title: 'Ghi chú', dataIndex: 'note' },
              {
                title: 'Hành động',
                render: (_, record: Session) => (
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
                title: 'Môn học',
                render: (_, r: Goal) =>
                  r.subjectId
                    ? subjects.find(s => s.id === r.subjectId)?.name
                    : 'Tổng tất cả',
              },
              { title: 'Tháng', dataIndex: 'month' },
              { title: 'Mục tiêu (giờ)', dataIndex: 'targetHours' },
              {
                title: 'Trạng thái',
                render: (_, r: Goal) => {
                  const hours = calculateHours(r.subjectId, r.month);
                  return hours >= r.targetHours
                    ? <Tag color="green">Đã đạt</Tag>
                    : <Tag color="red">Chưa đạt</Tag>;
                },
              },
              {
                title: 'Hành động',
                render: (_, record: Goal) => (
                  <Button danger onClick={() => deleteGoal(record.id)}>
                    Xóa
                  </Button>
                ),
              },
            ]}
          />
        </TabPane>

      </Tabs>

      

   
      <Modal
        title={editingSubject ? 'Sửa môn học' : 'Thêm môn học'}
        visible={subjectModal}
        onOk={() => subjectForm.submit()}
        onCancel={() => setSubjectModal(false)}
      >
        <Form form={subjectForm} onFinish={saveSubject} layout="vertical">
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: 'Nhập tên môn học' }]}
          >
            <Input placeholder="VD: Toán, Lý, Hóa..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* SESSION */}
      <Modal
        title={editingSession ? 'Sửa lịch học' : 'Thêm lịch học'}
        visible={sessionModal}
        onOk={() => sessionForm.submit()}
        onCancel={() => setSessionModal(false)}
      >
        <Form form={sessionForm} onFinish={saveSession} layout="vertical">

          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true, message: 'Chọn môn học' }]}
          >
            <Select placeholder="Chọn môn học">
              {subjects.map(s => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày học"
            rules={[{ required: true, message: 'Chọn ngày học' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời lượng (giờ)"
            rules={[{ required: true, message: 'Nhập thời lượng' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="VD: 2" />
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Input.TextArea placeholder="Nội dung buổi học" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea placeholder="Ghi chú thêm" />
          </Form.Item>

        </Form>
      </Modal>

      {/* GOAL */}
      <Modal
        title={editingGoal ? 'Sửa mục tiêu' : 'Thêm mục tiêu'}
        visible={goalModal}
        onOk={() => goalForm.submit()}
        onCancel={() => setGoalModal(false)}
      >
        <Form form={goalForm} onFinish={saveGoal} layout="vertical">

          <Form.Item name="subjectId" label="Môn học (tuỳ chọn)">
            <Select allowClear placeholder="Tổng tất cả">
              {subjects.map(s => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="month"
            label="Tháng (YYYY-MM)"
            rules={[{ required: true, message: 'Nhập tháng' }]}
          >
            <Input placeholder="2026-04" />
          </Form.Item>

          <Form.Item
            name="targetHours"
            label="Mục tiêu (giờ)"
            rules={[{ required: true, message: 'Nhập mục tiêu' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="VD: 20" />
          </Form.Item>

        </Form>
      </Modal>

    </Card>
  );
}