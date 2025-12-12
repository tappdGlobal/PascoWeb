import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Package, Search, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface InventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryDialog({ open, onOpenChange }: InventoryDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const inventoryItems = [
    { 
      name: "Engine Oil (5W-30)", 
      quantity: 3, 
      minRequired: 10, 
      price: "₹1,500",
      category: "Fluids",
      supplier: "Castrol",
      status: "critical"
    },
    { 
      name: "Brake Pads (Premium)", 
      quantity: 5, 
      minRequired: 15, 
      price: "₹1,750",
      category: "Brake System",
      supplier: "Bosch",
      status: "low"
    },
    { 
      name: "Air Filters", 
      quantity: 4, 
      minRequired: 12, 
      price: "₹600",
      category: "Filters",
      supplier: "Mann Filter",
      status: "low"
    },
    { 
      name: "Paint - White (5L)", 
      quantity: 2, 
      minRequired: 8, 
      price: "₹6,000",
      category: "Paint",
      supplier: "Nippon Paint",
      status: "critical"
    },
    { 
      name: "Spark Plugs", 
      quantity: 24, 
      minRequired: 20, 
      price: "₹250",
      category: "Ignition",
      supplier: "NGK",
      status: "good"
    },
    { 
      name: "Coolant (1L)", 
      quantity: 18, 
      minRequired: 15, 
      price: "₹450",
      category: "Fluids",
      supplier: "Castrol",
      status: "good"
    },
    { 
      name: "Polishing Compound", 
      quantity: 8, 
      minRequired: 10, 
      price: "₹850",
      category: "Detailing",
      supplier: "3M",
      status: "low"
    },
    { 
      name: "Headlight Bulbs (LED)", 
      quantity: 15, 
      minRequired: 12, 
      price: "₹1,200",
      category: "Electrical",
      supplier: "Philips",
      status: "good"
    },
  ];

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "low":
        return <TrendingDown className="w-4 h-4 text-orange-600" />;
      case "good":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-700";
      case "low":
        return "bg-orange-100 text-orange-700";
      case "good":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleOrder = (itemName: string) => {
    toast.success(`Order placed for ${itemName}`);
  };

  const criticalCount = inventoryItems.filter(i => i.status === "critical").length;
  const lowCount = inventoryItems.filter(i => i.status === "low").length;
  const totalValue = inventoryItems.reduce((sum, item) => {
    const price = parseInt(item.price.replace(/[₹,]/g, ''));
    return sum + (price * item.quantity);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Inventory Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-blue-600">{inventoryItems.length}</p>
              <p className="text-xs text-blue-700">Total Items</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-red-600">{criticalCount + lowCount}</p>
              <p className="text-xs text-red-700">Need Restock</p>
            </div>
            <div className="p-3 bg-green-50 rounded-xl text-center">
              <p className="text-lg font-bold text-green-600">₹{(totalValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-green-700">Total Value</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search items or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Inventory List */}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.name}
                className={`p-3 border rounded-xl ${
                  item.status === "critical" ? "border-red-300 bg-red-50" :
                  item.status === "low" ? "border-orange-300 bg-orange-50" :
                  "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(item.status)}
                      <p className="font-semibold text-sm">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>Category: {item.category}</span>
                      <span>•</span>
                      <span>Supplier: {item.supplier}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Stock: </span>
                      <span className={`font-bold ${
                        item.quantity < item.minRequired ? "text-red-600" : "text-gray-900"
                      }`}>
                        {item.quantity}
                      </span>
                      <span className="text-gray-400"> / {item.minRequired}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Price: </span>
                      <span className="font-semibold">{item.price}</span>
                    </div>
                  </div>

                  {item.status !== "good" && (
                    <Button
                      size="sm"
                      variant={item.status === "critical" ? "destructive" : "default"}
                      onClick={() => handleOrder(item.name)}
                    >
                      Order Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
