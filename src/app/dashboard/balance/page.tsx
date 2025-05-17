"use client";

import { Main } from "@/components/layout/main";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ExternalLink, Wallet } from "lucide-react";
import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { useBalance } from "wagmi";
import { formatUnits } from "viem";

// IDRX token address on Lisk
const IDRX_TOKEN_ADDRESS = "0x18Bc5bcC660cf2B9cE3cd51a404aFe1a0cBD3C22";
const IDRX_DECIMALS = 2;

export default function BalancePage() {
  const router = useRouter();
  const { selectedProfile } = useBusinessProfileStore();

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: selectedProfile?.wallet?.wallet_address as
      | `0x${string}`
      | undefined,
    token: IDRX_TOKEN_ADDRESS as `0x${string}`,
  });

  const formattedBalance = balance
    ? formatUnits(balance.value, IDRX_DECIMALS)
    : "0.00";

  return (
    <Main>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Balance</h1>
      </div>

      <div className="grid gap-4">
        {/* Wallet Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="rounded bg-muted px-2 py-1 text-sm">
                  {selectedProfile?.wallet?.wallet_address ||
                    "No wallet address set"}
                </code>
                {selectedProfile?.wallet?.wallet_address && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        selectedProfile?.wallet?.wallet_address || ""
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">IDRX Balance</p>
              <p className="text-2xl font-bold">
                {isBalanceLoading ? "Loading..." : `${formattedBalance} IDRX`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/settings/wallet")}
              >
                Change Wallet Address
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(
                    "https://docs.idrx.co/services/redeem-idrx",
                    "_blank"
                  )
                }
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Redeem IDRX
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About Your Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your IDRX balance is displayed above, reflecting your holdings
                on the Lisk blockchain. All incoming payments will be directed
                to this wallet address. To modify your wallet address, please
                navigate to the wallet settings page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Redeeming IDRX</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                For IDRX redemption, please visit our official documentation. We
                strongly recommend using established third-party wallets such as
                MetaMask or Xellar Passport to ensure a secure and seamless
                redemption process.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
}
