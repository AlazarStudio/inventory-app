import EOQCalculator from "../components/EOQCalculator";

export default function EOQPage() {
  const selected = localStorage.getItem("selectedProduct");
  const product = selected ? JSON.parse(selected) : null;

  return <EOQCalculator product={product} />;
}
