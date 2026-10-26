import {
  Activity,
  Anchor,
  Cable,
  CircuitBoard,
  Cylinder,
  Droplets,
  Fan,
  Gauge,
  Layers,
  Package,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Zap,
} from "lucide-react";

const icons = {
  Activity,
  Anchor,
  Cable,
  CircuitBoard,
  Cylinder,
  Droplets,
  Fan,
  Gauge,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
  Thermometer,
  Zap,
};

export function CategoryIcon({ name, ...props }) {
  const Icon = icons[name] ?? Package;
  return <Icon aria-hidden {...props} />;
}
