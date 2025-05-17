"use client";

import { useState } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { useUpdateProduct } from "@/lib/hooks/useUpdateProduct";
import { useDeleteProduct } from "@/lib/hooks/useDeleteProduct";
import { useBusinessProfileStore } from "@/lib/store/business-profile";
import { Product } from "@/lib/api/products/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ProductCard } from "@/components/products/product-card";
import { CreateProductOverlay } from "@/components/products/create-product-overlay";

export default function ProductsPage() {
  const businessProfileId =
    useBusinessProfileStore((state) => state.getSelectedProfileId()) || "";
  const {
    data: products = [],
    isLoading,
    refetch,
  } = useProducts(businessProfileId);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct(
    businessProfileId,
    editProduct?._id || ""
  );
  const { mutate: deleteProductMutate, isPending: isDeleting } =
    useDeleteProduct(businessProfileId, deleteProduct?._id || "");

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setEditForm({
      item_name: product.item_name,
      item_description: product.item_description,
      unit_price: product.unit_price,
      stock: product.stock,
      image_url: product.image_url,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    updateProduct(editForm, {
      onSuccess: () => {
        setEditProduct(null);
        toast.success("Product updated");
        refetch();
      },
    });
  };

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleDeleteConfirm = () => {
    if (!deleteProduct) return;
    deleteProductMutate(undefined, {
      onSuccess: () => {
        setDeleteProduct(null);
        toast.success("Product deleted");
        refetch();
      },
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setIsCreateOpen(true)}>Add new product</Button>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="mb-4 text-lg text-gray-500">
            No products. Add your first product now
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>Add new product</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateProductOverlay
        businessProfileId={businessProfileId}
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={refetch}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              name="item_name"
              placeholder="Name"
              value={editForm.item_name || ""}
              onChange={handleEditChange}
              required
            />
            <Textarea
              name="item_description"
              placeholder="Description"
              value={editForm.item_description || ""}
              onChange={handleEditChange}
              required
            />
            <Input
              name="unit_price"
              placeholder="Price (IDR)"
              type="number"
              value={editForm.unit_price || ""}
              onChange={handleEditChange}
              required
            />
            <Input
              name="stock"
              placeholder="Stock"
              type="number"
              value={editForm.stock || 0}
              onChange={handleEditChange}
              required
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditProduct(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteProduct}
        onOpenChange={() => setDeleteProduct(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <b>{deleteProduct?.item_name}</b>?
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteProduct(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
