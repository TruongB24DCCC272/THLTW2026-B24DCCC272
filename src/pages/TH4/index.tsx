import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Table,
  Tabs,
  Typography,
} from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { TabPane } = Tabs;

type FieldType = 'string' | 'number' | 'date';

type FormField = {
  id: string;
  name: string;
  type: FieldType;
};

type Book = {
  id: string;
  year: number;
  bookNo: number;
  currentSerie: number;
};

type Decision = {
  id: string;
  decisionNo: string;
  issueDate: string;
  summary: string;
  bookId: string;
};

type Diploma = {
  id: string;
  bookId: string;
  decisionId: string;
  bookSeries: number;
  diplomaNo: string;
  studentId: string;
  fullName: string;
  dob: string;
  extra: Record<string, any>;
};

const makeId = () => Date.now().toString();

export default function TH4() {
  const [books, setBooks] = useState<Book[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [diplomas, setDiplomas] = useState<Diploma[]>([]);
  const [searchResults, setSearchResults] = useState<Diploma[]>([]);

  const [editingField, setEditingField] = useState<FormField | null>(null);

  const [formBook] = Form.useForm();
  const [formDecision] = Form.useForm();
  const [formField] = Form.useForm();
  const [formDiploma] = Form.useForm();
  const [formSearch] = Form.useForm();

  /* ================= OPTIONS ================= */
  const bookOptions = useMemo(
    () =>
      books.map(b => ({
        label: `Năm ${b.year} - Sổ ${b.bookNo}`,
        value: b.id,
      })),
    [books]
  );

  const decisionOptions = useMemo(
    () =>
      decisions.map(d => ({
        label: `${d.decisionNo} - ${d.summary}`,
        value: d.id,
      })),
    [decisions]
  );

  /* ================= BOOK ================= */
  const addBook = (values: any) => {
    if (!values.year) return;

    if (books.find(b => b.year === values.year)) {
      message.error('Sổ đã tồn tại');
      return;
    }

    setBooks(prev => [
      ...prev,
      {
        id: makeId(),
        year: values.year,
        bookNo: prev.length + 1,
        currentSerie: 1,
      },
    ]);

    formBook.resetFields();
    message.success('Thêm sổ thành công');
  };

  /* ================= DECISION ================= */
  const addDecision = (values: any) => {
    const book = books.find(b => b.id === values.bookId);
    if (!book) return message.error('Chọn sổ');

    setDecisions(prev => [
      ...prev,
      {
        id: makeId(),
        decisionNo: values.decisionNo,
        issueDate: values.issueDate
          ? values.issueDate.format('YYYY-MM-DD')
          : '',
        summary: values.summary,
        bookId: book.id,
      },
    ]);

    formDecision.resetFields();
    message.success('Thêm quyết định thành công');
  };

  /* ================= FIELD ================= */
  const saveField = (values: any) => {
    const dup = formFields.find(
      f =>
        f.name.toLowerCase() === values.name.toLowerCase() &&
        f.id !== editingField?.id
    );

    if (dup) return message.error('Trường đã tồn tại');

    if (editingField) {
      setFormFields(prev =>
        prev.map(f =>
          f.id === editingField.id ? { ...f, ...values } : f
        )
      );
    } else {
      setFormFields(prev => [
        ...prev,
        { id: makeId(), ...values },
      ]);
    }

    setEditingField(null);
    formField.resetFields();
    message.success('Lưu thành công');
  };

  const openEditField = (f: FormField) => {
    setEditingField(f);
    formField.setFieldsValue(f);
  };

  const removeField = (id: string) => {
    setFormFields(prev => prev.filter(f => f.id !== id));
    message.success('Đã xóa trường');
  };

  /* ================= DIPLOMA ================= */
  const addDiploma = (values: any) => {
    const book = books.find(b => b.id === values.bookId);
    const decision = decisions.find(d => d.id === values.decisionId);
    if (!book || !decision) return;

    const newItem: Diploma = {
      id: makeId(),
      bookId: book.id,
      decisionId: decision.id,
      bookSeries: book.currentSerie,
      diplomaNo: `VB-${book.year}-${book.currentSerie}`,
      studentId: values.studentId || '',
      fullName: values.fullName || '',
      dob: values.dob ? values.dob.format('YYYY-MM-DD') : '',
      extra: {},
    };

    formFields.forEach(f => {
      const v = values?.[f.id];

      if (f.type === 'date') {
        newItem.extra[f.name] = v ? v.format('YYYY-MM-DD') : '';
      } else {
        newItem.extra[f.name] = v ?? '';
      }
    });

    setDiplomas(prev => [...prev, newItem]);

    setBooks(prev =>
      prev.map(b =>
        b.id === book.id
          ? { ...b, currentSerie: b.currentSerie + 1 }
          : b
      )
    );

    message.success('Thêm văn bằng thành công');
    formDiploma.resetFields();
  };

  /* ================= SEARCH ================= */
  const performSearch = (values: any) => {
    const result = diplomas.filter(d => {
      let ok = true;

      if (values.diplomaNo)
        ok = ok && d.diplomaNo.includes(values.diplomaNo);

      if (values.studentId)
        ok = ok && d.studentId.includes(values.studentId);

      if (values.fullName)
        ok =
          ok &&
          d.fullName
            .toLowerCase()
            .includes(values.fullName.toLowerCase());

      if (values.bookSeries)
        ok = ok && d.bookSeries === Number(values.bookSeries);

      return ok;
    });

    setSearchResults(result);

    if (!result.length) message.info('Không tìm thấy');
  };

  /* ================= UI ================= */
  return (
    <div style={{ padding: 16 }}>
      <Title level={3}>TH4 - Quản lý văn bằng</Title>

      <Tabs>

        {/* BOOK */}
        <TabPane tab="Sổ văn bằng" key="1">
          <Card title="Thêm sổ">
            <Form form={formBook} onFinish={addBook} layout="vertical">
              <Form.Item
                label="Năm văn bằng"
                name="year"
                rules={[{ required: true }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="VD: 2024"
                />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Thêm sổ
              </Button>
            </Form>
          </Card>
        </TabPane>

        {/* DECISION */}
        <TabPane tab="Quyết định" key="2">
          <Card title="Thêm quyết định">
            <Form form={formDecision} onFinish={addDecision} layout="vertical">

              <Form.Item label="Số quyết định" name="decisionNo">
                <Input placeholder="VD: QD-001" />
              </Form.Item>

              <Form.Item label="Ngày ban hành" name="issueDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="Trích yếu" name="summary">
                <Input.TextArea />
              </Form.Item>

              <Form.Item label="Sổ văn bằng" name="bookId">
                <Select options={bookOptions} />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form>
          </Card>
        </TabPane>

        {/* FIELD */}
        <TabPane tab="Biểu mẫu" key="3">
          <Card title="Cấu hình trường">

            <Form form={formField} onFinish={saveField} layout="vertical">

              <Form.Item label="Tên trường" name="name">
                <Input placeholder="VD: Điểm trung bình" />
              </Form.Item>

              <Form.Item label="Kiểu dữ liệu" name="type" initialValue="string">
                <Select>
                  <Select.Option value="string">String</Select.Option>
                  <Select.Option value="number">Number</Select.Option>
                  <Select.Option value="date">Date</Select.Option>
                </Select>
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form>

          </Card>
        </TabPane>

        {/* DIPLOMA */}
        <TabPane tab="Văn bằng" key="4">
          <Card title="Thêm văn bằng">
            <Form form={formDiploma} onFinish={addDiploma} layout="vertical">

              <Form.Item label="Sổ" name="bookId">
                <Select options={bookOptions} />
              </Form.Item>

              <Form.Item label="Quyết định" name="decisionId">
                <Select options={decisionOptions} />
              </Form.Item>

              <Form.Item label="MSV" name="studentId">
                <Input />
              </Form.Item>

              <Form.Item label="Họ tên" name="fullName">
                <Input />
              </Form.Item>

              <Form.Item label="Ngày sinh" name="dob">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form>
          </Card>
        </TabPane>

        {/* SEARCH */}
        <TabPane tab="Tra cứu" key="5">
          <Card title="Tìm kiếm văn bằng">

            <Form form={formSearch} onFinish={performSearch} layout="vertical">

              <Form.Item label="Số VB" name="diplomaNo">
                <Input />
              </Form.Item>

              <Form.Item label="MSV" name="studentId">
                <Input />
              </Form.Item>

              <Form.Item label="Họ tên" name="fullName">
                <Input />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Tìm kiếm
              </Button>

            </Form>

            <Table
              style={{ marginTop: 16 }}
              rowKey="id"
              dataSource={searchResults}
              columns={[
                { title: 'Số VB', dataIndex: 'diplomaNo' },
                { title: 'MSV', dataIndex: 'studentId' },
                { title: 'Họ tên', dataIndex: 'fullName' },
                { title: 'Ngày sinh', dataIndex: 'dob' },
              ]}
            />

          </Card>
        </TabPane>

      </Tabs>
    </div>
  );
}