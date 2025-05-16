"use client";

import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUpdateCheckoutUi } from "@/lib/hooks/useUpdateCheckoutUi";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckoutPreview } from "@/components/checkout-preview";
import { CheckoutUiCustomization } from "@/lib/api/business_profile/schema";
import { useState } from "react";

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
  const updateCheckoutUi = useUpdateCheckoutUi();

  const handleUpdate = () => {
    if (!selectedProfile) return;
    updateCheckoutUi.mutate({
      businessId: selectedProfile.id,
      customization,
    });
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

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Checkout UI"
        description="Customize the appearance of your checkout UI"
      />

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  type="color"
                  value={customization.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topBarColor">Top Bar Color</Label>
                <Input
                  id="topBarColor"
                  type="color"
                  value={customization.topBarColor}
                  onChange={(e) => handleChange("topBarColor", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topBarTextColor">Top Bar Text Color</Label>
                <Input
                  id="topBarTextColor"
                  type="color"
                  value={customization.topBarTextColor}
                  onChange={(e) =>
                    handleChange("topBarTextColor", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  type="color"
                  value={customization.secondaryColor}
                  onChange={(e) =>
                    handleChange("secondaryColor", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="borderRadius">Border Radius</Label>
                <Input
                  id="borderRadius"
                  type="text"
                  value={customization.borderRadius}
                  onChange={(e) => handleChange("borderRadius", e.target.value)}
                  placeholder="e.g. 8px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="overlayColor">Overlay Color</Label>
                <Input
                  id="overlayColor"
                  type="color"
                  value={customization.overlayColor}
                  onChange={(e) => handleChange("overlayColor", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bottomBarColor">Bottom Bar Color</Label>
                <Input
                  id="bottomBarColor"
                  type="color"
                  value={customization.bottomBarColor}
                  onChange={(e) =>
                    handleChange("bottomBarColor", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryTextColor">Primary Text Color</Label>
                <Input
                  id="primaryTextColor"
                  type="color"
                  value={customization.primaryTextColor}
                  onChange={(e) =>
                    handleChange("primaryTextColor", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryTextColor">Secondary Text Color</Label>
                <Input
                  id="secondaryTextColor"
                  type="color"
                  value={customization.secondaryTextColor}
                  onChange={(e) =>
                    handleChange("secondaryTextColor", e.target.value)
                  }
                />
              </div>
            </div>

            <Button
              onClick={handleUpdate}
              disabled={updateCheckoutUi.isPending}
            >
              Update Checkout UI
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <CheckoutPreview
            customization={customization}
            businessProfile={selectedProfile}
          />
        </Card>
      </div>
    </div>
  );
}
