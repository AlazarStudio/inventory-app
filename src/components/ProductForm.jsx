import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, Button, Box } from "@mui/material";

export default function ProductForm({ open, onClose, onSave, initialData }) {
  const [form, setForm] = useState({
    name: "",
    demand: "",
    orderCost: "",
    holdingCost: "",
    unit: "шт",
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        name: "",
        demand: "",
        orderCost: "",
        holdingCost: "",
        unit: "шт",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...form, id: initialData?.id || Date.now() });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialData ? "Редактировать товар" : "Добавить товар"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Название" name="name" value={form.name} onChange={handleChange} />
          <TextField label="Спрос (D)" name="demand" type="number" value={form.demand} onChange={handleChange} />
          <TextField label="Стоимость заказа (S)" name="orderCost" type="number" value={form.orderCost} onChange={handleChange} />
          <TextField label="Хранение (H)" name="holdingCost" type="number" value={form.holdingCost} onChange={handleChange} />
          <TextField label="Единицы измерения" name="unit" value={form.unit} onChange={handleChange} />
          <Button onClick={handleSubmit} variant="contained">
            Сохранить
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
