"use client";

import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdateWallet } from "@/lib/hooks/useUpdateWallet";
import { toast } from "sonner";
import { Copy, RefreshCw } from "lucide-react";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { isValidEthereumAddress } from "@/lib/utils/ethereum";

export default function WalletPage() {
  const selectedProfile = useBusinessProfileStore(
    (state) => state.selectedProfile
  );
  const { mutate: updateWallet, isPending } = useUpdateWallet();
  const [walletAddress, setWalletAddress] = useState(
    selectedProfile?.wallet?.wallet_address || ""
  );
  const [isValidAddress, setIsValidAddress] = useState(true);

  useEffect(() => {
    setWalletAddress(selectedProfile?.wallet?.wallet_address || "");
  }, [selectedProfile]);

  const handleCopyWalletAddress = () => {
    if (!selectedProfile?.wallet?.wallet_address) return;
    navigator.clipboard.writeText(selectedProfile.wallet.wallet_address);
    toast.success("Wallet address copied to clipboard");
  };

  const handleUpdateWalletAddress = () => {
    if (!selectedProfile?.id) return;
    if (!isValidEthereumAddress(walletAddress)) {
      toast.error("Invalid Ethereum address");
      return;
    }
    updateWallet({ businessId: selectedProfile.id, walletAddress });
  };

  const handleWalletAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAddress = e.target.value;
    setWalletAddress(newAddress);
    setIsValidAddress(newAddress === "" || isValidEthereumAddress(newAddress));
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
        title="Wallet Settings"
        description="Configure your wallet address for receiving payments"
      />

      <Card>
        <CardHeader>
          <CardTitle>Wallet Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              value={walletAddress}
              onChange={handleWalletAddressChange}
              placeholder="Enter your wallet address (e.g., 0x...)"
              className="flex-1"
              disabled={isPending}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyWalletAddress}
              disabled={!selectedProfile.wallet?.wallet_address || isPending}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          {!isValidAddress && walletAddress && (
            <p className="text-sm text-destructive">
              Please enter a valid Ethereum address
            </p>
          )}
          <Button
            onClick={handleUpdateWalletAddress}
            disabled={
              isPending ||
              walletAddress === selectedProfile.wallet?.wallet_address ||
              !isValidAddress
            }
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            {isPending ? "Updating..." : "Update Wallet Address"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
