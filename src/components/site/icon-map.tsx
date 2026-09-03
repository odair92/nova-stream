import {
  Apple,
  Box,
  Clock,
  Flame,
  Headphones,
  Monitor,
  MonitorSmartphone,
  QrCode,
  RefreshCw,
  MessageCircle,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  TabletSmartphone,
  Tv,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Apple,
  Box,
  Clock,
  Flame,
  Headphones,
  MessageCircle,
  Monitor,
  MonitorSmartphone,
  QrCode,
  RefreshCw,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  TabletSmartphone,
  Tv,
  Wifi,
  Zap,
};

export function DynamicIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && icons[name]) || Sparkles;
  return <Icon className={className} aria-hidden="true" />;
}
