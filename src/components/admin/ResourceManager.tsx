import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteRow, listRows, saveRow, type AdminTable } from "@/lib/admin.functions";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "list";

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  defaultValue?: unknown;
}

export interface ColumnConfig {
  name: string;
  label: string;
  render?: (row: Record<string, any>) => React.ReactNode;
}

export function ResourceManager({
  table,
  title,
  description,
  fields,
  columns,
  orderBy = "position",
  ascending = true,
  canCreate = true,
  canDelete = true,
}: {
  table: AdminTable;
  title: string;
  description?: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  orderBy?: string;
  ascending?: boolean;
  canCreate?: boolean;
  canDelete?: boolean;
}) {
  const list = useServerFn(listRows);
  const save = useServerFn(saveRow);
  const remove = useServerFn(deleteRow);
  const queryClient = useQueryClient();
  const queryKey = ["admin", table, orderBy, ascending];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => list({ data: { table, orderBy, ascending } }),
  });

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [form, setForm] = useState<Record<string, any>>({});

  const saveMutation = useMutation({
    mutationFn: (values: Record<string, unknown>) =>
      save({ data: { table, id: editingId, values } }),
    onSuccess: () => {
      toast.success("Salvo com sucesso");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["landing-content"] });
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível salvar"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { table, id } }),
    onSuccess: () => {
      toast.success("Removido");
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["landing-content"] });
    },
    onError: (error: Error) => toast.error(error.message || "Não foi possível remover"),
  });

  function openNew() {
    setEditingId(undefined);
    const initial: Record<string, any> = {};
    for (const field of fields) initial[field.name] = field.defaultValue ?? defaultFor(field);
    setForm(initial);
    setOpen(true);
  }

  function openEdit(row: Record<string, any>) {
    setEditingId(row.id as string);
    const initial: Record<string, any> = {};
    for (const field of fields) {
      const value = row[field.name];
      initial[field.name] =
        field.type === "list" ? (Array.isArray(value) ? value.join("\n") : "") : (value ?? defaultFor(field));
    }
    setForm(initial);
    setOpen(true);
  }

  function submit() {
    const values: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = form[field.name];
      if (field.type === "number") {
        values[field.name] = raw === "" || raw == null ? null : Number(raw);
      } else if (field.type === "boolean") {
        values[field.name] = Boolean(raw);
      } else if (field.type === "list") {
        values[field.name] = String(raw ?? "")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
      } else {
        values[field.name] = raw === "" ? null : raw;
      }
    }
    saveMutation.mutate(values);
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">{title}</h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {canCreate ? (
          <Button onClick={openNew}>
            <Plus className="mr-2 h-4 w-4" /> Novo
          </Button>
        ) : null}
      </header>

      <div className="rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.name}>{column.label}</TableHead>
                ))}
                <TableHead className="w-24 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-muted-foreground">
                    Nenhum registro cadastrado.
                  </TableCell>
                </TableRow>
              ) : null}
              {(data ?? []).map((row: Record<string, any>) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.name} className="max-w-[280px] truncate align-middle">
                      {column.render ? column.render(row) : renderValue(row[column.name])}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(row)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {canDelete ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Remover este registro?")) deleteMutation.mutate(row.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Editar" : "Novo"} registro</DialogTitle>
            <DialogDescription>Alterações aparecem no site imediatamente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" || field.type === "list" ? "sm:col-span-2" : ""}
              >
                <Label className="mb-2 block" htmlFor={field.name}>
                  {field.label}
                </Label>
                {field.type === "textarea" || field.type === "list" ? (
                  <Textarea
                    id={field.name}
                    rows={field.type === "list" ? 5 : 3}
                    value={form[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
                    }
                  />
                ) : field.type === "boolean" ? (
                  <div className="flex h-9 items-center gap-2">
                    <Checkbox
                      id={field.name}
                      checked={Boolean(form[field.name])}
                      onCheckedChange={(checked) =>
                        setForm((prev) => ({ ...prev, [field.name]: Boolean(checked) }))
                      }
                    />
                    <span className="text-sm text-muted-foreground">Ativado</span>
                  </div>
                ) : field.type === "select" ? (
                  <Select
                    value={form[field.name] ? String(form[field.name]) : undefined}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, [field.name]: value }))}
                  >
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options ?? []).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type === "number" ? "number" : "text"}
                    step="any"
                    value={form[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, [field.name]: event.target.value }))
                    }
                  />
                )}
                {field.help ? (
                  <p className="mt-1 text-xs text-muted-foreground">{field.help}</p>
                ) : null}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submit} disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function defaultFor(field: FieldConfig) {
  if (field.type === "boolean") return false;
  if (field.type === "number") return "";
  return "";
}

function renderValue(value: unknown): React.ReactNode {
  if (value == null || value === "") return <span className="text-muted-foreground">—</span>;
  if (typeof value === "boolean")
    return <Badge variant={value ? "default" : "secondary"}>{value ? "Sim" : "Não"}</Badge>;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
