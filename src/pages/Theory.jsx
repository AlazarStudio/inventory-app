import { Container, Typography } from "@mui/material";

export default function Theory() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Теоретическая часть
      </Typography>
      <Typography paragraph>
        EOQ (Economic Order Quantity) — это модель управления запасами, позволяющая определить оптимальный объем заказа, минимизирующий суммарные издержки на заказ и хранение.
      </Typography>
      <Typography paragraph>
        Формула EOQ: <strong>Q = √(2DS / H)</strong>, где:
        <ul>
          <li><strong>D</strong> — годовой спрос (единиц/год)</li>
          <li><strong>S</strong> — стоимость одного заказа</li>
          <li><strong>H</strong> — стоимость хранения единицы продукции в год</li>
        </ul>
      </Typography>
      <Typography paragraph>
        Также в рамках управления запасами используются понятия точки повторного заказа, страхового запаса, общего цикла пополнения и др.
      </Typography>
    </Container>
  );
}
