import React, { useState } from 'react';
import { 
 Layout, Menu, Card, Row, Col, Statistic, Table, Tag, Button, 
 Modal, Form, Input, InputNumber, Select, DatePicker, Popconfirm, 
 Progress, Drawer, Segmented, Timeline, Typography, Space, Empty, Divider
} from 'antd';
import { 
  DashboardOutlined, HistoryOutlined, HeartOutlined, 
  TrophyOutlined, BookOutlined, DeleteOutlined, 
  EditOutlined, SearchOutlined, EyeOutlined, FireOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;


interface Workout {
  id: string; date: string; type: string; duration: number; calories: number; notes: string; status: 'Hoàn thành' | 'Bỏ lỡ';
}
interface HealthMetric {
  id: string; date: string; weight: number; height: number; bmi: number; restingHR: number; sleepHours: number;
}
interface Goal {
  id: string; name: string; type: 'Giảm cân' | 'Tăng cơ' | 'Sức bền' | 'Khác'; targetValue: number; currentValue: number; deadline: string; status: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
}
interface LibraryExercise {
  id: string; name: string; muscle: string; difficulty: 'Dễ' | 'Trung bình' | 'Khó'; description: string; fullGuide: string; calPerHour: number;
}

const FitnessApp: React.FC = () => {

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exerciseFilter, setExerciseFilter] = useState('');
  const [goalFilter, setGoalFilter] = useState('Tất cả');

  
  const [isWorkoutModal, setIsWorkoutModal] = useState(false);
  const [isMetricModal, setIsMetricModal] = useState(false);
  const [isGoalDrawer, setIsGoalDrawer] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState<{visible: boolean, data: any}>({visible: false, data: null});
  const [editingItem, setEditingItem] = useState<any>(null);

  
  const [workoutForm] = Form.useForm();
  const [metricForm] = Form.useForm();
  const [goalForm] = Form.useForm();

  const calcBMI = (w: number, h: number) => parseFloat((w / ((h / 100) * (h / 100))).toFixed(1));
  const getBMITag = (bmi: number) => {
    if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
    if (bmi < 25) return <Tag color="green">Bình thường</Tag>;
    if (bmi < 30) return <Tag color="orange">Thừa cân</Tag>;
    return <Tag color="red">Béo phì</Tag>;
  };

  const exerciseLibrary: LibraryExercise[] = [
    { id: '1', name: 'Plank', muscle: 'Core', difficulty: 'Dễ', description: 'Giữ tư thế chống đẩy bằng khuỷu tay', fullGuide: '1. Nằm sấp... 2. Nâng người bằng khuỷu tay... 3. Giữ lưng thẳng trong 60s.', calPerHour: 200 },
    { id: '2', name: 'Squat', muscle: 'Legs', difficulty: 'Trung bình', description: 'Đứng lên ngồi xuống với lưng thẳng', fullGuide: '1. Đứng rộng bằng vai... 2. Hạ mông như ngồi ghế... 3. Đẩy người lên.', calPerHour: 400 },
    { id: '3', name: 'Burpees', muscle: 'Full Body', difficulty: 'Khó', description: 'Kết hợp nhảy và chống đẩy', fullGuide: '1. Squat... 2. Nhảy ra sau thành plank... 3. Nhảy ngược lại và bật cao.', calPerHour: 600 },
  ];

  const CustomChart = ({ color }: { title: string, color: string }) => (
    <div style={{ height: 150, display: 'flex', alignItems: 'flex-end', gap: 10, padding: '10px 0', borderBottom: '1px solid #eee' }}>
      {[30, 60, 45, 80, 55].map((h, i) => (
        <div key={i} style={{ flex: 1, height: `${h}%`, background: color, borderRadius: '2px' }} title={`${h} đơn vị`} />
      ))}
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" breakpoint="lg" collapsedWidth="0">
        <div style={{ height: 64, color: 'white', lineHeight: '64px', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>PTIT FITNESS</div>
        <Menu theme="dark" mode="inline" selectedKeys={[activeMenu]} onClick={({ key }) => setActiveMenu(key)}>
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>
          <Menu.Item key="workout" icon={<HistoryOutlined />}>Nhật ký tập luyện</Menu.Item>
          <Menu.Item key="health" icon={<HeartOutlined />}>Chỉ số sức khỏe</Menu.Item>
          <Menu.Item key="goals" icon={<TrophyOutlined />}>Quản lý mục tiêu</Menu.Item>
          <Menu.Item key="library" icon={<BookOutlined />}>Thư viện bài tập</Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>Hệ thống Quản lý Sức khỏe</Title>
        </Header>

        <Content style={{ margin: '24px', overflowY: 'auto' }}>
     
          {activeMenu === 'dashboard' && (
            <div className="dashboard-content">
              <Row gutter={[16, 16]}>
                <Col span={6}><Card><Statistic title="Buổi tập/tháng" value={workouts.length} prefix={<HistoryOutlined />} /></Card></Col>
                <Col span={6}><Card><Statistic title="Calo đốt" value={workouts.reduce((s, w) => s + w.calories, 0)} suffix="kcal" /></Card></Col>
                <Col span={6}><Card><Statistic title="Streak" value={3} suffix="ngày" valueStyle={{color: '#cf1322'}} /></Card></Col>
                <Col span={6}><Card><Statistic title="Mục tiêu (%)" value={70} suffix="%" /></Card></Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                <Col span={12}><Card title="Buổi tập theo tuần"><CustomChart title="Tuần" color="#1890ff" /></Card></Col>
                <Col span={12}><Card title="Thay đổi cân nặng"><CustomChart title="Cân nặng" color="#52c41a" /></Card></Col>
                <Col span={24}>
                  <Card title="5 buổi tập gần nhất">
                    {workouts.length > 0 ? (
                      <Timeline mode="left">
                        {workouts.slice(0, 5).map(w => (
                          <Timeline.Item 
                            key={w.id} 
                            label={w.date} 
                            color={w.status === 'Hoàn thành' ? 'green' : 'red'}
                          >
                            {w.type} - {w.duration} phút ({w.status})
                          </Timeline.Item>
                        ))}
                      </Timeline>
                    ) : (
                      <Empty description="Chưa có dữ liệu tập luyện" />
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {activeMenu === 'workout' && (
            <Card title="Nhật ký tập luyện" extra={
              <Space>
                <Input placeholder="Tìm bài tập..." prefix={<SearchOutlined />} />
                <RangePicker />
                <Button type="primary" onClick={() => { setEditingItem(null); workoutForm.resetFields(); setIsWorkoutModal(true); }}>+ Thêm</Button>
              </Space>
            }>
              <Table dataSource={workouts} rowKey="id" pagination={{pageSize: 5}} columns={[
                { title: 'Ngày', dataIndex: 'date' },
                { title: 'Bài tập', dataIndex: 'type' },
                { title: 'Phút', dataIndex: 'duration' },
                { title: 'Kcal', dataIndex: 'calories' },
                { title: 'Trạng thái', dataIndex: 'status', render: s => <Tag color={s === 'Hoàn thành' ? 'green' : 'red'}>{s}</Tag> },
                { title: 'Thao tác', render: (_, r) => (
                  <Space>
                    <Button type="link" icon={<EditOutlined />} onClick={() => { setEditingItem(r); workoutForm.setFieldsValue({...r, date: dayjs(r.date)}); setIsWorkoutModal(true); }} />
                    <Popconfirm title="Xóa buổi tập này?" onConfirm={() => setWorkouts(workouts.filter(x => x.id !== r.id))}><Button type="link" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </Space>
                )}
              ]} />
            </Card>
          )}

         
          {activeMenu === 'health' && (
            <Card title="Chỉ số cơ thể" extra={<Button type="primary" onClick={() => { metricForm.resetFields(); setIsMetricModal(true); }}>+ Cập nhật chỉ số</Button>}>
              <Table dataSource={metrics} rowKey="id" columns={[
                { title: 'Ngày', dataIndex: 'date' },
                { title: 'Cân nặng', dataIndex: 'weight', render: v => `${v}kg` },
                { title: 'Chiều cao', dataIndex: 'height', render: v => `${v}cm` },
                { title: 'BMI', dataIndex: 'bmi', render: v => <Space>{v} {getBMITag(v)}</Space> },
                { title: 'Nhịp tim', dataIndex: 'restingHR', render: v => `${v} bpm` },
                { title: 'Ngủ', dataIndex: 'sleepHours', render: v => `${v}h` },
                { title: 'Thao tác', render: (_, r) => <Button danger type="link" icon={<DeleteOutlined />} onClick={() => setMetrics(metrics.filter(x => x.id !== r.id))} /> }
              ]} />
            </Card>
          )}

       
          {activeMenu === 'goals' && (
            <div className="goals-section">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Segmented options={['Tất cả', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']} value={goalFilter} onChange={(v: any) => setGoalFilter(v)} />
                  <Button type="primary" onClick={() => { goalForm.resetFields(); setIsGoalDrawer(true); }}>Thêm mục tiêu</Button>
                </div>
                <Row gutter={[16, 16]}>
                  {goals.filter(g => goalFilter === 'Tất cả' || g.status === goalFilter).map(g => (
                    <Col span={8} key={g.id}>
                      <Card 
                        title={g.name} 
                        extra={
                          <Popconfirm title="Xóa?" onConfirm={() => setGoals(goals.filter(x => x.id !== g.id))}>
                            <DeleteOutlined style={{color:'red'}} />
                          </Popconfirm>
                        }
                        actions={[
                          <Button 
                            type="link" 
                            size="small" 
                            disabled={g.status === 'Đã đạt'}
                            onClick={() => setGoals(goals.map(x => x.id === g.id ? {...x, currentValue: x.targetValue, status: 'Đã đạt'} : x))}
                          >
                            Hoàn thành
                          </Button>,
                          <Button 
                            type="link" 
                            size="small" 
                            danger
                            disabled={g.status === 'Đã hủy'}
                            onClick={() => setGoals(goals.map(x => x.id === g.id ? {...x, status: 'Đã hủy'} : x))}
                          >
                            Hủy bỏ
                          </Button>
                        ]}
                      >
                        <Tag color={g.status === 'Đã đạt' ? 'green' : g.status === 'Đã hủy' ? 'default' : 'blue'}>
                          {g.type} - {g.status}
                        </Tag>
                        <div style={{ margin: '15px 0' }}>
                          <Text>Tiến độ: </Text>
                          <InputNumber 
                            size="small" 
                            value={g.currentValue} 
                            onChange={(v) => {
                              const val = v || 0;
                              setGoals(goals.map(x => {
                                if (x.id === g.id) {
                                  const newStatus = val >= x.targetValue ? 'Đã đạt' : 'Đang thực hiện';
                                  return {...x, currentValue: val, status: newStatus};
                                }
                                return x;
                              }));
                            }} 
                          /> / {g.targetValue}
                          <Progress 
                            percent={Math.round((g.currentValue/g.targetValue)*100)} 
                            status={g.status === 'Đã đạt' ? 'success' : g.status === 'Đã hủy' ? 'exception' : 'active'} 
                          />
                        </div>
                        <Text type="secondary">Deadline: {g.deadline}</Text>
                      </Card>
                    </Col>
                  ))}
                  {goals.length === 0 && <Empty style={{width: '100%'}} />}
                </Row>
              </Space>
            </div>
          )}

          {activeMenu === 'library' && (
            <div>
              <Input placeholder="Tìm kiếm bài tập..." style={{ marginBottom: 20, width: 300 }} onChange={e => setExerciseFilter(e.target.value)} />
              <Row gutter={[16, 16]}>
                {exerciseLibrary.filter(ex => ex.name.toLowerCase().includes(exerciseFilter.toLowerCase())).map(ex => (
                  <Col span={8} key={ex.id}>
                    <Card hoverable actions={[<EyeOutlined key="view" onClick={() => setIsDetailModal({visible: true, data: ex})} />]}>
                      <Card.Meta title={ex.name} description={<><Tag color="orange">{ex.muscle}</Tag><Tag color="purple">{ex.difficulty}</Tag></>} />
                      <p style={{ marginTop: 12 }}>{ex.description}</p>
                      <Text type="secondary"><FireOutlined /> {ex.calPerHour} kcal/giờ</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Content>

        
        <Modal visible={isWorkoutModal} title={editingItem ? "Sửa buổi tập" : "Thêm buổi tập"} onCancel={() => setIsWorkoutModal(false)} onOk={() => workoutForm.submit()}>
          <Form form={workoutForm} layout="vertical" onFinish={(v) => {
            const newItem = { ...v, id: editingItem?.id || Date.now().toString(), date: v.date.format('YYYY-MM-DD') };
            setWorkouts(editingItem ? workouts.map(x => x.id === newItem.id ? newItem : x) : [newItem, ...workouts]);
            setIsWorkoutModal(false);
          }}>
            <Form.Item name="date" label="Ngày tập" rules={[{required: true}]}><DatePicker style={{width:'100%'}} /></Form.Item>
            <Form.Item name="type" label="Loại" rules={[{required: true}]}><Select options={['Cardio', 'Strength', 'Yoga', 'HIIT', 'Other'].map(v => ({label:v, value:v}))} /></Form.Item>
            <Row gutter={10}>
              <Col span={12}><Form.Item name="duration" label="Phút"><InputNumber style={{width:'100%'}} /></Form.Item></Col>
              <Col span={12}><Form.Item name="calories" label="Calo"><InputNumber style={{width:'100%'}} /></Form.Item></Col>
            </Row>
            <Form.Item name="status" label="Trạng thái" initialValue="Hoàn thành"><Select options={[{label:'Hoàn thành', value:'Hoàn thành'}, {label:'Bỏ lỡ', value:'Bỏ lỡ'}]} /></Form.Item>
          </Form>
        </Modal>

        <Modal visible={isMetricModal} title="Cập nhật chỉ số" onCancel={() => setIsMetricModal(false)} onOk={() => metricForm.submit()}>
          <Form form={metricForm} layout="vertical" onFinish={(v) => {
             const bmi = calcBMI(v.weight || 0, v.height || 0);
             setMetrics([{...v, id: Date.now().toString(), date: dayjs().format('YYYY-MM-DD'), bmi}, ...metrics]);
             setIsMetricModal(false);
          }}>
            <Row gutter={10}>
              <Col span={12}><Form.Item name="weight" label="Cân nặng (kg)" rules={[{required: true}]}><InputNumber style={{width:'100%'}} /></Form.Item></Col>
              <Col span={12}><Form.Item name="height" label="Chiều cao (cm)" rules={[{required: true}]}><InputNumber style={{width:'100%'}} /></Form.Item></Col>
            </Row>
            <Form.Item name="restingHR" label="Nhịp tim nghỉ (bpm)"><InputNumber style={{width:'100%'}} /></Form.Item>
            <Form.Item name="sleepHours" label="Giờ ngủ"><InputNumber style={{width:'100%'}} /></Form.Item>
          </Form>
        </Modal>

    
        <Drawer 
          title="Thêm mục tiêu mới" 
          visible={isGoalDrawer} 
          width={400} 
          onClose={() => setIsGoalDrawer(false)}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button onClick={() => setIsGoalDrawer(false)} style={{ marginRight: 8 }}>Hủy</Button>
              <Button type="primary" onClick={() => goalForm.submit()}>Lưu mục tiêu</Button>
            </div>
          }
        >
          <Form form={goalForm} layout="vertical" onFinish={(v) => {
            setGoals([{
              ...v, 
              id: Date.now().toString(), 
              currentValue: 0, 
              status: 'Đang thực hiện', 
              deadline: v.deadline.format('YYYY-MM-DD')
            }, ...goals]);
            setIsGoalDrawer(false);
          }}>
            <Form.Item name="name" label="Tên mục tiêu" rules={[{required: true, message: 'Vui lòng nhập tên!'}]}><Input /></Form.Item>
            <Form.Item name="type" label="Loại" initialValue="Khác"><Select options={['Giảm cân', 'Tăng cơ', 'Sức bền', 'Khác'].map(v => ({label:v, value:v}))} /></Form.Item>
            <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{required: true}]}><InputNumber style={{width:'100%'}} /></Form.Item>
            <Form.Item name="deadline" label="Hạn chót" rules={[{required: true}]}><DatePicker style={{width:'100%'}} /></Form.Item>
          </Form>
        </Drawer>

        <Modal visible={isDetailModal.visible} title={isDetailModal.data?.name} onCancel={() => setIsDetailModal({visible: false, data: null})} footer={null}>
          <p><strong>Nhóm cơ:</strong> {isDetailModal.data?.muscle}</p>
          <Divider orientation="left">Hướng dẫn</Divider>
          <p>{isDetailModal.data?.fullGuide}</p>
        </Modal>
      </Layout>
    </Layout>
  );
};

export default FitnessApp;