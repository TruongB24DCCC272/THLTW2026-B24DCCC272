import React, { useState } from "react";
import {
  Tabs,
  Card,
  Input,
  Button,
  List,
  Select,
  InputNumber,
  DatePicker,
  Space,
  Tag,
  message
} from "antd";

const { TabPane } = Tabs;
const { Option } = Select;

type Employee = {
  id: number;
  name: string;
  max: number;
  work: string;
};

type Service = {
  id: number;
  name: string;
  price: number;
  duration: number;
};

type Appointment = {
  id: number;
  customer: string;
  service: number;
  employee: number;
  date: string;
  time: string;
  status: string;
};

type Review = {
  id: number;
  appointmentId: number;
  rating: number;
  comment: string;
};

export default function AppointmentSystem(): JSX.Element {

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [emp, setEmp] = useState({ name: "", max: 5, work: "" });
  const [service, setService] = useState({ name: "", price: 0, duration: 30 });

  const [booking, setBooking] = useState({
    customer: "",
    service: 0,
    employee: 0,
    date: "",
    time: ""
  });

  const [review, setReview] = useState({
    appointmentId: 0,
    rating: 5,
    comment: ""
  });

  // ================= EMPLOYEE =================
  const addEmployee = () => {
    if (!emp.name) return message.error("Nhập tên nhân viên");

    setEmployees([
      ...employees,
      { id: Date.now(), ...emp }
    ]);

    setEmp({ name: "", max: 5, work: "" });
  };

  const deleteEmployee = (id: number) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  // ================= SERVICE =================
  const addService = () => {
    if (!service.name) return message.error("Nhập tên dịch vụ");

    setServices([
      ...services,
      { id: Date.now(), ...service }
    ]);

    setService({ name: "", price: 0, duration: 30 });
  };

  const deleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
  };

  // ================= BOOKING =================
  const book = () => {
    if (!booking.customer || !booking.service || !booking.employee || !booking.date || !booking.time) {
      return message.error("Nhập đầy đủ thông tin!");
    }

    const exist = appointments.find(
      a =>
        a.employee === booking.employee &&
        a.date === booking.date &&
        a.time === booking.time
    );

    if (exist) return message.error("Trùng lịch!");

    const countToday = appointments.filter(
      a => a.employee === booking.employee && a.date === booking.date
    ).length;

    const empInfo = employees.find(e => e.id === booking.employee);

    if (empInfo && countToday >= empInfo.max) {
      return message.error("Nhân viên đã đủ khách!");
    }

    setAppointments([
      ...appointments,
      {
        id: Date.now(),
        ...booking,
        status: "Chờ duyệt"
      }
    ]);

    message.success("Đặt lịch thành công");
  };

  const updateStatus = (id: number, status: string) => {
    setAppointments(
      appointments.map(a => a.id === id ? { ...a, status } : a)
    );
  };

  // ================= REVIEW =================
  const addReview = () => {
    if (!review.appointmentId) return message.error("Chọn lịch");

    setReviews([
      ...reviews,
      { id: Date.now(), ...review }
    ]);

    message.success("Đã gửi đánh giá");
  };

  const avgRating = (empId: number) => {
    const empReviews = reviews.filter(r => {
      const ap = appointments.find(a => a.id === r.appointmentId);
      return ap && ap.employee === empId;
    });

    if (!empReviews.length) return 0;

    return (
      empReviews.reduce((sum, r) => sum + r.rating, 0) /
      empReviews.length
    ).toFixed(1);
  };

  // ================= REVENUE =================
  const revenueByService = (id: number) => {
    const done = appointments.filter(
      a => a.service === id && a.status === "Hoàn thành"
    );

    const s = services.find(x => x.id === id);
    return done.length * (s?.price || 0);
  };

  const revenueByEmployee = (id: number) => {
    return appointments
      .filter(a => a.employee === id && a.status === "Hoàn thành")
      .reduce((sum, a) => {
        const s = services.find(x => x.id === a.service);
        return sum + (s?.price || 0);
      }, 0);
  };

  return (
    <div style={{ padding: 20 }}>

      <Tabs>

        {/* EMPLOYEE */}
        <TabPane tab="Nhân viên" key="1">
          <Card>
            <Space>
              <Input
                placeholder="Tên"
                value={emp.name}
                onChange={e => setEmp({ ...emp, name: e.target.value })}
              />
              <InputNumber
                placeholder="Khách/ngày"
                value={emp.max}
                onChange={v => setEmp({ ...emp, max: v || 0 })}
              />
              <Input
                placeholder="Lịch làm việc"
                value={emp.work}
                onChange={e => setEmp({ ...emp, work: e.target.value })}
              />
              <Button type="primary" onClick={addEmployee}>Thêm</Button>
            </Space>

            <List
              dataSource={employees}
              style={{ marginTop: 20 }}
              renderItem={e => (
                <List.Item>
                  {e.name} | {e.work}
                  <Tag color="blue">⭐ {avgRating(e.id)}</Tag>
                  <Button danger onClick={() => deleteEmployee(e.id)}>Xóa</Button>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        {/* SERVICE */}
        <TabPane tab="Dịch vụ" key="2">
          <Card>
            <Space>
              <Input
                placeholder="Tên dịch vụ"
                value={service.name}
                onChange={e => setService({ ...service, name: e.target.value })}
              />
              <InputNumber
                placeholder="Giá"
                value={service.price}
                onChange={v => setService({ ...service, price: v || 0 })}
              />
              <InputNumber
                placeholder="Thời gian"
                value={service.duration}
                onChange={v => setService({ ...service, duration: v || 0 })}
              />
              <Button type="primary" onClick={addService}>Thêm</Button>
            </Space>

            <List
              dataSource={services}
              style={{ marginTop: 20 }}
              renderItem={s => (
                <List.Item>
                  {s.name} - {s.price}đ - {s.duration}p
                  <Button danger onClick={() => deleteService(s.id)}>Xóa</Button>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        {/* BOOKING */}
        <TabPane tab="Lịch hẹn" key="3">
          <Card>
            <Space direction="vertical">

              <Input
                placeholder="Tên khách"
                onChange={e => setBooking({ ...booking, customer: e.target.value })}
              />

              <Select
                placeholder="Dịch vụ"
                onChange={v => setBooking({ ...booking, service: v })}
              >
                {services.map(s => (
                  <Option key={s.id} value={s.id}>{s.name}</Option>
                ))}
              </Select>

              <Select
                placeholder="Nhân viên"
                onChange={v => setBooking({ ...booking, employee: v })}
              >
                {employees.map(e => (
                  <Option key={e.id} value={e.id}>{e.name}</Option>
                ))}
              </Select>

              <DatePicker
                onChange={(d, ds) => setBooking({ ...booking, date: ds })}
              />

              <Input
                placeholder="Giờ"
                onChange={e => setBooking({ ...booking, time: e.target.value })}
              />

              <Button type="primary" onClick={book}>Đặt lịch</Button>
            </Space>

            <List
              dataSource={appointments}
              style={{ marginTop: 20 }}
              renderItem={a => (
                <List.Item>
                  {a.customer} | {a.date} {a.time}
                  <Tag>{a.status}</Tag>

                  <Space>
                    <Button onClick={() => updateStatus(a.id, "Xác nhận")}>OK</Button>
                    <Button onClick={() => updateStatus(a.id, "Hoàn thành")}>Done</Button>
                    <Button danger onClick={() => updateStatus(a.id, "Hủy")}>Hủy</Button>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </TabPane>

        {/* REVIEW */}
        <TabPane tab="Đánh giá" key="4">
          <Card>
            <Space direction="vertical">

              <Select
                placeholder="Chọn lịch"
                onChange={v => setReview({ ...review, appointmentId: v })}
              >
                {appointments.filter(a => a.status === "Hoàn thành").map(a => (
                  <Option key={a.id} value={a.id}>
                    {a.customer}
                  </Option>
                ))}
              </Select>

              <InputNumber
                min={1}
                max={5}
                value={review.rating}
                onChange={v => setReview({ ...review, rating: v || 5 })}
              />

              <Input
                placeholder="Nhận xét"
                onChange={e => setReview({ ...review, comment: e.target.value })}
              />

              <Button type="primary" onClick={addReview}>Gửi</Button>

            </Space>
          </Card>
        </TabPane>

        {/* STATS */}
        <TabPane tab="Thống kê" key="5">
          <Card>
            <h3>Lịch hẹn: {appointments.length}</h3>

            <h3>Dịch vụ</h3>
            {services.map(s => (
              <p key={s.id}>{s.name}: {revenueByService(s.id)}đ</p>
            ))}

            <h3>Nhân viên</h3>
            {employees.map(e => (
              <p key={e.id}>{e.name}: {revenueByEmployee(e.id)}đ</p>
            ))}
          </Card>
        </TabPane>

      </Tabs>
    </div>
  );
}