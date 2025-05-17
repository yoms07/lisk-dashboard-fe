import { useState } from "react";
import { useCreateProduct } from "@/lib/hooks/useCreateProduct";
import { CreateProductRequest } from "@/lib/api/products/schema";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateProductOverlayProps {
  businessProfileId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateProductOverlay({
  businessProfileId,
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateProductOverlayProps) {
  const [createForm, setCreateForm] = useState<CreateProductRequest>({
    item_name: "",
    item_description: "",
    category: "",
    unit_price: "",
    unit_currency: "IDR",
    sku: "",
    stock: 0,
    image_url: "",
    metadata: {},
  });

  const { mutate: createProduct, isPending: isCreating } =
    useCreateProduct(businessProfileId);

  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : value,
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct(createForm, {
      onSuccess: () => {
        onOpenChange(false);
        setCreateForm({
          item_name: "",
          item_description: "",
          category: "",
          unit_price: "",
          unit_currency: "IDR",
          sku: "",
          stock: undefined,
          image_url: "",
          metadata: {},
        });
        toast.success("Product created");
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md h-full right-0 top-0 border-border">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b border-border">
            <SheetTitle>Add New Product</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleCreateSubmit}
            className="flex-1 overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              <Input
                name="item_name"
                placeholder="Name"
                value={createForm.item_name}
                onChange={handleCreateChange}
                required
              />
              <Textarea
                name="item_description"
                placeholder="Description"
                value={createForm.item_description}
                onChange={handleCreateChange}
                required
              />
              <Input
                name="category"
                placeholder="Category"
                value={createForm.category}
                onChange={handleCreateChange}
                required
              />
              <Input
                name="unit_price"
                placeholder="Price (IDR)"
                type="number"
                value={createForm.unit_price}
                onChange={handleCreateChange}
                required
              />
              <Input
                name="sku"
                placeholder="SKU"
                value={createForm.sku}
                onChange={handleCreateChange}
                required
              />
              <Label className="mb-1">Stock (optional)</Label>
              <Input
                name="stock"
                placeholder="Stock"
                type="number"
                value={createForm.stock}
                onChange={handleCreateChange}
                required
              />
              {/* Metadata can be added as needed */}
            </div>
            <SheetFooter className="px-6 py-4 border-t border-border">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
