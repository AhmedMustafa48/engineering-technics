"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormCard, SlugField } from "@/components/admin/admin-ui";
import { saveBrand } from "@/app/admin/actions";
import { slugify } from "@/lib/admin/derive";

export function BrandForm({ brand }) {
  const [state, action, pending] = useActionState(saveBrand, null);
  const [name, setName] = useState(brand?.name ?? "");
  const [typedSlug, setTypedSlug] = useState(brand?.slug ?? null);
  return (
    <form action={action}>
      <FormCard icon={Factory} title={brand ? `Edit ${brand.name}` : "Add supplier"}>
        <input type="hidden" name="original_slug" value={brand?.slug ?? ""} />
        <input type="hidden" name="existing_logo" value={JSON.stringify(brand?.logo ?? null)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="name" required><Input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <SlugField value={typedSlug ?? slugify(name)} onChange={setTypedSlug} hint="Used in the supplier's page address." />
          <Field label="Full name" htmlFor="full_name"><Input id="full_name" name="full_name" defaultValue={brand?.full_name ?? ""} /></Field>
          <Field label="Country" htmlFor="country"><Input id="country" name="country" defaultValue={brand?.country ?? ""} /></Field>
        </div>
        <Field label="Description" htmlFor="description"><Textarea id="description" name="description" rows={3} defaultValue={brand?.description} /></Field>
        <Field label="Logo (optional)" htmlFor="logo_file">
          {brand?.logo && <Image src={brand.logo.src} alt="" width={120} height={48} className="mb-2 h-12 w-auto rounded-md border bg-white object-contain p-1" />}
          <Input id="logo_file" name="logo_file" type="file" accept="image/*" />
        </Field>
        {state?.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
        <Button variant="brand" disabled={pending}>{pending ? "Saving…" : "Save supplier"}</Button>
      </FormCard>
    </form>
  );
}
