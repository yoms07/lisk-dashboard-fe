"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { useCreatePaymentLink } from "@/lib/hooks/useCreatePaymentLink";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconInfoCircle,
} from "@tabler/icons-react";
import { CreatePaymentLinkRequest, ItemDto } from "@/lib/api/payments/schema";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreatePaymentLinkPage() {
  const router = useRouter();
  const { getSelectedProfileId } = useBusinessProfileStore();
  const businessProfileId = getSelectedProfileId();
  const { mutate: createLink, isPending } = useCreatePaymentLink(
    businessProfileId || ""
  );

  const [collectCustomerInfo, setCollectCustomerInfo] = useState(true);
  const [items, setItems] = useState<ItemDto[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<ItemDto>>({
    name: "",
    description: "",
    quantity: 1,
    unit_price: "",
    unit_currency: "IDR",
  });

  const [formData, setFormData] = useState<CreatePaymentLinkRequest>({
    external_id: "",
    customer: {
      name: "",
      email: "",
      address: "",
      phone: "",
      source: "customer",
    },
    pricing: {
      amount: "",
      currency: "IDR",
    },
    items: [],
  });

  // Format number with thousand separators
  const formatNumberWithSeparator = (value: string) => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add thousand separators
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Parse formatted number back to string
  const parseFormattedNumber = (value: string) => {
    return value.replace(/\./g, "");
  };

  // Update customer source when collectCustomerInfo changes
  const handleCollectCustomerInfoChange = (checked: boolean) => {
    setCollectCustomerInfo(checked);
    setFormData((prev) => ({
      ...prev,
      customer: {
        ...prev.customer,
        source: checked ? "customer" : "business",
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Parse the formatted amount before submitting
    const submitData = {
      ...formData,
      pricing: {
        ...formData.pricing,
        amount: parseFormattedNumber(formData.pricing.amount),
      },
    };
    createLink(submitData, {
      onSuccess: () => {
        router.push("/dashboard/payments");
      },
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section?: "customer" | "pricing"
  ) => {
    const { name, value } = e.target;
    if (section) {
      if (section === "pricing" && name === "amount") {
        // Format the amount with separators
        const formattedValue = formatNumberWithSeparator(value);
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: formattedValue,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [section]: {
            ...prev[section],
            [name]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentItem((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? parseInt(value) || 1
          : name === "unit_price"
          ? formatNumberWithSeparator(value)
          : value,
    }));
  };

  const addItem = () => {
    if (!currentItem.name || !currentItem.unit_price) return;

    const newItem: ItemDto = {
      item_id: crypto.randomUUID(),
      name: currentItem.name,
      description: currentItem.description || "",
      quantity: currentItem.quantity || 1,
      unit_price: parseFormattedNumber(currentItem.unit_price),
      unit_currency: "IDR",
    };

    setItems((prev) => [...prev, newItem]);
    setFormData((prev) => {
      const newItems = [...(prev.items || []), newItem];
      // Calculate total price from items
      const totalPrice = newItems.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0
      );
      return {
        ...prev,
        items: newItems,
        pricing: {
          ...prev.pricing,
          amount: formatNumberWithSeparator(totalPrice.toString()),
        },
      };
    });

    // Reset current item
    setCurrentItem({
      name: "",
      description: "",
      quantity: 1,
      unit_price: "",
      unit_currency: "IDR",
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.item_id !== itemId));
    setFormData((prev) => {
      const newItems = (prev.items || []).filter(
        (item) => item.item_id !== itemId
      );
      // Recalculate total price after removing item
      const totalPrice = newItems.reduce(
        (sum, item) => sum + Number(item.unit_price) * item.quantity,
        0
      );
      return {
        ...prev,
        items: newItems,
        pricing: {
          ...prev.pricing,
          amount: formatNumberWithSeparator(totalPrice.toString()),
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Create Payment Link"
        description="Create a new payment link for your customers"
        action={{
          label: "Back",
          icon: <IconArrowLeft className="h-4 w-4" />,
          onClick: () => router.back(),
        }}
      />

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* External ID */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="external_id">External ID</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>External ID must be unique for each payment link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="external_id"
              name="external_id"
              value={formData.external_id}
              onChange={handleChange}
              placeholder="e.g., order-123"
              required
            />
          </div>

          {/* Customer Information Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="collect-customer-info">
              Collect Customer Information
            </Label>
            <Switch
              id="collect-customer-info"
              checked={collectCustomerInfo}
              onCheckedChange={handleCollectCustomerInfoChange}
            />
          </div>

          {/* Customer Information */}
          {!collectCustomerInfo ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer.name">Name</Label>
                  <Input
                    id="customer.name"
                    name="name"
                    value={formData.customer.name}
                    onChange={(e) => handleChange(e, "customer")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.email">Email</Label>
                  <Input
                    id="customer.email"
                    name="email"
                    type="email"
                    value={formData.customer.email}
                    onChange={(e) => handleChange(e, "customer")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.phone">Phone</Label>
                  <Input
                    id="customer.phone"
                    name="phone"
                    value={formData.customer.phone}
                    onChange={(e) => handleChange(e, "customer")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer.address">Address</Label>
                  <Input
                    id="customer.address"
                    name="address"
                    value={formData.customer.address}
                    onChange={(e) => handleChange(e, "customer")}
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                Customer information will be collected during the payment
                process.
              </p>
            </div>
          )}

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Items</h3>
              <Badge variant="secondary">Optional</Badge>
            </div>
            <div className="space-y-4">
              {/* Add Item Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    name="name"
                    value={currentItem.name}
                    onChange={handleItemChange}
                    placeholder="Product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-price">Unit Price (IDR)</Label>
                  <Input
                    id="item-price"
                    name="unit_price"
                    type="text"
                    inputMode="numeric"
                    value={currentItem.unit_price}
                    onChange={handleItemChange}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-quantity">Quantity</Label>
                  <Input
                    id="item-quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={currentItem.quantity}
                    onChange={handleItemChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-description">
                    Description (Optional)
                  </Label>
                  <Input
                    id="item-description"
                    name="description"
                    value={currentItem.description}
                    onChange={handleItemChange}
                    placeholder="Product description"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addItem}
                disabled={!currentItem.name || !currentItem.unit_price}
              >
                <IconPlus className="h-4 w-4 mr-2" />
                Add Item
              </Button>

              {/* Items List */}
              {items.length > 0 && (
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.item_id}
                      className="flex items-center justify-between px-2 py-1 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x{" "}
                          {formatNumberWithSeparator(item.unit_price)} IDR
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.item_id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <IconInfoCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Pricing will be automatically updated whenever items are
                      updated. Please check regularly.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricing.amount">Amount (IDR)</Label>
                <Input
                  id="pricing.amount"
                  name="amount"
                  type="text"
                  inputMode="numeric"
                  value={formData.pricing.amount}
                  onChange={(e) => handleChange(e, "pricing")}
                  required
                />
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Optional Fields</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="success_redirect_url">
                  Success Redirect URL
                </Label>
                <Input
                  id="success_redirect_url"
                  name="success_redirect_url"
                  type="url"
                  value={formData.success_redirect_url || ""}
                  onChange={handleChange}
                  placeholder="https://your-domain.com/success"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="failure_redirect_url">
                  Failure Redirect URL
                </Label>
                <Input
                  id="failure_redirect_url"
                  name="failure_redirect_url"
                  type="url"
                  value={formData.failure_redirect_url || ""}
                  onChange={handleChange}
                  placeholder="https://your-domain.com/failure"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  placeholder="Payment for Order #123"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Payment Link"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
