import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useBodyshopData, JobType, JobStatus } from "./BodyshopDataContext";
import { toast } from "sonner@2.0.3";
import { CalendarIcon, Search, Phone } from "lucide-react";
import { cn } from "./ui/utils";

interface NewJobRequestProps {
  onSuccess: () => void;
}

// Mock vehicle data for search
const mockVehicleData: { [key: string]: { model: string; vin: string; color: string; fuelType: string; year: string } } = {
  "HR26DK8877": {
    model: "Maruti Suzuki Swift VXi",
    vin: "MA3ERLF1S00234567",
    color: "Pearl White",
    fuelType: "Petrol",
    year: "2022"
  },
  "DL8CAF9356": {
    model: "Hyundai i20 Sportz",
    vin: "MALH11BAXM1234567",
    color: "Fiery Red",
    fuelType: "Diesel",
    year: "2021"
  }
};

export function NewJobRequest({ onSuccess }: NewJobRequestProps) {
  const { addJob } = useBodyshopData();
  const [searching, setSearching] = useState(false);

  // Form state
  const [regNo, setRegNo] = useState("");
  const [model, setModel] = useState("");
  const [vin, setVin] = useState("");
  const [color, setColor] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [year, setYear] = useState("");
  const [kmsDriven, setKmsDriven] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [jobType, setJobType] = useState<JobType>("Cash");
  const [advisor, setAdvisor] = useState("");
  const [technician, setTechnician] = useState("");
  const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
  const [estimatedCompletion, setEstimatedCompletion] = useState<Date | undefined>(undefined);
  
  // Insurance fields
  const [insuranceCompany, setInsuranceCompany] = useState("");
  const [claimNumber, setClaimNumber] = useState("");
  const [surveyorName, setSurveyorName] = useState("");
  const [approvedAmount, setApprovedAmount] = useState("");

  const handleSearchVehicle = () => {
    setSearching(true);
    setTimeout(() => {
      const vehicleData = mockVehicleData[regNo.toUpperCase()];
      if (vehicleData) {
        setModel(vehicleData.model);
        setVin(vehicleData.vin);
        setColor(vehicleData.color);
        setFuelType(vehicleData.fuelType);
        setYear(vehicleData.year);
        toast.success("Vehicle details loaded");
      } else {
        toast.info("Vehicle not found. Please enter details manually.");
      }
      setSearching(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regNo || !model || !customerName || !customerMobile || !advisor) {
      toast.error("Please fill all required fields");
      return;
    }

    addJob({
      regNo: regNo.toUpperCase(),
      model,
      vin,
      color,
      fuelType,
      year,
      kmsDriven,
      customerName,
      customerMobile,
      jobType,
      advisor,
      technician,
      estimatedCompletion,
      arrivalDate,
      insuranceCompany: jobType === "Insurance" ? insuranceCompany : undefined,
      claimNumber: jobType === "Insurance" ? claimNumber : undefined,
      surveyorName: jobType === "Insurance" ? surveyorName : undefined,
      approvedAmount: jobType === "Insurance" && approvedAmount ? parseFloat(approvedAmount) : undefined,
      status: "Service" as JobStatus,
      photos: [],
      notes: [],
      callLogs: [],
      services: [],
      followUpDate: undefined,
      interestStatus: undefined,
    });

    toast.success("Job request created successfully!");
    onSuccess();
    
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setRegNo("");
    setModel("");
    setVin("");
    setColor("");
    setFuelType("");
    setYear("");
    setKmsDriven("");
    setCustomerName("");
    setCustomerMobile("");
    setJobType("Cash");
    setAdvisor("");
    setTechnician("");
    setArrivalDate(new Date());
    setEstimatedCompletion(undefined);
    setInsuranceCompany("");
    setClaimNumber("");
    setSurveyorName("");
    setApprovedAmount("");
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Select date";
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Vehicle Regd. No *</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="HR26DK8877"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleSearchVehicle}
                disabled={!regNo || searching}
                variant="outline"
              >
                <Search className="w-4 h-4 mr-2" />
                {searching ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>

          <div>
            <Label>Model *</Label>
            <Input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Maruti Suzuki Swift VXi"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>VIN</Label>
              <Input
                type="text"
                value={vin}
                onChange={(e) => setVin(e.target.value)}
                placeholder="MA3ERLF1S00234567"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Pearl White"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Fuel Type</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                  <SelectItem value="CNG">CNG</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year</Label>
              <Input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2022"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>KMs Driven</Label>
            <Input
              type="text"
              value={kmsDriven}
              onChange={(e) => setKmsDriven(e.target.value)}
              placeholder="15,234"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Customer Name *</Label>
            <Input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Rajesh Kumar"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Customer Mobile *</Label>
            <Input
              type="tel"
              value={customerMobile}
              onChange={(e) => setCustomerMobile(e.target.value)}
              placeholder="+91 9876543210"
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Status *</Label>
            <Select value={jobType} onValueChange={(value) => setJobType(value as JobType)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Converted">Insuranc</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Warranty">Warranty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Advisor *</Label>
            <Select value={advisor} onValueChange={setAdvisor}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select advisor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Amit Singh">Amit Singh</SelectItem>
                <SelectItem value="Sneha Verma">Sneha Verma</SelectItem>
                <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Technician</Label>
            <Select value={technician} onValueChange={setTechnician}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Suresh Yadav">Suresh Yadav</SelectItem>
                <SelectItem value="Ramesh Kumar">Ramesh Kumar</SelectItem>
                <SelectItem value="Vijay Singh">Vijay Singh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Arrival Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !arrivalDate && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDate(arrivalDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={arrivalDate}
                    onSelect={(date) => date && setArrivalDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {customerMobile && (
              <div>
                <Label>Call Customer</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-1"
                  onClick={() => {
                    window.location.href = `tel:${customerMobile}`;
                    toast.success(`Calling ${customerName}...`);
                  }}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call {customerName || "Customer"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information - Only if Insurance Job Type */}
      {jobType === "Insurance" && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-base">Insurance Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Insurance Company</Label>
              <Select value={insuranceCompany} onValueChange={setInsuranceCompany}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select insurance company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HDFC Ergo">HDFC Ergo</SelectItem>
                  <SelectItem value="ICICI Lombard">ICICI Lombard</SelectItem>
                  <SelectItem value="Bajaj Allianz">Bajaj Allianz</SelectItem>
                  <SelectItem value="Tata AIG">Tata AIG</SelectItem>
                  <SelectItem value="National Insurance">National Insurance</SelectItem>
                  <SelectItem value="New India Assurance">New India Assurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Claim Number</Label>
              <Input
                type="text"
                value={claimNumber}
                onChange={(e) => setClaimNumber(e.target.value)}
                placeholder="CLM2025001234"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Surveyor Name</Label>
              <Input
                type="text"
                value={surveyorName}
                onChange={(e) => setSurveyorName(e.target.value)}
                placeholder="Rahul Mehta"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Approved Amount</Label>
              <Input
                type="number"
                value={approvedAmount}
                onChange={(e) => setApprovedAmount(e.target.value)}
                placeholder="45000"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex gap-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={resetForm}
        >
          Reset
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-blue-900 hover:bg-blue-800"
        >
          Create Job Request
        </Button>
      </div>
    </form>
  );
}