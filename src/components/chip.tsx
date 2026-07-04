export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] bg-chip text-ink px-2.5 py-1 rounded-xs whitespace-nowrap">
      {children}
    </span>
  );
}
