import React, { useState } from "react";
import {
  Tabs,
  Card,
  Input,
  Button,
  List,
  Select,
  Space,
  Typography,
  InputNumber,
  message
} from "antd";

const { TabPane } = Tabs;
const { Title } = Typography;

const difficultyLevels = ["Dễ", "Trung bình", "Khó", "Rất khó"];

export default function QuestionBankSystem(): JSX.Element {

  const [blocks, setBlocks] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [structures, setStructures] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  const [blockName, setBlockName] = useState("");

  const [subject, setSubject] = useState({
    code: "",
    name: "",
    credit: ""
  });

  const [question, setQuestion] = useState({
    text: "",
    subject: "",
    block: "",
    difficulty: ""
  });

  const [search, setSearch] = useState({
    subject: "",
    block: "",
    difficulty: ""
  });

  const [structure, setStructure] = useState<any>({
    subject: "",
    easy: 0,
    medium: 0,
    hard: 0
  });

  // ================= BLOCK =================
  const addBlock = () => {
    if (!blockName) return;
    setBlocks([...blocks, blockName]);
    setBlockName("");
  };

  // ================= SUBJECT =================
  const addSubject = () => {
    setSubjects([...subjects, subject]);
    setSubject({ code: "", name: "", credit: "" });
  };

  // ================= QUESTION =================
  const addQuestion = () => {
    const newQ = {
      id: questions.length + 1,
      ...question
    };

    setQuestions([...questions, newQ]);

    setQuestion({
      text: "",
      subject: "",
      block: "",
      difficulty: ""
    });

    message.success("Đã thêm câu hỏi");
  };

  // ================= FILTER =================
  const filteredQuestions = questions.filter(q =>
    (!search.subject || q.subject === search.subject) &&
    (!search.block || q.block === search.block) &&
    (!search.difficulty || q.difficulty === search.difficulty)
  );

  // ================= STRUCTURE =================
  const saveStructure = () => {
    setStructures([...structures, structure]);
    message.success("Đã lưu cấu trúc đề");
  };

  // ================= EXAM =================
  const generateExam = (s: any) => {

    const easy = questions.filter(
      q => q.subject === s.subject && q.difficulty === "Dễ"
    );

    const medium = questions.filter(
      q => q.subject === s.subject && q.difficulty === "Trung bình"
    );

    const hard = questions.filter(
      q => q.subject === s.subject && q.difficulty === "Khó"
    );

    if (
      easy.length < s.easy ||
      medium.length < s.medium ||
      hard.length < s.hard
    ) {
      message.error("Không đủ câu hỏi phù hợp!");
      return;
    }

    const exam = [
      ...easy.slice(0, s.easy),
      ...medium.slice(0, s.medium),
      ...hard.slice(0, s.hard)
    ];

    setExams([...exams, exam]);
    message.success("Đã tạo đề thi");
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Hệ thống ngân hàng câu hỏi</Title>

      <Tabs>

        {/* ================= BLOCK ================= */}
        <TabPane tab="Khối kiến thức" key="1">
          <Space>
            <Input
              placeholder="Tên khối"
              value={blockName}
              onChange={(e) => setBlockName(e.target.value)}
            />
            <Button type="primary" onClick={addBlock}>
              Thêm
            </Button>
          </Space>

          <List
            bordered
            dataSource={blocks}
            style={{ marginTop: 20 }}
            renderItem={(b) => <List.Item key={b}>{b}</List.Item>}
          />
        </TabPane>

        {/* ================= SUBJECT ================= */}
        <TabPane tab="Môn học" key="2">
          <Space direction="vertical">

            <Input
              placeholder="Mã môn"
              value={subject.code}
              onChange={(e) => setSubject({ ...subject, code: e.target.value })}
            />

            <Input
              placeholder="Tên môn"
              value={subject.name}
              onChange={(e) => setSubject({ ...subject, name: e.target.value })}
            />

            <Input
              placeholder="Số tín chỉ"
              value={subject.credit}
              onChange={(e) => setSubject({ ...subject, credit: e.target.value })}
            />

            <Button type="primary" onClick={addSubject}>
              Thêm môn
            </Button>

          </Space>

          <List
            bordered
            dataSource={subjects}
            style={{ marginTop: 20 }}
            renderItem={(s) => (
              <List.Item key={s.code}>
                {s.code} - {s.name} ({s.credit} tín chỉ)
              </List.Item>
            )}
          />
        </TabPane>

        {/* ================= QUESTION ================= */}
        <TabPane tab="Câu hỏi" key="3">

          <Card>
            <Space direction="vertical">

              <Input
                placeholder="Nội dung câu hỏi"
                value={question.text}
                onChange={(e) =>
                  setQuestion({ ...question, text: e.target.value })
                }
              />

              <Select
                placeholder="Môn học"
                value={question.subject || undefined}
                onChange={(v) => setQuestion({ ...question, subject: v })}
              >
                {subjects.map((s) => (
                  <Select.Option key={s.name} value={s.name}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Khối kiến thức"
                value={question.block || undefined}
                onChange={(v) => setQuestion({ ...question, block: v })}
              >
                {blocks.map((b) => (
                  <Select.Option key={b} value={b}>
                    {b}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Mức độ khó"
                value={question.difficulty || undefined}
                onChange={(v) =>
                  setQuestion({ ...question, difficulty: v })
                }
              >
                {difficultyLevels.map((d) => (
                  <Select.Option key={d} value={d}>
                    {d}
                  </Select.Option>
                ))}
              </Select>

              <Button type="primary" onClick={addQuestion}>
                Thêm câu hỏi
              </Button>

            </Space>
          </Card>

          {/* SEARCH */}
          <Card style={{ marginTop: 20 }}>
            <Space>

              <Select
                placeholder="Môn"
                style={{ width: 150 }}
                value={search.subject || undefined}
                onChange={(v) => setSearch({ ...search, subject: v })}
              >
                {subjects.map((s) => (
                  <Select.Option key={s.name} value={s.name}>
                    {s.name}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Khối"
                style={{ width: 150 }}
                value={search.block || undefined}
                onChange={(v) => setSearch({ ...search, block: v })}
              >
                {blocks.map((b) => (
                  <Select.Option key={b} value={b}>
                    {b}
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="Mức độ"
                style={{ width: 150 }}
                value={search.difficulty || undefined}
                onChange={(v) =>
                  setSearch({ ...search, difficulty: v })
                }
              >
                {difficultyLevels.map((d) => (
                  <Select.Option key={d} value={d}>
                    {d}
                  </Select.Option>
                ))}
              </Select>

            </Space>
          </Card>

          <List
            bordered
            dataSource={filteredQuestions}
            style={{ marginTop: 20 }}
            renderItem={(q) => (
              <List.Item key={q.id}>
                {q.text} | {q.subject} | {q.block} | {q.difficulty}
              </List.Item>
            )}
          />
        </TabPane>

        {/* ================= STRUCTURE ================= */}
        <TabPane tab="Cấu trúc đề" key="4">

          <Space direction="vertical">

            <Select
              placeholder="Môn học"
              style={{ width: 200 }}
              value={structure.subject || undefined}
              onChange={(v) =>
                setStructure({ ...structure, subject: v })
              }
            >
              {subjects.map((s) => (
                <Select.Option key={s.name} value={s.name}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>

            <InputNumber
              placeholder="Dễ"
              onChange={(v) =>
                setStructure({ ...structure, easy: v || 0 })
              }
            />

            <InputNumber
              placeholder="Trung bình"
              onChange={(v) =>
                setStructure({ ...structure, medium: v || 0 })
              }
            />

            <InputNumber
              placeholder="Khó"
              onChange={(v) =>
                setStructure({ ...structure, hard: v || 0 })
              }
            />

            <Button type="primary" onClick={saveStructure}>
              Lưu cấu trúc
            </Button>

          </Space>

          <List
            header="Danh sách cấu trúc"
            bordered
            dataSource={structures}
            style={{ marginTop: 20 }}
            renderItem={(s, index) => (
              <List.Item
                actions={[
                  <Button key={index} onClick={() => generateExam(s)}>
                    Tạo đề
                  </Button>
                ]}
              >
                {s.subject} - Dễ:{s.easy} TB:{s.medium} Khó:{s.hard}
              </List.Item>
            )}
          />
        </TabPane>

        {/* ================= EXAM ================= */}
        <TabPane tab="Đề thi" key="5">
          <List
            bordered
            dataSource={exams}
            renderItem={(exam, i) => (
              <List.Item key={i}>
                Đề {i + 1} - {exam.length} câu
              </List.Item>
            )}
          />
        </TabPane>

      </Tabs>
    </div>
  );
}