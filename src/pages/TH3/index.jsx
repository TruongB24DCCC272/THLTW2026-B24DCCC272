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

export default function AppointmentSystem() {

  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [emp, setEmp] = useState({ name: "", max: 5, work: "" });
  const [service, setService] = useState({ name: "", price: 0, duration: 30 });

  const [booking, setBooking] = useState({
    customer: "",
    service: "",
    employee: "",
    date: "",
    time: ""
  });

  const [review, setReview] = useState({
    appointmentId: "",
    rating: 5,
    comment: ""
  });

  // =================
  // EMPLOYEE
  // =================

  const addEmployee = () => {
    if (!emp.name) {
      message.error("Nhập tên nhân viên");
      return;
    }

    setEmployees([
      ...employees,
      { id: employees.length + 1, ...emp }
    ]);

    setEmp({ name: "", max: 5, work: "" });
  };

  const deleteEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  // =================
  // SERVICE
  // =================

  const addService = () => {
    if (!service.name) {
      message.error("Nhập tên dịch vụ");
      return;
    }

    setServices([
      ...services,
      { id: services.length + 1, ...service }
    ]);

    setService({ name: "", price: 0, duration: 30 });
  };

  const deleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  // =================
  // BOOKING
  // =================

  const book = () => {

    if (!booking.customer || !booking.service || !booking.employee || !booking.date || !booking.time) {
      message.error("Nhập đầy đủ thông tin!");
      return;
    }

    const exist = appointments.find(
      a =>
        a.employee === booking.employee &&
        a.date === booking.date &&
        a.time === booking.time
    );

    if (exist) {
      message.error("Trùng lịch!");
      return;
    }

    const countToday = appointments.filter(
      a =>
        a.employee === booking.employee &&
        a.date === booking.date
    ).length;

    const empInfo = employees.find(e => e.id === booking.employee);

    if (empInfo && countToday >= empInfo.max) {
      message.error("Nhân viên đã đủ khách trong ngày!");
      return;
    }

    setAppointments([
      ...appointments,
      {
        id: appointments.length + 1,
        ...booking,
        status: "Chờ duyệt"
      }
    ]);

    message.success("Đặt lịch thành công");
  };

  const updateStatus = (id, status) => {
    setAppointments(
      appointments.map(a =>
        a.id === id ? { ...a, status } : a
      )
    );
  };

  // =================
  // REVIEW
  // =================

  const addReview = () => {

    if (!review.appointmentId) {
      message.error("Chọn lịch để đánh giá");
      return;
    }

    setReviews([
      ...reviews,
      { id: reviews.length + 1, ...review }
    ]);

    message.success("Đã gửi đánh giá");
  };

  // =================
  // RATING
  // =================

  const avgRating = (empId) => {

    const empReviews = reviews.filter(r => {
      const ap = appointments.find(a => a.id === r.appointmentId);
      return ap && ap.employee === empId;
    });

    if (empReviews.length === 0) return 0;

    const total = empReviews.reduce((sum, r) => sum + r.rating, 0);

    return (total / empReviews.length).toFixed(1);
  };

  // =================
  // STATISTICS
  // =================

  const revenueByService = (id) => {

    const done = appointments.filter(
      a => a.service === id && a.status === "Hoàn thành"
    );

    const serviceInfo = services.find(s => s.id === id);

    return done.length * (serviceInfo?.price || 0);
  };

  const revenueByEmployee = (id) => {

    const done = appointments.filter(
      a => a.employee === id && a.status === "Hoàn thành"
    );

    let total = 0;

    done.forEach(a => {
      const s = services.find(x => x.id === a.service);
      if (s) total += s.price;
    });

    return total;
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
                onChange={v => setEmp({ ...emp, max: v })}
              />

              <Input
                placeholder="Lịch làm việc"
                value={emp.work}
                onChange={e => setEmp({ ...emp, work: e.target.value })}
              />

              <Button type="primary" onClick={addEmployee}>
                Thêm
              </Button>

            </Space>

            <List
              style={{ marginTop: 20 }}
              bordered
              dataSource={employees}
              renderItem={e => (
                <List.Item>

                  {e.name} | {e.work}

                  <Tag color="blue">
                    ⭐ {avgRating(e.id)}
                  </Tag>

                  <Button danger onClick={() => deleteEmployee(e.id)}>
                    Xóa
                  </Button>

                </List.Item>
              )}
            />

          </Card>

        </TabPane>

        {/* SERVICES */}

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
                onChange={v => setService({ ...service, price: v })}
              />

              <InputNumber
                placeholder="Thời gian"
                value={service.duration}
                onChange={v => setService({ ...service, duration: v })}
              />

              <Button type="primary" onClick={addService}>
                Thêm
              </Button>

            </Space>

            <List
              bordered
              style={{ marginTop: 20 }}
              dataSource={services}
              renderItem={s => (
                <List.Item>

                  {s.name} - {s.price}đ - {s.duration} phút

                  <Button danger onClick={() => deleteService(s.id)}>
                    Xóa
                  </Button>

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
                  <Option value={s.id} key={s.id}>
                    {s.name}
                  </Option>
                ))}
              </Select>

              <Select
                placeholder="Nhân viên"
                onChange={v => setBooking({ ...booking, employee: v })}
              >
                {employees.map(e => (
                  <Option value={e.id} key={e.id}>
                    {e.name}
                  </Option>
                ))}
              </Select>

              <DatePicker
                onChange={(d, ds) => setBooking({ ...booking, date: ds })}
              />

              <Input
                placeholder="Giờ (VD: 10:00)"
                onChange={e => setBooking({ ...booking, time: e.target.value })}
              />

              <Button type="primary" onClick={book}>
                Đặt lịch
              </Button>

            </Space>

            <List
              bordered
              style={{ marginTop: 20 }}
              dataSource={appointments}
              renderItem={a => {

                const empName = employees.find(e => e.id === a.employee)?.name;
                const serviceName = services.find(s => s.id === a.service)?.name;

                return (
                  <List.Item>

                    {a.customer} | {serviceName} | {empName} | {a.date} {a.time}

                    <Tag>{a.status}</Tag>

                    <Space>

                      <Button onClick={() => updateStatus(a.id, "Xác nhận")}>
                        Xác nhận
                      </Button>

                      <Button onClick={() => updateStatus(a.id, "Hoàn thành")}>
                        Hoàn thành
                      </Button>

                      <Button danger onClick={() => updateStatus(a.id, "Hủy")}>
                        Hủy
                      </Button>

                    </Space>

                  </List.Item>
                );
              }}
            />

          </Card>

        </TabPane>

        {/* REVIEWS */}

        <TabPane tab="Đánh giá" key="4">

          <Card>

            <Space direction="vertical">

              <Select
                placeholder="Chọn lịch hoàn thành"
                onChange={v => setReview({ ...review, appointmentId: v })}
              >
                {appointments
                  .filter(a => a.status === "Hoàn thành")
                  .map(a => (
                    <Option value={a.id} key={a.id}>
                      {a.customer} - {a.date}
                    </Option>
                  ))}
              </Select>

              <InputNumber
                min={1}
                max={5}
                value={review.rating}
                onChange={v => setReview({ ...review, rating: v })}
              />

              <Input
                placeholder="Nhận xét"
                onChange={e => setReview({ ...review, comment: e.target.value })}
              />

              <Button type="primary" onClick={addReview}>
                Gửi
              </Button>

            </Space>

            <List
              bordered
              style={{ marginTop: 20 }}
              dataSource={reviews}
              renderItem={r => (
                <List.Item>
                  ⭐ {r.rating} - {r.comment}
                </List.Item>
              )}
            />

          </Card>

        </TabPane>

        {/* STATS */}

        <TabPane tab="Thống kê" key="5">

          <Card>

            <h3>Tổng lịch hẹn</h3>
            {appointments.length}

            <h3>Doanh thu theo dịch vụ</h3>

            {services.map(s => (
              <p key={s.id}>
                {s.name} : {revenueByService(s.id)} đ
              </p>
            ))}

            <h3>Doanh thu theo nhân viên</h3>

            {employees.map(e => (
              <p key={e.id}>
                {e.name} : {revenueByEmployee(e.id)} đ
              </p>
            ))}

          </Card>

        </TabPane>

      </Tabs>

    </div>
  );
}