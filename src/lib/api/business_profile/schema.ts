import { z } from "zod";

export class UnauthorizedError extends Error {
  status: number;
  errorType: string;

  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.status = 401;
    this.errorType = "UNAUTHORIZED";
  }
}

export const walletSchema = z
  .object({
    wallet_address: z.string(),
    wallet_type: z.string(),
    is_primary: z.boolean(),
  })
  .nullable();

export const apiKeySchema = z.object({
  is_active: z.boolean(),
  last_used_at: z.string().nullable(),
  api_key: z.string(),
});

export const businessProfileSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  business_name: z.string(),
  webhook_url: z.string(),
  webhook_secret: z.string(),
  logo_url: z.string(),
  business_description: z.string(),
  contact_email: z.string(),
  contact_phone: z.string(),
  wallet: walletSchema,
  api_key: apiKeySchema,
  checkout_customization: z.any().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const businessProfilesResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(businessProfileSchema),
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;
export type BusinessProfilesResponse = z.infer<
  typeof businessProfilesResponseSchema
>;

export interface CheckoutUiCustomization {
  primaryColor: string;
  topBarColor: string;
  topBarTextColor: string;
  secondaryColor: string;
  borderRadius: string;
  overlayColor: string;
  bottomBarColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  _id?: string;
}
