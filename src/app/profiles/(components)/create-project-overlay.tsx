"use client";

import { useState } from "react";
import { useCreateBusinessProfile } from "@/lib/hooks/useCreateBusinessProfile";
import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateProjectOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectOverlay({
  isOpen,
  onClose,
}: CreateProjectOverlayProps) {
  const router = useRouter();
  const { mutate: createProfile, isPending } = useCreateBusinessProfile();
  const { setSelectedProfile } = useBusinessProfileStore();

  const [formData, setFormData] = useState({
    business_name: "",
    business_description: "",
    contact_email: "",
    contact_phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProfile(formData, {
      onSuccess: (data) => {
        setSelectedProfile(data);
        onClose();
        router.push("/dashboard");
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full h-full p-0 sm:max-w-none" side="bottom">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Create New Project</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business_description">Description</Label>
                <Textarea
                  id="business_description"
                  name="business_description"
                  value={formData.business_description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </form>

          <SheetFooter className="px-6 py-4 border-t border-border">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} onClick={handleSubmit}>
                {isPending ? "Creating..." : "Create Project"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
