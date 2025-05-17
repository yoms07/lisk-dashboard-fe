import { z } from "zod";

export const ProductSchema = z.object({
  _id: z.string(),
  business_profile_id: z.string(),
  item_name: z.string(),
  item_description: z.string(),
  category: z.string(),
  unit_price: z.string(),
  unit_currency: z.string(),
  sku: z.string(),
  stock: z.number().optional(),
  image_url: z.string(),
  metadata: z.record(z.any()),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CreateProductSchema = ProductSchema.omit({
  _id: true,
  business_profile_id: true,
  is_active: true,
  created_at: true,
  updated_at: true,
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
