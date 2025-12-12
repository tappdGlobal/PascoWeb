import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Calculator, Car, Plus, Trash2, Download } from "lucide-react";
import { Job } from "./BodyshopDataContext";
import { toast } from "sonner@2.0.3";

interface EstimateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

interface PartItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface SelectedItem {
  part: PartItem;
  quantity: number;
}

interface ServiceItem {
  name: string;
  price: number;
  selected: boolean;
}

export function EstimateDialog({ open, onOpenChange, job }: EstimateDialogProps) {
  const [selectedParts, setSelectedParts] = useState<SelectedItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([
    { name: "Paint Work", price: 15000, selected: false },
    { name: "Dent Repair", price: 8000, selected: false },
    { name: "Full Body Paint", price: 35000, selected: false },
    { name: "Polishing", price: 5000, selected: false },
    { name: "Detailing", price: 3000, selected: false },
    { name: "Windshield Replacement", price: 12000, selected: false },
    { name: "Bumper Repair", price: 6000, selected: false },
    { name: "Door Panel Repair", price: 7000, selected: false },
  ]);
  const [labourCharge, setLabourCharge] = useState(5000);
  const [discount, setDiscount] = useState(0);

  // Parts database (would come from Excel/API in production)
  const partsDatabase: PartItem[] = [
    { id: "1", name: "Engine Oil (5W-30)", price: 1500, category: "Fluids" },
    { id: "2", name: "Brake Pads (Front)", price: 1750, category: "Brake System" },
    { id: "3", name: "Brake Pads (Rear)", price: 1500, category: "Brake System" },
    { id: "4", name: "Air Filter", price: 600, category: "Filters" },
    { id: "5", name: "Oil Filter", price: 350, category: "Filters" },
    { id: "6", name: "Spark Plugs (Set of 4)", price: 1000, category: "Ignition" },
    { id: "7", name: "Coolant (1L)", price: 450, category: "Fluids" },
    { id: "8", name: "Paint - White (5L)", price: 6000, category: "Paint" },
    { id: "9", name: "Paint - Black (5L)", price: 6000, category: "Paint" },
    { id: "10", name: "Paint - Silver (5L)", price: 6500, category: "Paint" },
    { id: "11", name: "Headlight Bulb (LED)", price: 1200, category: "Electrical" },
    { id: "12", name: "Taillight Assembly", price: 2500, category: "Electrical" },
    { id: "13", name: "Wiper Blades (Pair)", price: 800, category: "Accessories" },
    { id: "14", name: "Battery", price: 8500, category: "Electrical" },
    { id: "15", name: "Windshield", price: 12000, category: "Glass" },
    { id: "16", name: "Side Mirror (Left)", price: 2800, category: "Accessories" },
    { id: "17", name: "Side Mirror (Right)", price: 2800, category: "Accessories" },
    { id: "18", name: "Bumper (Front)", price: 8000, category: "Body Parts" },
    { id: "19", name: "Bumper (Rear)", price: 7500, category: "Body Parts" },
    { id: "20", name: "Door Panel", price: 9000, category: "Body Parts" },
  ];

  const [selectedPartId, setSelectedPartId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddPart = () => {
    const part = partsDatabase.find(p => p.id === selectedPartId);
    if (part && quantity > 0) {
      setSelectedParts([...selectedParts, { part, quantity }]);
      setSelectedPartId("");
      setQuantity(1);
      toast.success(`${part.name} added to estimate`);
    }
  };

  const handleRemovePart = (index: number) => {
    const updated = selectedParts.filter((_, i) => i !== index);
    setSelectedParts(updated);
    toast.success("Part removed");
  };

  const toggleService = (index: number) => {
    const updated = [...services];
    updated[index].selected = !updated[index].selected;
    setServices(updated);
  };

  // Calculate totals
  const partsTotal = selectedParts.reduce((sum, item) => sum + (item.part.price * item.quantity), 0);
  const servicesTotal = services.filter(s => s.selected).reduce((sum, s) => sum + s.price, 0);
  const subtotal = partsTotal + servicesTotal + labourCharge;
  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const gst = (afterDiscount * 18) / 100;
  const grandTotal = afterDiscount + gst;

  const handleGenerateBill = () => {
    const bill = `
PASCO BODYSHOP - ESTIMATE
==========================
Job Card: ${job?.jobCardNumber}
Date: ${new Date().toLocaleDateString()}

VEHICLE DETAILS
---------------
Model: ${job?.vehicleModel}
Registration: ${job?.vehicleRegNo}

CUSTOMER DETAILS
----------------
Name: ${job?.customerName}
Phone: ${job?.customerPhone}

PARTS
-----
${selectedParts.map(item => `${item.part.name} x ${item.quantity} @ ₹${item.part.price} = ₹${item.part.price * item.quantity}`).join('\n')}

Parts Subtotal: ₹${partsTotal.toLocaleString()}

SERVICES
--------
${services.filter(s => s.selected).map(s => `${s.name} = ₹${s.price}`).join('\n')}

Services Subtotal: ₹${servicesTotal.toLocaleString()}

Labour Charges: ₹${labourCharge.toLocaleString()}

CALCULATION
-----------
Subtotal: ₹${subtotal.toLocaleString()}
Discount (${discount}%): -₹${discountAmount.toLocaleString()}
After Discount: ₹${afterDiscount.toLocaleString()}
GST (18%): +₹${gst.toLocaleString()}

GRAND TOTAL: ₹${grandTotal.toLocaleString()}

==========================
Generated by PASCO Bodyshop Management System
    `.trim();

    const blob = new Blob([bill], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Estimate_${job?.jobCardNumber}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Estimate generated and downloaded!");
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-green-600" />
            Generate Estimate
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job Card Info */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{job.jobCardNumber}</p>
                <p className="text-sm text-gray-600">{job.vehicleModel} • {job.vehicleRegNo}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">Customer</p>
                <p className="font-semibold">{job.customerName}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Parts Selection */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                    <span className="text-xs text-blue-600">1</span>
                  </div>
                  Select Parts
                </h3>
                
                <div className="space-y-2">
                  <Label>Part</Label>
                  <Select value={selectedPartId} onValueChange={setSelectedPartId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a part" />
                    </SelectTrigger>
                    <SelectContent>
                      {partsDatabase.map(part => (
                        <SelectItem key={part.id} value={part.id}>
                          {part.name} - ₹{part.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  />
                </div>

                <Button onClick={handleAddPart} className="w-full" disabled={!selectedPartId}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Part
                </Button>

                {selectedParts.length > 0 && (
                  <div className="space-y-2 pt-3 border-t">
                    <p className="text-sm font-semibold">Selected Parts:</p>
                    {selectedParts.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                        <div className="flex-1">
                          <p className="font-medium">{item.part.name}</p>
                          <p className="text-xs text-gray-600">
                            {item.quantity} x ₹{item.part.price} = ₹{item.part.price * item.quantity}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemovePart(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Labour and Discount */}
              <div className="p-4 border border-gray-200 rounded-xl space-y-3">
                <div className="space-y-2">
                  <Label>Labour Charges (₹)</Label>
                  <Input
                    type="number"
                    value={labourCharge}
                    onChange={(e) => setLabourCharge(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Services & Bill */}
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-xl space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center">
                    <span className="text-xs text-purple-600">2</span>
                  </div>
                  Select Services
                </h3>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {services.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={service.selected}
                          onCheckedChange={() => toggleService(index)}
                        />
                        <div>
                          <p className="text-sm font-medium">{service.name}</p>
                          <p className="text-xs text-gray-600">₹{service.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Summary */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl space-y-2">
                <h3 className="font-semibold text-green-900 mb-3">Bill Summary</h3>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Parts Total:</span>
                    <span className="font-semibold">₹{partsTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Services Total:</span>
                    <span className="font-semibold">₹{servicesTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labour Charges:</span>
                    <span className="font-semibold">₹{labourCharge.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-green-200">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount ({discount}%):</span>
                      <span className="font-semibold">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span className="font-semibold">+₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-green-300 text-lg">
                    <span className="font-bold text-green-900">Grand Total:</span>
                    <span className="font-bold text-green-600">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
              onClick={handleGenerateBill}
              disabled={selectedParts.length === 0 && services.filter(s => s.selected).length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Generate & Download Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
