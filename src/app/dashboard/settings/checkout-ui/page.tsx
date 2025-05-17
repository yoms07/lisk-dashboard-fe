"use client";

import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUpdateCheckoutUi } from "@/lib/hooks/useUpdateCheckoutUi";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CheckoutPreview from "@/components/checkout-preview";
import { CheckoutUiCustomization } from "@/lib/api/business_profile/schema";
import { useState, useEffect } from "react";

const defaultCustomization: CheckoutUiCustomization = {
  primaryColor: "#0066FF",
  topBarColor: "#FFFFFF",
  topBarTextColor: "#000000",
  secondaryColor: "#F5F5F5",
  borderRadius: "8px",
  overlayColor: "#FFFFFF",
  bottomBarColor: "#FFFFFF",
  primaryTextColor: "#000000",
  secondaryTextColor: "#666666",
};

export default function CheckoutUiPage() {
  const selectedProfile = useBusinessProfileStore(
    (state) => state.selectedProfile
  );
  const [customization, setCustomization] = useState<CheckoutUiCustomization>(
    selectedProfile?.checkout_customization || defaultCustomization
  );
  const [lastSavedCustomization, setLastSavedCustomization] =
    useState<CheckoutUiCustomization>(
      selectedProfile?.checkout_customization || defaultCustomization
    );
  const updateCheckoutUi = useUpdateCheckoutUi();

  useEffect(() => {
    const newCustomization =
      selectedProfile?.checkout_customization || defaultCustomization;
    setCustomization(newCustomization);
    setLastSavedCustomization(newCustomization);
  }, [selectedProfile?.checkout_customization]);

  const handleUpdate = () => {
    if (!selectedProfile) return;
    updateCheckoutUi.mutate(
      {
        businessId: selectedProfile.id,
        customization,
      },
      {
        onSuccess: () => {
          setLastSavedCustomization(customization);
        },
      }
    );
  };

  const handleUndo = () => {
    setCustomization(lastSavedCustomization);
  };

  const handleChange = (key: keyof CheckoutUiCustomization, value: string) => {
    setCustomization((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!selectedProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No business profile selected</p>
      </div>
    );
  }

  // Helper for color fields
  const renderColorField = (
    label: string,
    key: keyof CheckoutUiCustomization
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-md border"
          style={{ background: customization[key] || "#fff" }}
        />
        <Input
          id={key}
          type="text"
          value={customization[key] as string}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-32"
        />
        <input
          type="color"
          value={customization[key] as string}
          onChange={(e) => handleChange(key, e.target.value)}
          className="w-8 h-8 p-0 border-none bg-transparent cursor-pointer"
          style={{ minWidth: 0 }}
        />
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen">
      <DashboardHeader
        title="Checkout UI"
        description="Customize the appearance of your checkout UI"
      />
      <div className="w-full h-full flex gap-6 mt-2">
        <Card className="p-6 flex-[2] bg-transparent border-none">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {renderColorField("Primary Color", "primaryColor")}
              {renderColorField("Top Bar Color", "topBarColor")}
              {renderColorField("Top Bar Text Color", "topBarTextColor")}
              {renderColorField("Secondary Color", "secondaryColor")}
              {renderColorField("Overlay Color", "overlayColor")}
              {renderColorField("Bottom Bar Color", "bottomBarColor")}
              {renderColorField("Primary Text Color", "primaryTextColor")}
              {renderColorField("Secondary Text Color", "secondaryTextColor")}
              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  type="text"
                  value={customization.borderRadius}
                  onChange={(e) => handleChange("borderRadius", e.target.value)}
                  placeholder="e.g. 8px"
                  className="w-32"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleUndo}
                disabled={
                  JSON.stringify(customization) ===
                  JSON.stringify(lastSavedCustomization)
                }
              >
                Undo Changes
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={
                  updateCheckoutUi.isPending ||
                  JSON.stringify(customization) ===
                    JSON.stringify(lastSavedCustomization)
                }
              >
                Update Checkout UI
              </Button>
            </div>
          </div>
        </Card>
        <Card className="bg-transparent w-full flex-[3] flex items-center justify-center">
          <CheckoutPreview
            primaryColor={customization.primaryColor}
            topBarColor={customization.topBarColor}
            topBarTextColor={customization.topBarTextColor}
            secondaryColor={customization.secondaryColor}
            overlayColor={customization.overlayColor}
            bottomBarColor={customization.bottomBarColor}
            primaryTextColor={customization.primaryTextColor}
            secondaryTextColor={customization.secondaryTextColor}
            borderRadius={customization.borderRadius}
          />
        </Card>
      </div>
    </div>
  );
}
