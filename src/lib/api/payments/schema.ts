import { z } from "zod";

const pricingSchema = z.object({
  local: z.object({
    amount: z.string(),
    asset: z.object({
      type: z.string(),
      address: z.string(),
      chainId: z.number(),
      decimals: z.number(),
    }),
  }),
});

export const PaymentSchema = z.object({
  id: z.string(),
  business_profile_id: z.string(),
  payment_id: z.string(),
  external_id: z.string(),
  status: z.string(),
  success_redirect_url: z.string(),
  failure_redirect_url: z.string(),
  customer: z.object({
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
    source: z.string(),
  }),
  metadata: z.record(z.any()).optional(),
  pricing: pricingSchema,
  items: z.array(
    z.object({
      item_id: z.string(),
      name: z.string(),
      description: z.string(),
      quantity: z.number(),
      unit_price: z.string(),
      unit_currency: z.literal("IDR"),
    })
  ),
  expired_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  source: z.string(),
});

export const PaginationSchema = z.object({
  itemCount: z.number(),
  itemsPerPage: z.number(),
  currentPage: z.number(),
  total: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const PaymentResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    data: z.array(PaymentSchema),
    pagination: PaginationSchema,
  }),
});

export type Payment = z.infer<typeof PaymentSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;

const customerSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    source: z.enum(["business", "customer"]),
  })
  .refine(
    (data) => {
      if (data.source === "business") {
        return !!(data.name && data.email && data.address && data.phone);
      }
      return true;
    },
    {
      message:
        "Name, email, address, and phone are required when source is business",
    }
  );

const createPricingSchema = z.object({
  amount: z.string(),
  currency: z.string(),
});

const itemSchema = z.object({
  item_id: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number().int().positive(),
  unit_price: z.string(),
  unit_currency: z.literal("IDR"),
});

export const createPaymentLinkSchema = z.object({
  external_id: z.string(),
  success_redirect_url: z.string().url().optional(),
  failure_redirect_url: z.string().url().optional(),
  description: z.string().optional(),
  customer: customerSchema,
  metadata: z.record(z.any()).optional(),
  pricing: createPricingSchema,
  source: z.enum(["api", "dashboard", "checkout_link"]).optional(),
  items: z.array(itemSchema).optional(),
});

export type CreatePaymentLinkRequest = z.infer<typeof createPaymentLinkSchema>;

export interface AssetDto {
  type: string;
  address: string;
  chainId: number;
  decimals: number;
}

export interface CustomerDto {
  name: string;
  email: string;
  address: string;
  phone: string;
  source: "business" | "customer";
}

export interface CheckoutCustomizationDto {
  primaryColor?: string;
  topBarColor?: string;
  topBarTextColor?: string;
  secondaryColor?: string;
  borderRadius?: string;
  overlayColor?: string;
  bottomBarColor?: string;
  primaryTextColor?: string;
  secondaryTextColor?: string;
}

export interface ItemDto {
  item_id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: string;
  unit_currency: "IDR";
}

export interface PaymentLinkDto {
  id: string;
  business_profile_id: string;
  payment_id: string;
  external_id: string;
  status: string;
  success_redirect_url?: string;
  failure_redirect_url?: string;
  customer?: CustomerDto;
  metadata?: Record<string, unknown>;
  pricing: {
    local: {
      amount: string;
      asset: AssetDto;
    };
  };
  source: string;
  items: ItemDto[];
  expired_at: Date;
  created_at: Date;
  updated_at: Date;
  checkout_customization?: CheckoutCustomizationDto;
}
