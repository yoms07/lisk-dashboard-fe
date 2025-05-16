"use client";

import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateWebhook } from "@/lib/hooks/useUpdateWebhook";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function WebhookPage() {
  const selectedProfile = useBusinessProfileStore(
    (state) => state.selectedProfile
  );
  console.log(selectedProfile);
  const { mutate: updateWebhook, isPending } = useUpdateWebhook();
  const [webhookUrl, setWebhookUrl] = useState(
    selectedProfile?.webhook_url || ""
  );
  console.log(webhookUrl);
  useEffect(() => {
    setWebhookUrl(selectedProfile?.webhook_url || "");
  }, [selectedProfile]);

  const handleCopyWebhookUrl = () => {
    if (!selectedProfile?.webhook_url) return;
    navigator.clipboard.writeText(selectedProfile.webhook_url);
    toast.success("Webhook URL copied to clipboard");
  };

  const handleUpdateWebhookUrl = () => {
    if (!selectedProfile?.id) return;
    updateWebhook({ businessId: selectedProfile.id, webhookUrl });
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
        title="Webhook Settings"
        description="Configure your webhook URL for receiving payment notifications"
      />

      <Card>
        <CardHeader>
          <CardTitle>Webhook URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter your webhook URL"
              className="flex-1"
              disabled={isPending}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyWebhookUrl}
              disabled={!selectedProfile.webhook_url || isPending}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={handleUpdateWebhookUrl}
            disabled={isPending || webhookUrl === selectedProfile.webhook_url}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isPending ? "Updating..." : "Update Webhook URL"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
