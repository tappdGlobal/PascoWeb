import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RevenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RevenueDialog({ open, onOpenChange }: RevenueDialogProps) {
  const revenueData = [
    { 
      period: "Today", 
      amount: 45230, 
      jobs: 8, 
      avgPerJob: 5654,
      change: 12,
      trend: "up"
    },
    { 
      period: "Yesterday", 
      amount: 38500, 
      jobs: 6, 
      avgPerJob: 6417,
      change: -5,
      trend: "down"
    },
    { 
      period: "This Week", 
      amount: 214500, 
      jobs: 42, 
      avgPerJob: 5107,
      change: 18,
      trend: "up"
    },
    { 
      period: "Last Week", 
      amount: 195000, 
      jobs: 38, 
      avgPerJob: 5132,
      change: 8,
      trend: "up"
    },
    { 
      period: "This Month", 
      amount: 895000, 
      jobs: 156, 
      avgPerJob: 5737,
      change: 15,
      trend: "up"
    },
    { 
      period: "Last Month", 
      amount: 778000, 
      jobs: 142, 
      avgPerJob: 5479,
      change: 12,
      trend: "up"
    },
  ];

  const categoryBreakdown = [
    { category: "Paint & Body Work", amount: 385000, percentage: 43, color: "blue" },
    { category: "Mechanical Repairs", amount: 268000, percentage: 30, color: "purple" },
    { category: "Detailing Services", amount: 161000, percentage: 18, color: "orange" },
    { category: "Insurance Claims", amount: 81000, percentage: 9, color: "green" },
  ];

  const handleExport = () => {
    const report = `
PASCO BODYSHOP - REVENUE REPORT
================================
Generated: ${new Date().toLocaleString()}

REVENUE SUMMARY
---------------
${revenueData.map(data => `
${data.period}:
  Revenue: ₹${data.amount.toLocaleString()}
  Jobs: ${data.jobs}
  Average per Job: ₹${data.avgPerJob.toLocaleString()}
  Change: ${data.change > 0 ? '+' : ''}${data.change}%
`).join('\n')}

CATEGORY BREAKDOWN
------------------
${categoryBreakdown.map(cat => `
${cat.category}: ₹${cat.amount.toLocaleString()} (${cat.percentage}%)`).join('\n')}

==============================
PASCO Bodyshop Management System
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Revenue_Report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Revenue report downloaded!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Revenue Analytics
            </div>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            View and export detailed revenue analytics for your bodyshop.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Revenue Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">Revenue Overview</h3>
            {revenueData.map((data) => (
              <div
                key={data.period}
                className="p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{data.period}</p>
                    <p className="text-xs text-gray-600">{data.jobs} jobs completed</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-semibold ${
                      data.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}>
                      {data.change > 0 ? "+" : ""}{data.change}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{data.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      Avg: ₹{data.avgPerJob.toLocaleString()} per job
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Category Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-700">Revenue by Category</h3>
            {categoryBreakdown.map((cat) => {
              const bgColor = cat.color === "blue" ? "bg-blue-50 border-blue-200" :
                             cat.color === "purple" ? "bg-purple-50 border-purple-200" :
                             cat.color === "orange" ? "bg-orange-50 border-orange-200" :
                             "bg-green-50 border-green-200";
              
              const textColor = cat.color === "blue" ? "text-blue-700" :
                               cat.color === "purple" ? "text-purple-700" :
                               cat.color === "orange" ? "text-orange-700" :
                               "text-green-700";

              const barColor = cat.color === "blue" ? "bg-blue-500" :
                              cat.color === "purple" ? "bg-purple-500" :
                              cat.color === "orange" ? "bg-orange-500" :
                              "bg-green-500";

              return (
                <div key={cat.category} className={`p-4 border rounded-xl ${bgColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{cat.category}</p>
                    <p className={`text-xl font-bold ${textColor}`}>
                      ₹{(cat.amount / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                    <span className={`text-sm font-semibold ${textColor}`}>
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Insights */}
          <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-sm text-green-900 mb-3">Key Insights</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Revenue up 15% this month compared to last month</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Paint & Body Work is the highest revenue generator (43%)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Average revenue per job: ₹5,737</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">•</span>
                <span>Projected annual revenue: ₹10.74M</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}