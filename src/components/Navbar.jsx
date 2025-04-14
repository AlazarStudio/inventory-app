import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Управление запасами
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Главная
        </Button>
        <Button color="inherit" component={Link} to="/products">
          Продукция
        </Button>
        <Button color="inherit" component={Link} to="/eoq">
          Расчет EOQ
        </Button>
        <Button color="inherit" component={Link} to="/analytics">
          Аналитика
        </Button>
        <Button color="inherit" component={Link} to="/theory">
          Теория
        </Button>
      </Toolbar>
    </AppBar>
  );
}
