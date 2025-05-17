import { Product } from "@/lib/api/products/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreVertical, Pencil, Trash } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  console.log(product);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{product.item_name}</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500"
              onClick={() => onDelete(product)}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <p className="text-sm mb-2">{product.item_description}</p>
        <p className="font-bold mb-2">
          {Number(product.unit_price).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </p>
        <p className="text-xs text-gray-400 mb-2">Stock: {product.stock}</p>
      </CardContent>
    </Card>
  );
}
