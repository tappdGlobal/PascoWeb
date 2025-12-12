import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Download, AlertTriangle } from "lucide-react";

interface ReportIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportIssueDialog({ open, onOpenChange }: ReportIssueDialogProps) {
  const [formData, setFormData] = useState({
    issueType: "",
    severity: "",
    location: "",
    reportedBy: "",
    description: "",
    equipmentInvolved: "",
  });

  const handleSubmit = () => {
    if (!formData.issueType || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    toast.success("Issue reported successfully!");
    onOpenChange(false);
    resetForm();
  };

  const handleExport = () => {
    const reportContent = `
PASCO BODYSHOP - ISSUE REPORT
==============================
Date: ${new Date().toLocaleString()}

ISSUE DETAILS
-------------
Type: ${formData.issueType || "N/A"}
Severity: ${formData.severity || "N/A"}
Location: ${formData.location || "N/A"}
Reported By: ${formData.reportedBy || "N/A"}
Equipment Involved: ${formData.equipmentInvolved || "N/A"}

DESCRIPTION
-----------
${formData.description || "N/A"}

STATUS
------
Status: Open
Priority: ${formData.severity === "critical" ? "High" : formData.severity === "major" ? "Medium" : "Low"}
Assigned To: Pending Assignment

==============================
PASCO Bodyshop Management System
Generated on: ${new Date().toLocaleString()}
    `.trim();

    // Create a blob and download
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Issue_Report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Issue report downloaded!");
  };

  const resetForm = () => {
    setFormData({
      issueType: "",
      severity: "",
      location: "",
      reportedBy: "",
      description: "",
      equipmentInvolved: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Report Issue
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Issue Type *</Label>
            <Select value={formData.issueType} onValueChange={(value) => setFormData({ ...formData, issueType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment-failure">Equipment Failure</SelectItem>
                <SelectItem value="safety-hazard">Safety Hazard</SelectItem>
                <SelectItem value="quality-issue">Quality Issue</SelectItem>
                <SelectItem value="process-problem">Process Problem</SelectItem>
                <SelectItem value="inventory-shortage">Inventory Shortage</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Severity *</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical - Immediate Action Required</SelectItem>
                <SelectItem value="major">Major - Affects Operations</SelectItem>
                <SelectItem value="minor">Minor - Can Wait</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="e.g., Bay 3, Paint Booth, Reception"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Reported By</Label>
            <Input
              placeholder="Your name"
              value={formData.reportedBy}
              onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Equipment/Vehicle Involved</Label>
            <Input
              placeholder="e.g., Spray Gun, Lift #2, Customer Vehicle"
              value={formData.equipmentInvolved}
              onChange={(e) => setFormData({ ...formData, equipmentInvolved: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} className="flex-1">
              Submit Issue
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
