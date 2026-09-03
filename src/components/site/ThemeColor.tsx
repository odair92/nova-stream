export function ThemeColor({ color }: { color?: string | null }) {
  if (!color) return null;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root{--primary:${color};--ring:${color};--sidebar-primary:${color};}`,
      }}
    />
  );
}
