"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Submit button for a delete form; asks first because deletes cannot be undone.
export function DeleteButton({ message, label = "Delete", iconOnly = false }) {
  return (
    <Button
      variant={iconOnly ? "ghost" : "outline"}
      size={iconOnly ? "icon" : "sm"}
      className="text-destructive"
      aria-label={iconOnly ? label : undefined}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <Trash2 /> {!iconOnly && label}
    </Button>
  );
}
