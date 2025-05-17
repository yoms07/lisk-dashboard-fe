"use client";

import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateApiKey } from "@/lib/hooks/useUpdateApiKey";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";

export default function ApiKeysPage() {
  const selectedProfile = useBusinessProfileStore(
    (state) => state.selectedProfile
  );
  const { mutate: updateApiKey, isPending } = useUpdateApiKey();

  const handleCopyApiKey = () => {
    if (!selectedProfile?.api_key?.api_key) return;
    navigator.clipboard.writeText(selectedProfile.api_key.api_key);
    toast.success("API key copied to clipboard");
  };

  const handleRevokeApiKey = () => {
    if (!selectedProfile?.id) return;
    updateApiKey(selectedProfile.id);
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
        title="API Keys"
        description="Manage your API keys for accessing the Lisk PG API"
      />

      <Card>
        <CardHeader>
          <CardTitle>Live API Key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 h-full">
            <code className="relative rounded bg-muted py-2 px-4  font-mono text-sm font-semibold">
              {selectedProfile.api_key?.api_key || "No API key generated"}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyApiKey}
              disabled={!selectedProfile.api_key?.api_key}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="destructive"
            onClick={handleRevokeApiKey}
            disabled={isPending || !selectedProfile.api_key?.api_key}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isPending ? "Revoking..." : "Revoke API Key"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
