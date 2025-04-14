import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

export default function EOQCalculator({ product }) {
  const [name, setName] = useState("");
  const [demand, setDemand] = useState("");
  const [orderCost, setOrderCost] = useState("");
  const [holdingCost, setHoldingCost] = useState("");
  const [workingDays, setWorkingDays] = useState(365);
  const [unit, setUnit] = useState("шт");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDemand(product.demand);
      setOrderCost(product.orderCost);
      setHoldingCost(product.holdingCost);
      setUnit(product.unit || "шт");
    }
  }, [product]);

  const calculateEOQ = () => {
    const D = parseFloat(demand);
    const S = parseFloat(orderCost);
    const H = parseFloat(holdingCost);
    const days = parseInt(workingDays);

    if (!D || !S || !H || !days) return;

    const EOQ = Math.sqrt((2 * D * S) / H);
    const ordersPerYear = D / EOQ;
    const daysBetweenOrders = days / ordersPerYear;
    const orderingCost = (D / EOQ) * S;
    const holdingCostTotal = (EOQ / 2) * H;
    const totalCost = orderingCost + holdingCostTotal;

    setResult({
      EOQ: EOQ.toFixed(2),
      ordersPerYear: ordersPerYear.toFixed(1),
      daysBetweenOrders: daysBetweenOrders.toFixed(1),
      orderingCost: orderingCost.toFixed(2),
      holdingCost: holdingCostTotal.toFixed(2),
      totalCost: totalCost.toFixed(2),
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, margin: "auto", mt: 5 }}>
      <Typography variant="h6" gutterBottom>
        Расчет EOQ {name ? `для «${name}»` : ""}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Спрос (D, ед/год)"
          type="number"
          value={demand}
          onChange={(e) => setDemand(e.target.value)}
        />
        <TextField
          label="Стоимость заказа (S, руб)"
          type="number"
          value={orderCost}
          onChange={(e) => setOrderCost(e.target.value)}
        />
        <TextField
          label={`Хранение 1 ед. (H, руб/${unit}/год)`}
          type="number"
          value={holdingCost}
          onChange={(e) => setHoldingCost(e.target.value)}
        />
        <TextField
          label="Рабочих дней в году"
          type="number"
          value={workingDays}
          onChange={(e) => setWorkingDays(e.target.value)}
        />

        <Button variant="contained" onClick={calculateEOQ}>
          Рассчитать EOQ
        </Button>

        {result && (
          <Box mt={3}>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              📊 Результаты расчета:
            </Typography>
            <Typography>🔹 EOQ: <strong>{result.EOQ}</strong> {unit}</Typography>
            <Typography>🔹 Заказов в год: <strong>{result.ordersPerYear}</strong></Typography>
            <Typography>🔹 Интервал между заказами: <strong>{result.daysBetweenOrders}</strong> дней</Typography>
            <Typography>🔹 Издержки на заказы: <strong>{result.orderingCost}₽</strong></Typography>
            <Typography>🔹 Издержки на хранение: <strong>{result.holdingCost}₽</strong></Typography>
            <Typography>💰 Общие издержки: <strong>{result.totalCost}₽</strong></Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
