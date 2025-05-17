"use client";
import React, { useState } from "react";
import { usePayments } from "@/lib/hooks/usePayments";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  IconDownload,
  IconCopy,
  IconPlus,
  IconExternalLink,
  IconInfoCircle,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { useRouter } from "next/navigation";
import { WalletReminder } from "@/components/wallet-reminder";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment } from "@/lib/api/payments/schema";

export default function PaymentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const { getSelectedProfileId } = useBusinessProfileStore();
  const businessProfileId = getSelectedProfileId();

  const { data, isLoading, error } = usePayments(
    businessProfileId || "",
    10,
    page
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleDownloadCSV = () => {
    if (!data?.data.data) return;

    const headers = [
      "ID",
      "External ID",
      "Status",
      "Amount",
      "Customer",
      "Date",
      "Checkout Link",
    ];
    const rows = data.data.data.map((payment) => [
      payment.id,
      payment.external_id,
      payment.status,
      formatCurrency(payment.pricing.local.amount),
      payment.customer.name,
      formatDate(payment.created_at),
      `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/payments/${payment.payment_id}`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading payments</div>;
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Payments"
        description="View and manage your payment history"
        action={{
          label: "CSV",
          icon: <IconDownload className="h-4 w-4" />,
          onClick: handleDownloadCSV,
        }}
        secondaryAction={{
          label: "Create Payment Link",
          icon: <IconPlus className="h-4 w-4" />,
          onClick: () => {
            router.push(`/dashboard/payments/create`);
          },
        }}
      />

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by external ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-xs border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>External ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Checkout Link</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.data
              .filter(
                (payment) =>
                  !search ||
                  payment.external_id
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
              )
              .map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.payment_id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.external_id}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-muted/50"
                        onClick={() => handleCopy(payment.external_id || "")}
                      >
                        <IconCopy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(payment.pricing.local.amount)}
                  </TableCell>
                  <TableCell>{payment.customer.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {payment.source}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(payment.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-muted/50"
                        onClick={() =>
                          handleCopy(
                            `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/payments/${payment.payment_id}`
                          )
                        }
                      >
                        <IconCopy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-muted/50"
                        onClick={() =>
                          window.open(
                            `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/payments/${payment.payment_id}`,
                            "_blank"
                          )
                        }
                      >
                        <IconExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-muted/50"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <IconInfoCircle className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {(data?.data.pagination?.hasPreviousPage ||
        data?.data.pagination?.hasNextPage) && (
        <div className="flex justify-center gap-2">
          {data?.data.pagination?.hasPreviousPage && (
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
          )}
          {data?.data.pagination?.hasNextPage && (
            <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          )}
        </div>
      )}

      <Dialog
        open={!!selectedPayment}
        onOpenChange={() => setSelectedPayment(null)}
      >
        <DialogContent className="max-w-2xl rounded-xs">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Basic Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Payment ID:</span>{" "}
                      {selectedPayment.payment_id}
                    </p>
                    <p>
                      <span className="font-medium">External ID:</span>{" "}
                      {selectedPayment.external_id}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <Badge variant={getStatusVariant(selectedPayment.status)}>
                        {selectedPayment.status}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span>{" "}
                      {formatCurrency(selectedPayment.pricing.local.amount)}
                    </p>
                    <p>
                      <span className="font-medium">Source:</span>{" "}
                      <Badge variant="outline" className="capitalize">
                        {selectedPayment.source}
                      </Badge>
                    </p>
                    <p>
                      <span className="font-medium">Created At:</span>{" "}
                      {formatDate(selectedPayment.created_at)}
                    </p>
                    {(() => {
                      const txHash = selectedPayment.txHash;
                      console.log(txHash);
                      if (!txHash) return null;
                      return (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Transaction Hash:</span>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm">
                              {txHash.slice(0, 10)}...{txHash.slice(-10)}
                            </code>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleCopy(txHash)}
                            >
                              <IconCopy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                window.open(
                                  `https://blockscout.lisk.com/tx/${txHash}`,
                                  "_blank"
                                )
                              }
                            >
                              <IconExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Customer Information</h3>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedPayment.customer.name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedPayment.customer.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedPayment.customer.phone}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Checkout Link</h3>
                <div className="flex items-center gap-2">
                  <Input
                    value={`${process.env.NEXT_PUBLIC_CHECKOUT_URL}/payments/${selectedPayment.payment_id}`}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleCopy(
                        `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/payments/${selectedPayment.payment_id}`
                      )
                    }
                  >
                    <IconCopy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      window.open(
                        `${process.env.NEXT_PUBLIC_CHECKOUT_URL}/payments/${selectedPayment.payment_id}`,
                        "_blank"
                      )
                    }
                  >
                    <IconExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <WalletReminder />
    </div>
  );
}
