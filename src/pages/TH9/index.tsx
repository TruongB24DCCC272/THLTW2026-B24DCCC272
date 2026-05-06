import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layout, Menu, Card, Col, Row, Statistic, Table, Tag, 
  Button, Modal, Form, Input, Select, DatePicker, Typography, Space, Popconfirm, message 
} from 'antd';
import { 
  DashboardOutlined, ProjectOutlined, TableOutlined, 
  PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, 
  ExclamationCircleOutlined, EditOutlined, DeleteOutlined, SearchOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import moment from 'moment';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'High' | 'Medium' | 'Low';
  deadline: string;
  tags: string[];
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<'dashboard' | 'kanban' | 'list'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();


  useEffect(() => {
    const data = localStorage.getItem('kanban_v2');
    if (data) try { setTasks(JSON.parse(data)); } catch (e) { setTasks([]); }
  }, []);

  useEffect(() => {
    localStorage.setItem('kanban_v2', JSON.stringify(tasks));
  }, [tasks]);


  const handleOpenModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      form.setFieldsValue({ ...task, deadline: moment(task.deadline) });
    } else {
      setEditingTask(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  const onFinish = (values: any) => {
    const formattedTask: Task = {
      ...values,
      id: editingTask ? editingTask.id : Date.now().toString(),
  
      status: values.status || (editingTask ? editingTask.status : 'todo'),
      deadline: values.deadline.format('YYYY-MM-DD'),
      tags: values.tags || []
    };

    setTasks(prev => editingTask 
      ? prev.map(t => t.id === editingTask.id ? formattedTask : t)
      : [...prev, formattedTask]
    );
    
    setIsModalOpen(false);
    message.success(editingTask ? 'Cập nhật thành công' : 'Thêm mới thành công');
  };


  const DashboardView = () => {
    const stats = useMemo(() => ({
      total: tasks.length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.status !== 'done' && moment(t.deadline).isBefore(moment(), 'day')).length
    }), [tasks]);

    return (
      <Row gutter={16}>
        <Col span={8}><Card bordered={false}><Statistic title="Tổng task" value={stats.total} prefix={<ProjectOutlined />} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Hoàn thành" value={stats.done} valueStyle={{color: '#52c41a'}} prefix={<CheckCircleOutlined />} /></Card></Col>
        <Col span={8}><Card bordered={false}><Statistic title="Quá hạn" value={stats.overdue} valueStyle={{color: '#f5222d'}} prefix={<ExclamationCircleOutlined />} /></Card></Col>
      </Row>
    );
  };

  const KanbanView = () => {
    const columns = [
      { id: 'todo', title: 'Cần làm', color: '#1890ff' },
      { id: 'doing', title: 'Đang làm', color: '#faad14' },
      { id: 'done', title: 'Hoàn thành', color: '#52c41a' }
    ];

    const onDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination, draggableId } = result;
      if (source.droppableId === destination.droppableId) return;

      setTasks(prev => prev.map(t => 
        t.id === draggableId ? { ...t, status: destination.droppableId as any } : t
      ));
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          {columns.map(col => (
            <Col span={8} key={col.id}>
              <div style={{ background: '#f0f2f5', padding: '12px', borderRadius: '8px', minHeight: '70vh' }}>
                <Title level={5} style={{ color: col.color, marginBottom: 16 }}>{col.title.toUpperCase()}</Title>
                
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div 
                      {...provided.droppableProps} 
                      ref={provided.innerRef} 
                      style={{ 
                        minHeight: 400,
                        transition: 'background-color 0.2s ease',
                        background: snapshot.isDraggingOver ? '#e6f7ff' : 'transparent' // Hiệu ứng khi kéo task đè lên cột
                      }}
                    >
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: 'none',
                                marginBottom: 8,
                                ...provided.draggableProps.style // QUAN TRỌNG: Giữ lại style mặc định của dnd
                              }}
                            >
                              <Card
                                size="small"
                                style={{ 
                                  borderRadius: 4,
                                  boxShadow: snapshot.isDragging ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
                                }}
                                actions={[<EditOutlined onClick={() => handleOpenModal(task)} />]}
                              >
                                <Text strong>{task.title}</Text>
                                <div style={{ marginTop: 8 }}>
                                  <Tag color={task.priority === 'High' ? 'red' : 'orange'}>{task.priority}</Tag>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    );
  };


  const TaskListView = () => {
    const columns: any = [
      { 
        title: 'Tên task', 
        dataIndex: 'title', 
        key: 'title',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
          <div style={{ padding: 8 }}>
            <Input
              placeholder="Tìm tên task"
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => confirm()}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button type="primary" onClick={() => confirm()} icon={<SearchOutlined />} size="small" style={{ width: 90 }}>Tìm</Button>
              <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>Xóa</Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: any, record: any) => record.title.toLowerCase().includes(value.toLowerCase()),
      },
      { 
        title: 'Trạng thái', 
        dataIndex: 'status', 
        key: 'status',
        filters: [
          { text: 'Cần làm', value: 'todo' },
          { text: 'Đang làm', value: 'doing' },
          { text: 'Hoàn thành', value: 'done' },
        ],
        onFilter: (value: any, record: any) => record.status === value,
        render: (s: any) => <Tag color={s === 'done' ? 'green' : 'blue'}>{s.toUpperCase()}</Tag> 
      },
      { 
        title: 'Hạn chót', 
        dataIndex: 'deadline', 
        key: 'deadline', 
        sorter: (a: any, b: any) => moment(a.deadline).unix() - moment(b.deadline).unix(),
        render: (d: string) => (
          <Text type={moment(d).isBefore(moment(), 'day') ? 'danger' : 'secondary'}>
            <ClockCircleOutlined /> {d}
          </Text>
        )
      },
      { title: 'Ưu tiên', dataIndex: 'priority', key: 'priority' },
      { 
        title: 'Thao tác', 
        key: 'action', 
        render: (_: any, record: Task) => (
          <Space>
            <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenModal(record)}>Sửa</Button>
            {/* FIX: Thêm Popconfirm để xác nhận xóa */}
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa task này?"
              onConfirm={() => {
                setTasks(prev => prev.filter(t => t.id !== record.id));
                message.success('Đã xóa task');
              }}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
            </Popconfirm>
          </Space>
        )
      }
    ];
    return <Table dataSource={tasks} columns={columns} rowKey="id" />;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div style={{ color: 'white', padding: 20, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>KANBAN APP</div>
        <Menu theme="dark" selectedKeys={[view]} onClick={({ key }) => setView(key as any)}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="kanban" icon={<ProjectOutlined />}>Kanban Board</Menu.Item>
          <Menu.Item key="list" icon={<TableOutlined />}>Danh sách Task</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Quản lý công việc</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenModal()}>Thêm task mới</Button>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          {view === 'dashboard' && <DashboardView />}
          {view === 'kanban' && <KanbanView />}
          {view === 'list' && <TaskListView />}
        </Content>
      </Layout>

      <Modal
        title={editingTask ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
        visible={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Tên task" rules={[{ required: true, message: 'Vui lòng nhập tên task' }]}>
            <Input placeholder="Nhập tên việc cần làm..." />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          

          <Form.Item name="status" label="Trạng thái" initialValue="todo">
            <Select>
              <Option value="todo">Cần làm</Option>
              <Option value="doing">Đang làm</Option>
              <Option value="done">Hoàn thành</Option>
            </Select>
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="priority" label="Mức độ ưu tiên" initialValue="Medium">
                <Select>
                  <Option value="High">Cao</Option>
                  <Option value="Medium">Trung bình</Option>
                  <Option value="Low">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="deadline" label="Hạn chót" rules={[{ required: true, message: 'Vui lòng chọn hạn chót' }]}>
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tags" label="Tags (Nhãn)">
            <Select mode="tags" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default App;