import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
  Box,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleCalculate = (product) => {
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    navigate("/eoq");
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setOpenForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenForm(true);
  };

  const handleSave = (product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      }
      return [...prev, product];
    });
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📦 Список товаров

        <Button variant="contained" onClick={handleAdd} sx={{marginLeft: '20px'}}>
          + Добавить товар
        </Button>
      </Typography>

      <List>
        {products.map((product) => (
          <Paper key={product.id} sx={{ mb: 2, p: 2 }}>
            <ListItem
              secondaryAction={
                <>
                  <Button onClick={() => handleCalculate(product)} sx={{ mr: 1 }} variant="outlined">
                    Расчет EOQ
                  </Button>
                  <IconButton onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={product.name}
                secondary={`Спрос: ${product.demand} ${product.unit}/год | Заказ: ${product.orderCost}₽ | Хранение: ${product.holdingCost}₽/${product.unit}`}
              />
            </ListItem>
          </Paper>
        ))}
      </List>

      <ProductForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleSave}
        initialData={editingProduct}
      />
    </Container>
  );
}
