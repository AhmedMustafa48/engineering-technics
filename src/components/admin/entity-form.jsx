"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveBrand } from "@/app/admin/actions";

function Field({ label, id, children }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function BrandForm({ brand }) {
  const [state, action, pending] = useActionState(saveBrand, null);
  return (
    <form action={action} className="space-y-4 rounded-xl border bg-card p-5">
      <h2 className="font-semibold">{brand ? `Edit ${brand.name}` : "Add supplier"}</h2>
      <input type="hidden" name="original_slug" value={brand?.slug ?? ""} />
      <input type="hidden" name="existing_logo" value={JSON.stringify(brand?.logo ?? null)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" id="name"><Input id="name" name="name" required defaultValue={brand?.name} /></Field>
        <Field label="URL slug" id="slug"><Input id="slug" name="slug" required defaultValue={brand?.slug} /></Field>
        <Field label="Full name" id="full_name"><Input id="full_name" name="full_name" defaultValue={brand?.full_name ?? ""} /></Field>
        <Field label="Country" id="country"><Input id="country" name="country" defaultValue={brand?.country ?? ""} /></Field>
      </div>
      <Field label="Description" id="description"><Textarea id="description" name="description" rows={3} defaultValue={brand?.description} /></Field>
      <Field label="Logo (optional)" id="logo_file">
        {brand?.logo && <Image src={brand.logo.src} alt="" width={120} height={48} className="mb-2 h-12 w-auto rounded border bg-white p-1" />}
        <Input id="logo_file" name="logo_file" type="file" accept="image/*" />
      </Field>
      {state?.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      <Button disabled={pending}>{pending ? "Saving…" : "Save supplier"}</Button>
    </form>
  );
}
