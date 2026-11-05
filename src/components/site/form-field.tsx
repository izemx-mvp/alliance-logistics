import { cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type ControlProps = {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
};

/** aria/id props for a control rendered inside <FormField manual> (e.g. a Radix SelectTrigger). */
export function controlProps(
  id: string,
  error?: string | undefined,
  required = false,
): ControlProps {
  return {
    id,
    ...(error ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {}),
    ...(required ? { "aria-required": true } : {}),
  };
}

/**
 * Label + control + error message, wired with aria attributes.
 * The child receives id/aria props automatically, unless `manual` is set
 * (then spread `controlProps()` on the focusable element yourself).
 */
export function FormField({
  id,
  label,
  error,
  required = false,
  hint,
  className,
  children,
  dark = false,
  manual = false,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  required?: boolean;
  hint?: string;
  className?: string;
  children: ReactElement<ControlProps>;
  dark?: boolean;
  manual?: boolean;
}) {
  const t = useT();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  const control =
    !manual && isValidElement(children)
      ? cloneElement(children, {
          id,
          "aria-invalid": error ? true : undefined,
          ...(describedBy ? { "aria-describedby": describedBy } : {}),
          ...(required ? { "aria-required": true } : {}),
        } as ControlProps)
      : children;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn("text-sm font-medium", dark && "text-white")}>
        {label}
        {required ? (
          <span className="text-primary" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground"> ({t.common.optional})</span>
        )}
      </Label>
      {control}
      {hint && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function FieldGroup({
  legend,
  children,
  className,
}: {
  legend: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("space-y-3", className)}>
      <legend className="text-sm font-medium">
        {legend}
        <span className="text-primary" aria-hidden="true">
          {" "}
          *
        </span>
      </legend>
      {children}
    </fieldset>
  );
}
