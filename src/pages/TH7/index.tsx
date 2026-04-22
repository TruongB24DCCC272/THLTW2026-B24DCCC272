import React, { useState, useMemo, useEffect } from 'react';
import {
  Layout, Menu, Table, Button, Space, Input, Select,
  Tag, Popconfirm, Modal, Form, Card, Row,
  Col, Pagination, Typography, Divider, Avatar
} from 'antd';
import {
  BrowserRouter, Switch, Route, Link,
  useParams, useHistory, Redirect
} from 'react-router-dom';
import {
  GithubOutlined, FacebookOutlined, LinkedinOutlined,
  ArrowLeftOutlined, EditOutlined, DeleteOutlined, UserOutlined
} from '@ant-design/icons';
import { debounce } from 'lodash';
import ReactMarkdown from "react-markdown";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  author: string;
  tags: string[];
  status: 'Draft' | 'Published';
  viewCount: number;
}


const rawData: Post[] = [...Array(12)].map((_, i) => {
  const id = i + 1;
  return {
    id: `${id}`,
    title: `Bài viết số ${id}`,
    slug: `bai-viet-${id}`,
    summary: 'Tóm tắt nội dung bài viết hiển thị ở trang chủ để người dùng dễ theo dõi.',
    content: `# Nội dung bài ${id}\nViết nội dung bằng Markdown ở đây...`,
    thumbnail: `https://picsum.photos/id/${id + 20}/400/250`,
    createdAt: '2026-04-22',
    author: 'Admin',
    tags: i % 2 === 0 ? ['React'] : ['Web'],
    status: 'Published',
    viewCount: i * 5
  };
});

