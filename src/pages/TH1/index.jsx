import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, Alert } from 'antd';

const { Text } = Typography;
const MAX_ATTEMPTS = 10;

export default function TH1() {
  const generateNumber = () => Math.floor(Math.random() * 100) + 1;

  const [target, setTarget] = useState(generateNumber());
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState('info');

  const resetGame = () => {
    setTarget(generateNumber());
    setGuess('');
    setMessage('');
    setAttempts(0);
    setFinished(false);
  };

  const handleSubmit = () => {
    if (finished) return;

    const n = parseInt(guess, 10);
    if (isNaN(n) || n < 1 || n > 100) {
      setMessage('Vui lòng nhập số từ 1 đến 100');
      setStatus('warning');
      return;
    }

    const next = attempts + 1;
    setAttempts(next);

    if (n === target) {
      setMessage('Chúc mừng! Bạn đã đoán đúng!');
      setStatus('success');
      setFinished(true);
      return;
    }

    if (next >= MAX_ATTEMPTS) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${target}.`);
      setStatus('error');
      setFinished(true);
      return;
    }

    if (n < target) {
      setMessage('Bạn đoán quá thấp!');
    } else {
      setMessage('Bạn đoán quá cao!');
    }

    setStatus('info');
  };

  return (
    <div style={{ padding: 24, display: 'flex', justifyContent: 'center' }}>
      <Card title="Trò chơi đoán số" style={{ width: 400 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Text>
            Hệ thống chọn số từ 1–100. Bạn có {MAX_ATTEMPTS} lượt đoán.
          </Text>

          <Space style={{ width: '100%' }}>
            <Input
              type="number"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={finished}
              placeholder="Nhập số"
              onPressEnter={handleSubmit}
            />
            <Button type="primary" onClick={handleSubmit} disabled={finished}>
              Đoán
            </Button>
          </Space>

          {message && <Alert message={message} type={status} showIcon />}

          {!finished && attempts > 0 && (
            <Text type="secondary">
              Lượt đã dùng: {attempts}/{MAX_ATTEMPTS}
            </Text>
          )}

          {finished && (
            <Button block onClick={resetGame}>
              Chơi lại
            </Button>
          )}
        </Space>
      </Card>
    </div>
  );
}