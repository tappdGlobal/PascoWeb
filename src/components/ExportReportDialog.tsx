import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner@2.0.3";
import { Download, FileText, Calendar } from "lucide-react";
import { useBodyshopData } from "./BodyshopDataContext";

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExportReportDialog({ open, onOpenChange }: ExportReportDialogProps) {
  const { jobs } = useBodyshopData();
  const [reportType, setReportType] = useState("daily");
  const [format, setFormat] = useState("txt");
  const [includeDetails, setIncludeDetails] = useState({
    summary: true,
    jobList: true,
    revenue: true,
    team: true,
    inventory: false,
  });

  const generateDailyReport = () => {
    const today = new Date().toLocaleDateString();
    const todayJobs = jobs.filter(job => {
      const jobDate = new Date(job.createdAt).toLocaleDateString();
      return jobDate === today;
    });

    const inProgress = todayJobs.filter(j => j.status === "in-progress").length;
    const completed = todayJobs.filter(j => j.status === "completed").length;
    const totalRevenue = todayJobs.reduce((sum, job) => sum + (job.estimatedBilling || 0), 0);

    let report = `
PASCO BODYSHOP - DAILY REPORT
==============================
Date: ${new Date().toLocaleDateString()}
Generated: ${new Date().toLocaleString()}

`;

    if (includeDetails.summary) {
      report += `
SUMMARY
-------
Total Jobs Today: ${todayJobs.length}
In Progress: ${inProgress}
Completed: ${completed}
Pending: ${todayJobs.length - inProgress - completed}

`;
    }

    if (includeDetails.revenue) {
      report += `
REVENUE
-------
Today's Revenue: ₹${totalRevenue.toLocaleString()}
Average per Job: ₹${todayJobs.length > 0 ? Math.round(totalRevenue / todayJobs.length).toLocaleString() : 0}

`;
    }

    if (includeDetails.jobList && todayJobs.length > 0) {
      report += `
JOB DETAILS
-----------
`;
      todayJobs.forEach((job, index) => {
        report += `
${index + 1}. Job Card: ${job.jobCardNumber}
   Customer: ${job.customerName}
   Vehicle: ${job.vehicleModel} (${job.vehicleRegNo})
   Status: ${job.status.toUpperCase()}
   Type: ${job.jobType}
   Estimated: ₹${job.estimatedBilling?.toLocaleString()}
`;
      });
    }

    if (includeDetails.team) {
      report += `
TEAM PERFORMANCE
----------------
Active Team Members: 12
Jobs per Member (Avg): ${todayJobs.length > 0 ? (todayJobs.length / 12).toFixed(1) : 0}
Efficiency Rating: 4.7/5.0

`;
    }

    if (includeDetails.inventory) {
      report += `
INVENTORY STATUS
----------------
Parts Used Today: 24
Low Stock Items: 4
Orders Placed: 2

`;
    }

    report += `
==============================
PASCO Bodyshop Management System
`;

    return report.trim();
  };

  const generateWeeklyReport = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const weekJobs = jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      return jobDate >= weekStart;
    });

    const totalRevenue = weekJobs.reduce((sum, job) => sum + (job.estimatedBilling || 0), 0);
    const avgDailyRevenue = totalRevenue / 7;

    let report = `
PASCO BODYSHOP - WEEKLY REPORT
===============================
Period: ${weekStart.toLocaleDateString()} - ${new Date().toLocaleDateString()}
Generated: ${new Date().toLocaleString()}

SUMMARY
-------
Total Jobs This Week: ${weekJobs.length}
Completed: ${weekJobs.filter(j => j.status === "completed").length}
In Progress: ${weekJobs.filter(j => j.status === "in-progress").length}

REVENUE
-------
Total Weekly Revenue: ₹${totalRevenue.toLocaleString()}
Average Daily Revenue: ₹${Math.round(avgDailyRevenue).toLocaleString()}
Average per Job: ₹${weekJobs.length > 0 ? Math.round(totalRevenue / weekJobs.length).toLocaleString() : 0}

PERFORMANCE METRICS
-------------------
Job Completion Rate: ${weekJobs.length > 0 ? Math.round((weekJobs.filter(j => j.status === "completed").length / weekJobs.length) * 100) : 0}%
Customer Satisfaction: 4.6/5.0
Average Turnaround Time: 2.5 days

TOP SERVICES
------------
1. Paint Work (35%)
2. Dent Repair (28%)
3. Full Detailing (18%)
4. Insurance Claims (19%)

==============================
PASCO Bodyshop Management System
`;

    return report.trim();
  };

  const generateMonthlyReport = () => {
    const monthStart = new Date();
    monthStart.setDate(1);
    
    const monthJobs = jobs.filter(job => {
      const jobDate = new Date(job.createdAt);
      return jobDate >= monthStart;
    });

    const totalRevenue = monthJobs.reduce((sum, job) => sum + (job.estimatedBilling || 0), 0);

    let report = `
PASCO BODYSHOP - MONTHLY REPORT
================================
Month: ${monthStart.toLocaleString('default', { month: 'long', year: 'numeric' })}
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
-----------------
Total Jobs: ${monthJobs.length}
Completed: ${monthJobs.filter(j => j.status === "completed").length}
In Progress: ${monthJobs.filter(j => j.status === "in-progress").length}
Total Revenue: ₹${totalRevenue.toLocaleString()}

FINANCIAL OVERVIEW
------------------
Monthly Revenue: ₹${totalRevenue.toLocaleString()}
Average per Job: ₹${monthJobs.length > 0 ? Math.round(totalRevenue / monthJobs.length).toLocaleString() : 0}
Projected Annual: ₹${Math.round(totalRevenue * 12).toLocaleString()}

OPERATIONAL METRICS
-------------------
Average Jobs per Day: ${Math.round(monthJobs.length / new Date().getDate())}
Team Utilization: 87%
Equipment Efficiency: 92%
Customer Retention: 78%

SERVICE BREAKDOWN
-----------------
Paint & Body Work: 42%
Mechanical Repairs: 28%
Detailing Services: 18%
Insurance Claims: 12%

TEAM PERFORMANCE
----------------
Total Team Members: 12
Average Jobs per Member: ${Math.round(monthJobs.length / 12)}
Top Performer: Rajesh Kumar (8 jobs/day avg)
Quality Rating: 4.7/5.0

INVENTORY & PARTS
-----------------
Parts Consumed: 156 items
Inventory Value: ₹2,45,000
Low Stock Alerts: 4 items
Supplier Orders: 12 placed

CUSTOMER METRICS
----------------
New Customers: 24
Repeat Customers: ${Math.round(monthJobs.length * 0.6)}
Customer Satisfaction: 4.6/5.0
Referral Rate: 15%

==============================
PASCO Bodyshop Management System
`;

    return report.trim();
  };

  const generateTeamReport = () => {
    const teamMembers = [
      { name: "Rajesh Kumar", role: "Senior Technician", jobs: 8, rating: 4.8, efficiency: "95%" },
      { name: "Amit Sharma", role: "Paint Specialist", jobs: 6, rating: 4.9, efficiency: "92%" },
      { name: "Priya Singh", role: "Service Advisor", jobs: 12, rating: 4.7, efficiency: "88%" },
      { name: "Vijay Patel", role: "Technician", jobs: 5, rating: 4.6, efficiency: "85%" },
      { name: "Suresh Reddy", role: "Parts Manager", jobs: 4, rating: 4.8, efficiency: "90%" },
    ];

    let report = `
PASCO BODYSHOP - TEAM PERFORMANCE REPORT
=========================================
Date: ${new Date().toLocaleDateString()}
Generated: ${new Date().toLocaleString()}

TEAM OVERVIEW
-------------
Total Team Members: ${teamMembers.length}
Active Members: ${teamMembers.length}
On Leave: 0
Average Performance: 4.76/5.0

INDIVIDUAL PERFORMANCE
----------------------
`;

    teamMembers.forEach((member, index) => {
      report += `
${index + 1}. ${member.name}
   Role: ${member.role}
   Jobs Completed: ${member.jobs}
   Performance Rating: ${member.rating}/5.0
   Efficiency: ${member.efficiency}
   Status: Active
`;
    });

    report += `
TEAM METRICS
------------
Total Jobs Handled: ${teamMembers.reduce((sum, m) => sum + m.jobs, 0)}
Average Jobs per Member: ${(teamMembers.reduce((sum, m) => sum + m.jobs, 0) / teamMembers.length).toFixed(1)}
Team Efficiency: 90%
Quality Score: 4.76/5.0

TRAINING & DEVELOPMENT
----------------------
Completed Training Sessions: 8
Upcoming Training: Advanced Paint Techniques (Next Week)
Certification Status: 100% current

==============================
PASCO Bodyshop Management System
`;

    return report.trim();
  };

  const generateInventoryReport = () => {
    const lowStockItems = [
      { name: "Engine Oil (5W-30)", quantity: 3, minRequired: 10, value: "₹4,500" },
      { name: "Brake Pads", quantity: 5, minRequired: 15, value: "₹8,750" },
      { name: "Air Filters", quantity: 4, minRequired: 12, value: "₹2,400" },
      { name: "Paint (White)", quantity: 2, minRequired: 8, value: "₹12,000" },
    ];

    let report = `
PASCO BODYSHOP - INVENTORY REPORT
==================================
Date: ${new Date().toLocaleDateString()}
Generated: ${new Date().toLocaleString()}

INVENTORY SUMMARY
-----------------
Total Items in Stock: 156
Total Inventory Value: ₹2,45,000
Low Stock Items: ${lowStockItems.length}
Out of Stock: 0

LOW STOCK ALERTS
----------------
`;

    lowStockItems.forEach((item, index) => {
      report += `
${index + 1}. ${item.name}
   Current Stock: ${item.quantity}
   Required Minimum: ${item.minRequired}
   Shortage: ${item.minRequired - item.quantity} units
   Estimated Value: ${item.value}
`;
    });

    report += `
FAST MOVING ITEMS
-----------------
1. Engine Oil (5W-30) - 45 units/month
2. Brake Pads - 38 units/month
3. Air Filters - 32 units/month
4. Paint (White) - 28 units/month

SLOW MOVING ITEMS
-----------------
1. Specialized Tools - 2 units/month
2. Rare Paint Colors - 3 units/month

ORDERS & PROCUREMENT
--------------------
Pending Orders: 3
Last Order Date: ${new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
Next Scheduled Order: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}

RECOMMENDATIONS
---------------
- Immediate order required for Engine Oil (5W-30)
- Restock Brake Pads within 3 days
- Review minimum stock levels for Air Filters
- Consider bulk purchase discount for Paint

==============================
PASCO Bodyshop Management System
`;

    return report.trim();
  };

  const handleExport = () => {
    let reportContent = "";

    switch (reportType) {
      case "daily":
        reportContent = generateDailyReport();
        break;
      case "weekly":
        reportContent = generateWeeklyReport();
        break;
      case "monthly":
        reportContent = generateMonthlyReport();
        break;
      case "team":
        reportContent = generateTeamReport();
        break;
      case "inventory":
        reportContent = generateInventoryReport();
        break;
      default:
        reportContent = generateDailyReport();
    }

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PASCO_${reportType}_Report_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report downloaded!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Export Report
          </DialogTitle>
          <DialogDescription>
            Choose the type and format of the report you want to export.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Report</SelectItem>
                <SelectItem value="weekly">Weekly Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
                <SelectItem value="team">Team Performance</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">Text (.txt)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
                <SelectItem value="pdf">PDF (.pdf)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportType === "daily" && (
            <div className="space-y-3 p-3 bg-gray-50 rounded-xl">
              <Label>Include in Report</Label>
              {Object.entries(includeDetails).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setIncludeDetails({ ...includeDetails, [key]: checked as boolean })
                    }
                  />
                  <label htmlFor={key} className="text-sm capitalize cursor-pointer">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
            <Calendar className="w-4 h-4 text-blue-600" />
            <div className="text-sm">
              <p className="font-semibold text-blue-900">Report Period</p>
              <p className="text-xs text-blue-700">
                {reportType === "daily" && "Today's data"}
                {reportType === "weekly" && "Last 7 days"}
                {reportType === "monthly" && "Current month"}
                {reportType === "team" && "Current period"}
                {reportType === "inventory" && "Current stock"}
              </p>
            </div>
          </div>

          <Button onClick={handleExport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}