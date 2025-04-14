import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
  ReferenceArea
} from "recharts";
import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Chip
} from "@mui/material";
import html2canvas from "html2canvas";

// Цвета для линий
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ff7300",
  "#e91e63",
  "#00bcd4",
  "#ffc107",
  "#4caf50",
  "#f44336",
  "#9c27b0",
  "#3f51b5"
];

export default function Analytics() {
  const [detailsByProduct, setDetailsByProduct] = useState({});

  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [chartData, setChartData] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedIds(typeof value === "string" ? value.split(",") : value);
  };

  const calculateData = () => {
    const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
    const result = [];
    const productDetails = {};

    // 🧮 Сначала считаем данные для графика
    for (let Q = 25; Q <= 1500; Q += 25) {
      const entry = { Q };

      selectedProducts.forEach((product) => {
        const D = parseFloat(product.demand);
        const S = parseFloat(product.orderCost);
        const H = parseFloat(product.holdingCost);

        const orderingCost = (D / Q) * S;
        const holdingCost = (Q / 2) * H;
        const totalCost = orderingCost + holdingCost;

        entry[`${product.name}`] = totalCost.toFixed(2);
      });

      result.push(entry);
    }

    // 🔍 Затем отдельно считаем EOQ и издержки для каждого товара
    selectedProducts.forEach((product) => {
      const D = parseFloat(product.demand);
      const S = parseFloat(product.orderCost);
      const H = parseFloat(product.holdingCost);
      const EOQ = Math.sqrt((2 * D * S) / H);
      const orderingCost = (D / EOQ) * S;
      const holdingCost = (EOQ / 2) * H;
      const totalCost = orderingCost + holdingCost;

      productDetails[product.id] = {
        EOQ: EOQ.toFixed(0),
        orderingCost: orderingCost.toFixed(2),
        holdingCost: holdingCost.toFixed(2),
        totalCost: totalCost.toFixed(2),
      };
    });

    setDetailsByProduct(productDetails);
    setChartData(result);
  };


  const downloadChart = () => {
    const chartContainer = chartRef.current;
    if (!chartContainer) return;
    html2canvas(chartContainer).then((canvas) => {
      const link = document.createElement("a");
      link.download = "multi-inventory-chart.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        📊 Сравнительная аналитика товаров
      </Typography>

      <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
        <InputLabel>Выберите товары</InputLabel>
        <Select
          multiple
          value={selectedIds}
          onChange={handleSelectChange}
          input={<OutlinedInput label="Выберите товары" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((id) => {
                const prod = products.find((p) => p.id === id);
                return <Chip key={id} label={prod?.name || id} />;
              })}
            </Box>
          )}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" gap={2} flexWrap="wrap" mb={3}>
        <Button variant="contained" onClick={calculateData}>
          Построить график
        </Button>
        <Button variant="outlined" onClick={downloadChart}>
          Скачать график
        </Button>
      </Box>

      {chartData.length > 0 && (
        <div ref={chartRef}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="Q"
                type="number"
                domain={[50, 1500]}
                label={{
                  value: "Объем заказа (Q)",
                  position: "insideBottomRight",
                  offset: -5
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedIds.map((id, index) => {
                const product = products.find((p) => p.id === id);
                return (
                  <Line
                    key={id}
                    type="monotone"
                    dataKey={product.name}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                );
              })}
              {selectedIds.map((id, index) => {
                const product = products.find((p) => p.id === id);
                const details = detailsByProduct[id];
                if (!details || !details.EOQ) return null;

                return (
                  <ReferenceLine
                    key={`eoq-line-${id}`}
                    x={parseInt(details.EOQ)}
                    stroke={COLORS[index % COLORS.length]}
                    strokeDasharray="5 5"
                    
                  />
                );
              })}

              {selectedIds.map((id, index) => {
                const details = detailsByProduct[id];
                if (!details || !details.EOQ) return null;

                const color = COLORS[index % COLORS.length];
                const eoqX = parseFloat(details.EOQ);
                const totalY = parseFloat(details.totalCost);
                return (
                  <ReferenceArea
                    key={`area-${id}`}
                    x1={eoqX * 0.9}
                    x2={eoqX * 1.1}
                    stroke={color}
                    strokeOpacity={0.2}
                    fill={color}
                    fillOpacity={0.05}
                  />
                );
              })}

            </LineChart>
          </ResponsiveContainer>

          {Object.keys(detailsByProduct).length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>📋 Детали по каждому товару:</Typography>
              {selectedIds.map((id) => {
                const product = products.find((p) => p.id === id);
                const details = detailsByProduct[id];
                if (!details) return null;

                return (
                  <Box key={id} mb={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
                    <Typography variant="subtitle1"><strong>{product.name}</strong></Typography>
                    <Typography>🔹 EOQ: <strong>{details.EOQ}</strong> {product.unit}</Typography>
                    <Typography>📦 Издержки на заказ: <strong>{details.orderingCost}₽</strong></Typography>
                    <Typography>🏢 Издержки на хранение: <strong>{details.holdingCost}₽</strong></Typography>
                    <Typography>💰 Общие издержки: <strong>{details.totalCost}₽</strong></Typography>
                  </Box>
                );
              })}
            </Box>
          )}

        </div>
      )}
    </Container>
  );
}
