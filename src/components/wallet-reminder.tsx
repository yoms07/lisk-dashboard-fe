"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBusinessProfileStore } from "@/lib/store/business-profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function WalletReminder() {
  const { selectedProfile } = useBusinessProfileStore();
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedProfile && !selectedProfile.wallet?.wallet_address) {
      setShowWalletDialog(true);
    }
  }, [selectedProfile]);

  const handleSetWallet = () => {
    setShowWalletDialog(false);
    router.push("/dashboard/settings/wallet");
  };

  return (
    <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wallet Address Required</DialogTitle>
          <DialogDescription>
            To receive payments and manage your IDRX balance, you need to set up
            your wallet address first. This is where all your payments will be
            directed.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={handleSetWallet}>Set my wallet address</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
