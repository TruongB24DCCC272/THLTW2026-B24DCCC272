import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Button,
  Table,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Space,
  message,
  Popconfirm,
  Tag,
  Alert,
  Row,
  Col,
  Checkbox,
} from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function TH4() {
  const [ledgerForm] = Form.useForm();
  const [decisionForm] = Form.useForm();
  const [certificateForm] = Form.useForm();
  const [formFieldForm] = Form.useForm();
  const [ledgers, setLedgers] = useState([]);
  const [isVisibleLedger, setIsVisibleLedger] = useState(false);
  const [isEditingLedger, setIsEditingLedger] = useState(false);
  const [editingLedgerId, setEditingLedgerId] = useState(null);

  // Quyết định tốt nghiệp
  const [decisions, setDecisions] = useState([]);
  const [isVisibleDecision, setIsVisibleDecision] = useState(false);
  const [isEditingDecision, setIsEditingDecision] = useState(false);
  const [editingDecisionId, setEditingDecisionId] = useState(null);

  // Thông tin văn bằng
  const [certificates, setCertificates] = useState([]);
  const [isVisibleCertificate, setIsVisibleCertificate] = useState(false);
  const [isEditingCertificate, setIsEditingCertificate] = useState(false);
  const [editingCertificateId, setEditingCertificateId] = useState(null);

  // Cấu hình biểu mẫu
  const [formFields, setFormFields] = useState([]);
  const [isVisibleFormConfig, setIsVisibleFormConfig] = useState(false);
  const [isEditingField, setIsEditingField] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState(null);

  // Tra cứu
  const [lookupParams, setLookupParams] = useState({});
  const [lookupResults, setLookupResults] = useState([]);

  const handleAddLedger = () => {
    setIsEditingLedger(false);
    setEditingLedgerId(null);
    setIsVisibleLedger(true);
    setTimeout(() => ledgerForm.resetFields(), 0);
  };

  const handleEditLedger = (record) => {
    setIsEditingLedger(true);
    setEditingLedgerId(record.id);
    ledgerForm.setFieldsValue(record);
    setIsVisibleLedger(true);
  };

  const handleDeleteLedger = (id) => {
    const newLedgers = ledgers.filter((l) => l.id !== id);
    setLedgers(newLedgers);
    message.success('Xóa sổ văn bằng thành công');
  };

  const handleSaveLedger = async () => {
    try {
      const values = await ledgerForm.validateFields();
      
      if (isEditingLedger) {
        // Update
        const updatedLedger = ledgers.find(l => l.id === editingLedgerId);
        if (updatedLedger) {
          setLedgers(
            ledgers.map((l) =>
              l.id === editingLedgerId
                ? { ...updatedLedger, year: values.year, maxNumber: values.maxNumber || 1000, status: values.status || 'active' }
                : l,
            ),
          );
          message.success('Cập nhật sổ văn bằng thành công');
        }
      } else {
        // Add new
        const newLedger = {
          id: Date.now().toString(),
          year: values.year,
          maxNumber: values.maxNumber || 1000,
          status: values.status || 'active',
        };
        setLedgers([...ledgers, newLedger]);
        message.success('Thêm sổ văn bằng thành công');
      }

      setIsVisibleLedger(false);
      setEditingLedgerId(null);
      ledgerForm.resetFields();
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleAddDecision = () => {
    setIsEditingDecision(false);
    setEditingDecisionId(null);
    setIsVisibleDecision(true);
    setTimeout(() => decisionForm.resetFields(), 0);
  };

  const handleEditDecision = (record) => {
    setIsEditingDecision(true);
    setEditingDecisionId(record.id);
    decisionForm.setFieldsValue({
      ...record,
      issuanceDate: dayjs(record.issuanceDate),
    });
    setIsVisibleDecision(true);
  };

  const handleDeleteDecision = (id) => {
    const newDecisions = decisions.filter((d) => d.id !== id);
    setDecisions(newDecisions);
    message.success('Xóa quyết định thành công');
  };

  const handleSaveDecision = async () => {
    try {
      const values = await decisionForm.validateFields();

      if (isEditingDecision) {
        // Update
        const updatedDecision = decisions.find(d => d.id === editingDecisionId);
        if (updatedDecision) {
          setDecisions(
            decisions.map((d) =>
              d.id === editingDecisionId
                ? {
                    ...updatedDecision,
                    decisionNumber: values.decisionNumber,
                    issuanceDate: values.issuanceDate.toISOString(),
                    summary: values.summary,
                    ledgerId: values.ledgerId,
                  }
                : d,
            ),
          );
          message.success('Cập nhật quyết định thành công');
        }
      } else {
        // Add new
        const newDecision = {
          id: Date.now().toString(),
          decisionNumber: values.decisionNumber,
          issuanceDate: values.issuanceDate.toISOString(),
          summary: values.summary,
          ledgerId: values.ledgerId,
        };
        setDecisions([...decisions, newDecision]);
        message.success('Thêm quyết định thành công');
      }

      setIsVisibleDecision(false);
      setEditingDecisionId(null);
      decisionForm.resetFields();
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleAddCertificate = () => {
    setIsEditingCertificate(false);
    setEditingCertificateId(null);
    setIsVisibleCertificate(true);
    setTimeout(() => certificateForm.resetFields(), 0);
  };

  const handleEditCertificate = (record) => {
    setIsEditingCertificate(true);
    setEditingCertificateId(record.id);
    const customFieldsObj = { dateOfBirth: dayjs(record.dateOfBirth) };
    Object.entries(record.customFields || {}).forEach(([key, value]) => {
      const field = formFields.find(f => f.id === key);
      if (field?.dataType === 'Date') {
        customFieldsObj[`field_${key}`] = dayjs(value);
      } else {
        customFieldsObj[`field_${key}`] = value;
      }
    });
    certificateForm.setFieldsValue({
      ...record,
      ...customFieldsObj,
    });
    setIsVisibleCertificate(true);
  };

  const handleDeleteCertificate = (id) => {
    const newCertificates = certificates.filter((c) => c.id !== id);
    setCertificates(newCertificates);
    message.success('Xóa văn bằng thành công');
  };



  const handleSaveCertificate = async () => {
    try {
      const values = await certificateForm.validateFields();

      const customFields = {};
      formFields.forEach((field) => {
        if (values[`field_${field.id}`] !== undefined && values[`field_${field.id}`] !== null) {
          customFields[field.id] = values[`field_${field.id}`];
        }
      });

      if (isEditingCertificate) {
        // Update
        const updatedCert = certificates.find(c => c.id === editingCertificateId);
        if (updatedCert) {
          setCertificates(
            certificates.map((c) =>
              c.id === editingCertificateId
                ? {
                    ...updatedCert,
                    certificateNumber: values.certificateNumber,
                    studentId: values.studentId,
                    fullName: values.fullName,
                    dateOfBirth: values.dateOfBirth.toISOString(),
                    decisionId: values.decisionId,
                    ledgerId: values.ledgerId,
                    customFields,
                  }
                : c,
            ),
          );
          message.success('Cập nhật thông tin văn bằng thành công');
        }
      } else {
        // Add new
        const newCertificate = {
          id: Date.now().toString(),
          sequenceNumber: '001',
          certificateNumber: values.certificateNumber,
          studentId: values.studentId,
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth.toISOString(),
          decisionId: values.decisionId,
          ledgerId: values.ledgerId,
          customFields,
        };
        setCertificates([...certificates, newCertificate]);
        setDecisions(
          decisions.map((d) =>
            d.id === values.decisionId
              ? { ...d, totalCertificates: d.totalCertificates + 1 }
              : d,
          ),
        );
        message.success('Thêm thông tin văn bằng thành công');
      }

      setIsVisibleCertificate(false);
      setEditingCertificateId(null);
      certificateForm.resetFields();
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleAddFormField = () => {
    setIsEditingField(false);
    setEditingFieldId(null);
    setIsVisibleFormConfig(true);
    setTimeout(() => formFieldForm.resetFields(), 0);
  };

  const handleEditFormField = (record) => {
    setIsEditingField(true);
    setEditingFieldId(record.id);
    formFieldForm.setFieldsValue(record);
    setIsVisibleFormConfig(true);
  };

  const handleDeleteFormField = (id) => {
    const newFields = formFields.filter((f) => f.id !== id);
    setFormFields(newFields);
    message.success('Xóa trường thông tin thành công');
  };

  const handleSaveFormField = async () => {
    try {
      const values = await formFieldForm.validateFields();

      if (isEditingField) {
        // Update
        const updatedField = formFields.find(f => f.id === editingFieldId);
        if (updatedField) {
          setFormFields(
            formFields.map((f) =>
              f.id === editingFieldId
                ? { ...updatedField, name: values.name, dataType: values.dataType, required: values.required || false }
                : f,
            ),
          );
          message.success('Cập nhật trường thông tin thành công');
        }
      } else {
        // Add new
        const newField = {
          id: Date.now().toString(),
          name: values.name,
          dataType: values.dataType,
          required: values.required || false,
        };
        setFormFields([...formFields, newField]);
        message.success('Thêm trường thông tin thành công');
      }

      setIsVisibleFormConfig(false);
      setEditingFieldId(null);
      formFieldForm.resetFields();
    } catch (error) {
      message.error('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleLookup = () => {
    const paramCount = Object.values(lookupParams).filter((v) => v).length;

    if (paramCount < 2) {
      message.warning('Vui lòng nhập ít nhất 2 tham số tìm kiếm');
      return;
    }

    const results = certificates.filter((cert) => {
      return (
        (!lookupParams.certificateNumber || cert.certificateNumber.includes(lookupParams.certificateNumber)) &&
        (!lookupParams.sequenceNumber || cert.sequenceNumber.includes(lookupParams.sequenceNumber)) &&
        (!lookupParams.studentId || cert.studentId.includes(lookupParams.studentId)) &&
        (!lookupParams.fullName || cert.fullName.toLowerCase().includes(lookupParams.fullName.toLowerCase())) &&
        (!lookupParams.dateOfBirth || cert.dateOfBirth.includes(lookupParams.dateOfBirth))
      );
    });

    setLookupResults(results);

    if (results.length === 0) {
      message.info('Không tìm thấy kết quả');
    } else {
      message.success(`Tìm thấy ${results.length} kết quả`);
    }
  };

  const ledgerColumns = [
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Số tối đa',
      dataIndex: 'maxNumber',
      key: 'maxNumber',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditLedger(record)}>
            Sửa
          </Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDeleteLedger(record.id)}>
            <Button type="danger" size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const decisionColumns = [
    {
      title: 'Số QĐ',
      dataIndex: 'decisionNumber',
      key: 'decisionNumber',
      width: 120,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'issuanceDate',
      key: 'issuanceDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      width: 120,
    },
    {
      title: 'Trích yếu',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: 'Số văn bằng',
      dataIndex: 'totalCertificates',
      key: 'totalCertificates',
      width: 80,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditDecision(record)}>
            Sửa
          </Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDeleteDecision(record.id)}>
            <Button type="danger" size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const certificateColumns = [
    {
      title: 'Số vào sổ',
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      width: 80,
    },
    {
      title: 'Số hiệu văn bằng',
      dataIndex: 'certificateNumber',
      key: 'certificateNumber',
      width: 120,
    },
    {
      title: 'MSV',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 100,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      width: 100,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              Modal.info({
                title: 'Chi tiết văn bằng',
                width: 700,
                content: (
                  <div>
                    <p><strong>Số vào sổ:</strong> {record.sequenceNumber}</p>
                    <p><strong>Số hiệu văn bằng:</strong> {record.certificateNumber}</p>
                    <p><strong>MSV:</strong> {record.studentId}</p>
                    <p><strong>Họ tên:</strong> {record.fullName}</p>
                    <p><strong>Ngày sinh:</strong> {dayjs(record.dateOfBirth).format('DD/MM/YYYY')}</p>
                    {Object.keys(record.customFields).length > 0 && (
                      <div>
                        <h4>Thông tin bổ sung:</h4>
                        {Object.entries(record.customFields).map(([fieldId, value]) => {
                          const field = formFields.find((f) => f.id === fieldId);
                          return (
                            <p key={fieldId}>
                              <strong>{field?.name}:</strong> {String(value)}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ),
              });
            }}
          >
            Xem
          </Button>
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditCertificate(record)}>
            Sửa
          </Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDeleteCertificate(record.id)}>
            <Button type="danger" size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const fieldColumns = [
    {
      title: 'Tên trường',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 100,
    },
    {
      title: 'Bắt buộc',
      dataIndex: 'required',
      key: 'required',
      render: (required) => (required ? 'Có' : 'Không'),
      width: 80,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" size="small" icon={<EditOutlined />} onClick={() => handleEditFormField(record)}>
            Sửa
          </Button>
          <Popconfirm title="Bạn chắc chắn muốn xóa?" onConfirm={() => handleDeleteFormField(record.id)}>
            <Button type="danger" size="small" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Hệ thống quản lý và tra cứu thông tin văn bằng tốt nghiệp" bordered={false}>
        <Tabs>
          <Tabs.TabPane tab="Sổ văn bằng" key="1">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddLedger} style={{ marginBottom: 16 }}>
              Thêm sổ văn bằng
            </Button>
            <Table dataSource={ledgers} columns={ledgerColumns} rowKey="id" bordered pagination={{ pageSize: 10 }} />

            <Modal
              title={isEditingLedger ? 'Cập nhật sổ văn bằng' : 'Thêm sổ văn bằng'}
              visible={isVisibleLedger}
              onOk={handleSaveLedger}
              onCancel={() => setIsVisibleLedger(false)}
            >
              <Form form={ledgerForm} layout="vertical">
                <Form.Item label="Năm" name="year" rules={[{ required: true, message: 'Vui lòng nhập năm' }]}>
                  <InputNumber min={2000} max={2099} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Số tối đa" name="maxNumber">
                  <InputNumber min={1} defaultValue={1000} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                  <Select>
                    <Select.Option value="active">Hoạt động</Select.Option>
                    <Select.Option value="inactive">Không hoạt động</Select.Option>
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Quyết định tốt nghiệp" key="2">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddDecision} style={{ marginBottom: 16 }}>
              Thêm quyết định
            </Button>
            <Table dataSource={decisions} columns={decisionColumns} rowKey="id" bordered scroll={{ x: 1200 }} pagination={{ pageSize: 10 }} />

            <Modal
              title={isEditingDecision ? 'Cập nhật quyết định' : 'Thêm quyết định'}
              visible={isVisibleDecision}
              onOk={handleSaveDecision}
              onCancel={() => setIsVisibleDecision(false)}
            >
              <Form form={decisionForm} layout="vertical">
                <Form.Item label="Số QĐ" name="decisionNumber" rules={[{ required: true, message: 'Vui lòng nhập số QĐ' }]}>
                  <Input placeholder="VD: QĐ/2024/001" />
                </Form.Item>
                <Form.Item label="Ngày ban hành" name="issuanceDate" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Trích yếu" name="summary" rules={[{ required: true, message: 'Vui lòng nhập trích yếu' }]}>
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="Sổ văn bằng" name="ledgerId" rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}>
                  <Select placeholder="Chọn sổ văn bằng">
                    {ledgers.map((ledger) => (
                      <Select.Option key={ledger.id} value={ledger.id}>
                        Năm {ledger.year}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Thông tin văn bằng" key="3">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCertificate} style={{ marginBottom: 16 }}>
              Thêm thông tin văn bằng
            </Button>
            <Table dataSource={certificates} columns={certificateColumns} rowKey="id" bordered scroll={{ x: 1200 }} pagination={{ pageSize: 10 }} />

            <Modal
              title={isEditingCertificate ? 'Cập nhật thông tin văn bằng' : 'Thêm thông tin văn bằng'}
              visible={isVisibleCertificate}
              onOk={handleSaveCertificate}
              onCancel={() => setIsVisibleCertificate(false)}
              width={700}
            >
              <Form form={certificateForm} layout="vertical">
                <Form.Item label="Số hiệu văn bằng" name="certificateNumber" rules={[{ required: true, message: 'Vui lòng nhập số hiệu văn bằng' }]}>
                  <Input placeholder="VD: 001-2024-001" />
                </Form.Item>
                <Form.Item label="MSV" name="studentId" rules={[{ required: true, message: 'Vui lòng nhập MSV' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
                  <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Quyết định tốt nghiệp" name="decisionId" rules={[{ required: true, message: 'Vui lòng chọn quyết định' }]}>
                  <Select placeholder="Chọn quyết định">
                    {decisions.map((decision) => (
                      <Select.Option key={decision.id} value={decision.id}>
                        {decision.decisionNumber} ({dayjs(decision.issuanceDate).format('DD/MM/YYYY')})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Sổ văn bằng" name="ledgerId" rules={[{ required: true, message: 'Vui lòng chọn sổ văn bằng' }]}>
                  <Select placeholder="Chọn sổ văn bằng">
                    {ledgers.map((ledger) => (
                      <Select.Option key={ledger.id} value={ledger.id}>
                        Năm {ledger.year}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {formFields.map((field) => (
                  <Form.Item
                    key={field.id}
                    label={field.name}
                    name={`field_${field.id}`}
                    rules={field.required ? [{ required: true, message: `Vui lòng nhập ${field.name}` }] : []}
                  >
                    {field.dataType === 'String' && <Input />}
                    {field.dataType === 'Number' && <InputNumber style={{ width: '100%' }} />}
                    {field.dataType === 'Date' && <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />}
                  </Form.Item>
                ))}
              </Form>
            </Modal>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Cấu hình biểu mẫu" key="4">
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFormField} style={{ marginBottom: 16 }}>
              Thêm trường thông tin
            </Button>
            <Table dataSource={formFields} columns={fieldColumns} rowKey="id" bordered pagination={{ pageSize: 10 }} />

            <Modal
              title={isEditingField ? 'Cập nhật trường thông tin' : 'Thêm trường thông tin'}
              visible={isVisibleFormConfig}
              onOk={handleSaveFormField}
              onCancel={() => setIsVisibleFormConfig(false)}
            >
              <Form form={formFieldForm} layout="vertical">
                <Form.Item label="Tên trường" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên trường' }]}>
                  <Input placeholder="VD: Dân tộc, Nơi sinh, Điểm trung bình" />
                </Form.Item>
                <Form.Item label="Kiểu dữ liệu" name="dataType" rules={[{ required: true, message: 'Vui lòng chọn kiểu dữ liệu' }]}>
                  <Select>
                    <Select.Option value="String">String (Văn bản)</Select.Option>
                    <Select.Option value="Number">Number (Số)</Select.Option>
                    <Select.Option value="Date">Date (Ngày)</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Bắt buộc" name="required" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              </Form>
            </Modal>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Tra cứu văn bằng" key="5">
            <Alert message="Vui lòng nhập ít nhất 2 tham số để tìm kiếm" type="info" style={{ marginBottom: 16 }} />
            <Card title="Tham số tìm kiếm" style={{ marginBottom: 16 }}>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                  <Input placeholder="Số hiệu văn bằng" value={lookupParams.certificateNumber || ''} onChange={(e) => setLookupParams({ ...lookupParams, certificateNumber: e.target.value })} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Input placeholder="Số vào sổ" value={lookupParams.sequenceNumber || ''} onChange={(e) => setLookupParams({ ...lookupParams, sequenceNumber: e.target.value })} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Input placeholder="MSV" value={lookupParams.studentId || ''} onChange={(e) => setLookupParams({ ...lookupParams, studentId: e.target.value })} />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                  <Input placeholder="Họ tên" value={lookupParams.fullName || ''} onChange={(e) => setLookupParams({ ...lookupParams, fullName: e.target.value })} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Input type="date" placeholder="Ngày sinh" value={lookupParams.dateOfBirth || ''} onChange={(e) => setLookupParams({ ...lookupParams, dateOfBirth: e.target.value })} />
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Button type="primary" block onClick={handleLookup}>
                    Tìm kiếm
                  </Button>
                </Col>
              </Row>
            </Card>

            {lookupResults.length > 0 && (
              <Card title={`Kết quả tìm kiếm (${lookupResults.length} kết quả)`}>
                <Table dataSource={lookupResults} columns={certificateColumns} rowKey="id" bordered scroll={{ x: 1200 }} pagination={{ pageSize: 10 }} />
              </Card>
            )}
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
