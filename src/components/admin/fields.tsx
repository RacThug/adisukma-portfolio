import type { ReactNode } from "react";

const labelClass = "font-mono text-xs uppercase tracking-wider text-muted";
const inputClass =
  "w-full rounded border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent";

function Hint({ children }: { children: ReactNode }) {
  return <span className="text-xs text-muted">{children}</span>;
}

export function TextField({
  label,
  name,
  defaultValue = "",
  hint,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <input name={name} defaultValue={defaultValue} required={required} className={inputClass} />
      {hint && <Hint>{hint}</Hint>}
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue = "",
  hint,
  rows = 4,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelClass}>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        required={required}
        className={inputClass}
      />
      {hint && <Hint>{hint}</Hint>}
    </label>
  );
}

export function LinesField({
  label,
  name,
  values,
  hint = "one item per line",
  required,
}: {
  label: string;
  name: string;
  values: readonly string[];
  hint?: string;
  required?: boolean;
}) {
  return (
    <TextAreaField
      label={label}
      name={name}
      defaultValue={values.join("\n")}
      hint={hint}
      rows={Math.min(12, values.length + 2)}
      required={required}
    />
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="accent-accent" />
      <span className={labelClass}>{label}</span>
    </label>
  );
}

export function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded border border-line bg-surface/50 p-4">
      <legend className="px-1 font-mono text-xs uppercase tracking-wider text-accent">
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}