const HomePage = ({ posts }: { posts: Post[] }) => {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [currPage, setCurrPage] = useState(1);
  const history = useHistory();
  
  const doSearch = useMemo(() => debounce(setQuery, 300), []);
  useEffect(() => () => doSearch.cancel(), [doSearch]);

  const filteredPosts = posts.filter(p => {
    const isLive = p.status === 'Published';
    const hasText = p.title.toLowerCase().includes(query.toLowerCase());
    const hasTag = !tag || p.tags.includes(tag);
    return isLive && hasText && hasTag;
  });

  const list = filteredPosts.slice((currPage - 1) * 9, currPage * 9);
  const options = Array.from(new Set(posts.flatMap(p => p.tags))).map(t => ({ value: t, label: t }));

  return (
    <>
      <Space style={{ marginBottom: 24, paddingTop: 8 }}>
        <Input.Search placeholder="Tìm kiếm bài viết..." onChange={e => doSearch(e.target.value)} style={{ width: 250 }} />
        <Select allowClear placeholder="Lọc theo tag" options={options} onChange={setTag} style={{ width: 150 }} />
      </Space>

      <Row gutter={[16, 24]}>
        {list.map(p => (
          <Col span={8} key={p.id}>
            <Card
              hoverable
              cover={<img src={p.thumbnail} alt="thumb" />}
              onClick={() => history.push(`/post/${p.slug}`)}
            >
              <Title level={5}>{p.title}</Title>
              <Paragraph ellipsis={{ rows: 2 }}>{p.summary}</Paragraph>
              <div style={{ marginBottom: 12 }}>
                {p.tags.map(t => <Tag key={t} color="blue">{t}</Tag>)}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>{p.author} — {p.createdAt}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        style={{ marginTop: 30, textAlign: 'center' }}
        current={currPage}
        total={filteredPosts.length}
        pageSize={9}
        onChange={setCurrPage}
        hideOnSinglePage
      />
    </>
  );
};

const DetailPage = ({ posts, setPosts }: any) => {
  const { slug } = useParams<{ slug: string }>();
  const history = useHistory();
  const item = posts.find((p: Post) => p.slug === slug);

  useEffect(() => {
    if (item) {
      setPosts((prev: Post[]) => prev.map(p => p.slug === slug ? { ...p, viewCount: p.viewCount + 1 } : p));
    }
  }, [slug]);

  if (!item) return <div style={{ textAlign: 'center', marginTop: 50 }}>404 - Không tìm thấy bài viết</div>;

  const relate = posts.filter((p: Post) => p.id !== item.id && p.tags.some(t => item.tags.includes(t)));

  return (
    <div>
      <Button icon={<ArrowLeftOutlined />} onClick={() => history.push('/')} style={{ marginBottom: 20 }}>Quay lại</Button>
      <Title>{item.title}</Title>
      <Space split={<Divider type="vertical" />}>
        <Text type="secondary">Tác giả: {item.author}</Text>
        <Text type="secondary">Ngày đăng: {item.createdAt}</Text>
        <Text strong>Lượt xem: {item.viewCount}</Text>
      </Space>
      <div style={{ marginTop: 10 }}>{item.tags.map(t => <Tag key={t} color="volcano">{t}</Tag>)}</div>
      <Divider />
      <article style={{ minHeight: 300 }}><ReactMarkdown>{item.content}</ReactMarkdown></article>
      <Divider>Bài viết liên quan</Divider>
      <Row gutter={16}>
        {relate.slice(0, 3).map(r => (
          <Col span={8} key={r.id}>
            <Card size="small" hoverable onClick={() => history.push(`/post/${r.slug}`)}>{r.title}</Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const AboutPage = () => (
  <div style={{ textAlign: 'center', padding: '40px 0' }}>
    <Avatar size={120} icon={<UserOutlined />} style={{ marginBottom: 20 }} />
    <Title level={2}>Phùng Khắc Trường</Title>
    <Paragraph>Sinh viên CNTT - Học viện Công nghệ Bưu chính Viễn thông (PTIT)</Paragraph>
    <Paragraph style={{ maxWidth: 500, margin: '0 auto' }}>Thích làm Web, tìm hiểu ReactJS và DevOps.</Paragraph>
    <Space size="large" style={{ fontSize: 22, marginTop: 20 }}>
      <Link to="#"><GithubOutlined /></Link>
      <Link to="#"><FacebookOutlined /></Link>
      <Link to="#"><LinkedinOutlined /></Link>
    </Space>
  </div>
);

const AdminPosts = ({ posts, setPosts }: any) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editObj, setEditObj] = useState<Post | null>(null);

  const onSave = (values: any) => {
    if (editObj) {
      setPosts(posts.map((p: any) => p.id === editObj.id ? { ...p, ...values } : p));
    } else {
      const newPost = { ...values, id: Date.now().toString(), viewCount: 0, createdAt: new Date().toISOString().split('T')[0], author: 'Admin' };
      setPosts([newPost, ...posts]);
    }
    setOpen(false);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <Title level={4}>Danh sách bài viết</Title>
        <Button type="primary" onClick={() => { setEditObj(null); form.resetFields(); setOpen(true); }}>Thêm bài mới</Button>
      </div>
      <Table dataSource={posts} rowKey="id" pagination={{ pageSize: 5 }}>
        <Table.Column title="Tiêu đề" dataIndex="title" />
        <Table.Column title="Trạng thái" dataIndex="status" render={val => (
            <Tag color={val === 'Published' ? 'green' : 'orange'}>
                {val === 'Published' ? 'Đã đăng' : 'Nháp'}
            </Tag>
        )} />
        <Table.Column title="Lượt xem" dataIndex="viewCount" />
        <Table.Column title="Hành động" render={(_, row: Post) => (
          <Space>
            <Button size="small" icon={<EditOutlined />} onClick={() => { setEditObj(row); form.setFieldsValue(row); setOpen(true); }} />
            <Popconfirm title="Bạn có chắc muốn xóa bài này?" onConfirm={() => setPosts(posts.filter((p: any) => p.id !== row.id))}>
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        )} />
      </Table>
      <Modal title={editObj ? "Cập nhật bài viết" : "Tạo bài viết mới"} visible={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Đường dẫn (Slug)" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="Published">
            <Select>
              <Select.Option value="Draft">Nháp</Select.Option>
              <Select.Option value="Published">Công khai</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="tags" label="Thẻ bài viết"><Select mode="tags" /></Form.Item>
          <Form.Item name="content" label="Nội dung (Markdown)"><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </>
  );
};

const AdminTags = ({ posts, setPosts }: any) => {
  const data = useMemo(() => {
    const res: any = {};
    posts.forEach((p: Post) => p.tags.forEach(t => res[t] = (res[t] || 0) + 1));
    return Object.keys(res).map(name => ({ name, count: res[name] }));
  }, [posts]);

  return (
    <>
      <Title level={4}>Danh sách thẻ</Title>
      <Table dataSource={data} rowKey="name">
        <Table.Column title="Tên thẻ" dataIndex="name" />
        <Table.Column title="Số bài viết" dataIndex="count" />
        <Table.Column title="Thao tác" render={(_, row: any) => (
          <Button danger size="small" onClick={() => setPosts(posts.map((p: Post) => ({ ...p, tags: p.tags.filter(t => t !== row.name) })))}>Gỡ thẻ</Button>
        )} />
      </Table>
    </>
  );
};

export default function App() {
  const [data, setData] = useState<Post[]>(rawData);

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ width: '100%', zIndex: 10 }}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['home']}>
            <Menu.Item key="home"><Link to="/">Trang chủ</Link></Menu.Item>
            <Menu.Item key="about"><Link to="/about">Giới thiệu</Link></Menu.Item>
            <Menu.Item key="admin"><Link to="/admin">Quản lý bài viết</Link></Menu.Item>
            <Menu.Item key="tags"><Link to="/tags">Quản lý thẻ</Link></Menu.Item>
          </Menu>
        </Header>

        <Content style={{ padding: '24px 50px', background: '#f0f2f5' }}>
          <div style={{ background: '#fff', padding: 24, minHeight: '80vh', borderRadius: 8 }}>
            <Switch>
              <Route exact path="/" render={() => <HomePage posts={data} />} />
              <Route path="/post/:slug" render={() => <DetailPage posts={data} setPosts={setData} />} />
              <Route path="/about" component={AboutPage} />
              <Route path="/admin" render={() => <AdminPosts posts={data} setPosts={setData} />} />
              <Route path="/tags" render={() => <AdminTags posts={data} setPosts={setData} />} />
              <Redirect to="/" />
            </Switch>
          </div>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}