import { z } from "zod";

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
  metadata: z.object({
    order_id: z.string(),
    customer_name: z.string(),
    product_name: z.string(),
  }),
  pricing: z.object({
    local: z.object({
      amount: z.string(),
      asset: z.object({
        type: z.string(),
        address: z.string(),
        chainId: z.number(),
        decimals: z.number(),
      }),
    }),
  }),
  items: z.array(z.any()),
  expired_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
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
