import React, { useState } from 'react';
import { Button, Card, List, Typography, Space, Row, Col } from 'antd';

const { Title } = Typography;

const choices = ['Kéo', 'Búa', 'Bao'] as const;

type Choice = typeof choices[number];

type Result = 'Thắng' | 'Thua' | 'Hòa';

interface HistoryItem {
  key: number;
  player: Choice;
  computer: Choice;
  result: Result;
}

const getResult = (player: Choice, computer: Choice): Result => {
  if (player === computer) return 'Hòa';

  if (
    (player === 'Kéo' && computer === 'Bao') ||
    (player === 'Búa' && computer === 'Kéo') ||
    (player === 'Bao' && computer === 'Búa')
  ) {
    return 'Thắng';
  }

  return 'Thua';
};

const getRandomChoice = (): Choice =>
  choices[Math.floor(Math.random() * choices.length)];

const RPSGame: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const play = (playerChoice: Choice): void => {
    const computerChoice = getRandomChoice();
    const result = getResult(playerChoice, computerChoice);

    const record: HistoryItem = {
      key: history.length + 1,
      player: playerChoice,
      computer: computerChoice,
      result,
    };

    setHistory([record, ...history]);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Bài 1: Trò chơi Oẳn Tù Tì</Title>

      <p>
        Người chơi chọn Kéo, Búa, hoặc Bao. Máy tính cũng chọn một lựa chọn ngẫu
        nhiên. So sánh kết quả để xác định thắng/thua/hòa. Hiển thị lịch sử kết
        quả mỗi ván đấu.
      </p>

      <Card style={{ marginTop: 16 }}>
        <Space>
          {choices.map((c) => (
            <Button key={c} type="primary" onClick={() => play(c)}>
              {c}
            </Button>
          ))}
        </Space>
      </Card>

      <List
        header={<div>Lịch sử ván đấu</div>}
        bordered
        dataSource={history}
        style={{ marginTop: 24 }}
        renderItem={(item: HistoryItem) => (
          <List.Item>
            <Row style={{ width: '100%' }}>
              <Col span={6}>Bạn: {item.player}</Col>
              <Col span={6}>Máy: {item.computer}</Col>
              <Col span={6}>Kết quả: {item.result}</Col>
            </Row>
          </List.Item>
        )}
      />
    </div>
  );
};

export default RPSGame;