import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { DollarSign, TrendingUp, TrendingDown, Download } from "lucide-react";
import { toast } from "sonner";
import { useBodyshopData } from "./BodyshopDataContext";

interface RevenueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RevenueDialog({ open, onOpenChange }: RevenueDialogProps) {
  const { jobs } = useBodyshopData();

  const startOf = (d: Date) => { const r = new Date(d); r.setHours(0,0,0,0); return r; };
  const today = startOf(new Date());
  const yesterday = startOf(new Date(Date.now() - 24*60*60*1000));
  const startOfWeek = startOf(new Date()); startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const lastWeekStart = new Date(startOfWeek); lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const revenueForRange = (from: Date, to: Date) => {
    return jobs.filter((j: any) => {
      const d = j.createdAt ? new Date(j.createdAt) : null;
      if (!d) return false;
      return d >= from && d < to;
    }).reduce((s: number, j: any) => s + (Number(j.billAmount ?? j.services?.reduce((ss:any,it:any)=> ss + (it?.estimatedCost ?? 0),0) ?? 0) || 0), 0);
  };

  const countForRange = (from: Date, to: Date) => jobs.filter((j: any) => { const d = j.createdAt ? new Date(j.createdAt) : null; if (!d) return false; return d >= from && d < to; }).length;

  // Build revenue entries and include average & change vs previous comparable period
  const rToday = revenueForRange(today, new Date(today.getTime() + 24*60*60*1000));
  const rYesterday = revenueForRange(yesterday, today);
  const cToday = countForRange(today, new Date(today.getTime() + 24*60*60*1000));
  const cYesterday = countForRange(yesterday, today);

  const rThisWeek = revenueForRange(startOfWeek, new Date(startOfWeek.getTime() + 7*24*60*60*1000));
  const rLastWeek = revenueForRange(lastWeekStart, startOfWeek);
  const cThisWeek = countForRange(startOfWeek, new Date(startOfWeek.getTime() + 7*24*60*60*1000));
  const cLastWeek = countForRange(lastWeekStart, startOfWeek);

  const rThisMonth = revenueForRange(startOfMonth, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth()+1,1));
  const rLastMonth = revenueForRange(lastMonthStart, startOfMonth);
  const cThisMonth = countForRange(startOfMonth, new Date(startOfMonth.getFullYear(), startOfMonth.getMonth()+1,1));
  const cLastMonth = countForRange(lastMonthStart, startOfMonth);

  const revenueData = [
    {
      period: 'Today',
      amount: rToday,
      jobs: cToday,
      avgPerJob: cToday ? Math.round(rToday / cToday) : 0,
      change: rYesterday ? Math.round(((rToday - rYesterday) / Math.max(1, rYesterday)) * 100) : 0,
      trend: rToday >= rYesterday ? 'up' : 'down'
    },
    {
      period: 'Yesterday',
      amount: rYesterday,
      jobs: cYesterday,
      avgPerJob: cYesterday ? Math.round(rYesterday / cYesterday) : 0,
      change: 0,
      trend: 'down'
    },
    {
      period: 'This Week',
      amount: rThisWeek,
      jobs: cThisWeek,
      avgPerJob: cThisWeek ? Math.round(rThisWeek / cThisWeek) : 0,
      change: rLastWeek ? Math.round(((rThisWeek - rLastWeek) / Math.max(1, rLastWeek)) * 100) : 0,
      trend: rThisWeek >= rLastWeek ? 'up' : 'down'
    },
    {
      period: 'Last Week',
      amount: rLastWeek,
      jobs: cLastWeek,
      avgPerJob: cLastWeek ? Math.round(rLastWeek / cLastWeek) : 0,
      change: 0,
      trend: 'down'
    },
    {
      period: 'This Month',
      amount: rThisMonth,
      jobs: cThisMonth,
      avgPerJob: cThisMonth ? Math.round(rThisMonth / cThisMonth) : 0,
      change: rLastMonth ? Math.round(((rThisMonth - rLastMonth) / Math.max(1, rLastMonth)) * 100) : 0,
      trend: rThisMonth >= rLastMonth ? 'up' : 'down'
    },
    {
      period: 'Last Month',
      amount: rLastMonth,
      jobs: cLastMonth,
      avgPerJob: cLastMonth ? Math.round(rLastMonth / cLastMonth) : 0,
      change: 0,
      trend: 'down'
    }
  ];

  // Category breakdown by service_type
  const catMap: Record<string, number> = {};
  jobs.forEach((j: any) => {
    const cat = j.jobType ?? 'Other';
    const amt = Number(j.billAmount ?? j.services?.reduce((ss:any,it:any)=> ss + (it?.estimatedCost ?? 0),0) ?? 0) || 0;
    if (!catMap[cat]) catMap[cat] = 0;
    catMap[cat] += amt;
  });
  const totalRev = Object.values(catMap).reduce((s,a) => s + a, 0) || 1;
  const categoryBreakdown = Object.keys(catMap).map(k => ({ category: k, amount: catMap[k], percentage: Math.round((catMap[k]/totalRev)*100), color: 'blue' }));

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