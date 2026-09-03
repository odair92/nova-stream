import { DynamicIcon } from "./icon-map";
import type { DeviceItem } from "@/lib/types";

export function DevicesSection({ devices }: { devices: DeviceItem[] }) {
  if (devices.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Compatibilidade</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">Assista em qualquer dispositivo</h2>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {devices.map((device) => (
          <div
            key={device.id}
            className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-3 py-6 text-center"
          >
            <DynamicIcon name={device.icon} className="h-7 w-7 text-primary" />
            <span className="text-sm font-medium">{device.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
