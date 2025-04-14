import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        📦 Управление запасами
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Дипломный проект: Математическая модель и разработка приложения
      </Typography>

      <Typography paragraph>
        Это веб-приложение позволяет рассчитывать оптимальный объем заказа по модели EOQ, анализировать издержки на хранение и закупку, а также визуализировать данные.
      </Typography>

      <Box mt={3} mb={4}>
        <Typography variant="h5" gutterBottom>
          🔧 Возможности приложения:
        </Typography>
        <ul>
          <li>📐 Расчет оптимального объема заказа (EOQ)</li>
          <li>📊 Графики затрат и точка EOQ</li>
          <li>📄 Подробные расчёты: количество заказов, интервал, общие издержки</li>
          <li>📥 Экспорт графика</li>
        </ul>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          💡 Пример кейса:
        </Typography>
        <Typography>
          Склад магазина имеет спрос 1200 ед/год. Стоимость одного заказа — 300₽. Хранение 1 ед. в год — 5₽.
        </Typography>
        <Typography mt={1}>
          📌 Оптимальный объем заказа (EOQ): <strong>120</strong> ед.<br />
          📦 Количество заказов в год: <strong>10</strong><br />
          🕒 Интервал между заказами: <strong>36 дней</strong><br />
          💰 Общие издержки: <strong>3300₽</strong>
        </Typography>
      </Paper>

      <Box textAlign="center">
        <Button variant="contained" size="large" onClick={() => navigate("/eoq")}>
          Перейти к расчету
        </Button>
      </Box>
    </Container>
  );
}
