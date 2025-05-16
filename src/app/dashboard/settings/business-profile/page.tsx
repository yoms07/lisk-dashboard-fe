"use client";

import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateBusinessProfile } from "@/lib/hooks/useUpdateBusinessProfile";
import { useState } from "react";

export default function BusinessProfilePage() {
  const selectedProfile = useBusinessProfileStore(
    (state) => state.selectedProfile
  );
  console.log("selectedProfile");
  console.log(selectedProfile);
  const [formData, setFormData] = useState({
    business_name: selectedProfile?.business_name || "",
    contact_email: selectedProfile?.contact_email || "",
    contact_phone: selectedProfile?.contact_phone || "",
    business_description: selectedProfile?.business_description || "",
  });
  const updateBusinessProfile = useUpdateBusinessProfile();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    updateBusinessProfile.mutate({
      businessId: selectedProfile.id,
      data: formData,
    });
  };

  if (!selectedProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No business profile selected</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Business Profile"
        description="Manage your business profile information"
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="Enter your business name"
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
                placeholder="Enter your contact email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="Enter your contact phone"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_description">Business Description</Label>
              <Textarea
                id="business_description"
                name="business_description"
                value={formData.business_description}
                onChange={handleChange}
                placeholder="Enter your business description"
                className="min-h-[100px]"
                required
              />
            </div>
          </div>

          <Button type="submit" disabled={updateBusinessProfile.isPending}>
            {updateBusinessProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
