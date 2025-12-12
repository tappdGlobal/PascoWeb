import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useBodyshopData } from "./BodyshopDataContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  TrendingUp, DollarSign, Users, Wrench, 
  Clock, CheckCircle2, AlertCircle, Calendar,
  BarChart3, PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";

export function Analytics() {
  const { 
    jobs, 
    getTodayJobsCount,
    getInProgressCount,
    getCompletedCount,
    getApprovalPendingCount,
    getJobsByStatus 
  } = useBodyshopData();

  // Calculate analytics data
  const totalJobs = jobs.length;
  const openJobs = getJobsByStatus("Service").length;
  const inProgressJobs = getInProgressCount();
  const closedJobs = getCompletedCount();
  const insuranceJobs = jobs.filter(j => j.jobType === "Insurance").length;
  const cashJobs = jobs.filter(j => j.jobType === "Cash").length;
  const warrantyJobs = jobs.filter(j => j.jobType === "Warranty").length;

  // Revenue calculation
  const totalRevenue = jobs
    .filter(j => j.services && j.services.length > 0)
    .reduce((sum, j) => sum + j.services.reduce((s, service) => s + service.estimatedCost, 0), 0);
  
  const avgJobValue = totalJobs > 0 ? totalRevenue / totalJobs : 0;

  // Top metrics - PROMINENT JOB CARD METRICS
  const jobCardMetrics = [
    {
      title: "Open Jobs",
      value: openJobs,
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    },
    {
      title: "In Progress",
      value: inProgressJobs,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200"
    },
    {
      title: "Closed Jobs",
      value: closedJobs,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200"
    },
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: Wrench,
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200"
    }
  ];

  const secondaryMetrics = [
    {
      title: "Today's Jobs",
      value: getTodayJobsCount(),
      icon: Calendar,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      title: "Total Revenue",
      value: `₹${(totalRevenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  // Job Status Distribution
  const statusData = [
    { name: "Service", value: openJobs, color: "#3b82f6" },
    { name: "In-Progress", value: inProgressJobs, color: "#eab308" },
    { name: "Completed", value: closedJobs, color: "#10b981" }
  ];

  // Job Type Distribution
  const jobTypeData = [
    { name: "Insurance", value: insuranceJobs, color: "#f97316" },
    { name: "Cash", value: cashJobs, color: "#3b82f6" },
    { name: "Warranty", value: warrantyJobs, color: "#8b5cf6" }
  ];

  // Monthly trend data (mock)
  const monthlyData = [
    { month: "Jul", jobs: 45, revenue: 180000 },
    { month: "Aug", jobs: 52, revenue: 215000 },
    { month: "Sep", jobs: 48, revenue: 195000 },
    { month: "Oct", jobs: 61, revenue: 245000 },
    { month: "Nov", jobs: 58, revenue: 235000 },
    { month: "Dec", jobs: totalJobs, revenue: totalRevenue }
  ];

  // Technician performance (mock)
  const technicianData = [
    { name: "Suresh Y.", completed: 28, avg: 4.8 },
    { name: "Ramesh K.", completed: 24, avg: 4.6 },
    { name: "Vijay S.", completed: 19, avg: 4.5 },
    { name: "Prakash M.", completed: 15, avg: 4.3 }
  ];

  // Advisor performance (mock)
  const advisorData = [
    { name: "Amit Singh", jobs: 42, revenue: 185000 },
    { name: "Sneha Verma", jobs: 38, revenue: 162000 },
    { name: "Rajesh Kumar", jobs: 31, revenue: 145000 }
  ];

  // Stage completion time (mock)
  const stageTimeData = [
    { stage: "Estimate", avgDays: 1.2 },
    { stage: "Approval", avgDays: 2.5 },
    { stage: "Parts", avgDays: 3.8 },
    { stage: "Work", avgDays: 4.2 },
    { stage: "Painting", avgDays: 2.1 },
    { stage: "QC", avgDays: 0.8 }
  ];

  return (
    <div className="space-y-4">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {jobCardMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">{metric.title}</p>
                    <p className="text-2xl text-gray-900 mb-1">{metric.value}</p>
                    <span className="text-xs text-green-600">{metric.change}</span>
                  </div>
                  <div className={`${metric.bg} p-3 rounded-full`}>
                    <Icon className={`w-5 h-5 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs for different analytics views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          {/* Job Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PieChartIcon className="w-4 h-4" />
                Job Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Job Type Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={jobTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                {jobTypeData.map((item) => (
                  <div key={item.name} className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500">{item.name}</p>
                    <p className="text-lg text-gray-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Average Job Value</span>
                <span className="text-gray-900">₹{avgJobValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Today&apos;s Jobs</span>
                <span className="text-gray-900">{getTodayJobsCount()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Approval Pending</span>
                <span className="text-gray-900">{getApprovalPendingCount()}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-gray-900">{totalJobs > 0 ? ((closedJobs / totalJobs) * 100).toFixed(1) : 0}%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          {/* Advisor Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4" />
                Advisor Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={advisorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="jobs" fill="#3b82f6" name="Jobs" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Technician Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Technician Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {technicianData.map((tech, index) => (
                <div key={tech.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-xs">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{tech.name}</p>
                      <p className="text-xs text-gray-500">{tech.completed} jobs completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{tech.avg} ★</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stage Completion Time */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Average Stage Completion Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stageTimeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="avgDays" fill="#eab308" name="Days" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4 mt-4">
          {/* Monthly Jobs Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Monthly Jobs Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="jobs" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Jobs"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Monthly Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Growth Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Job Growth (MoM)</span>
                  <span className="text-green-600">+12.3%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Revenue Growth (MoM)</span>
                  <span className="text-green-600">+18.5%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-green-600">{totalJobs > 0 ? ((closedJobs / totalJobs) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="w-full bg-yellow-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${totalJobs > 0 ? (closedJobs / totalJobs) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="text-green-600">4.6/5.0</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Period Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">This Month vs Last Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">This Month</p>
                  <p className="text-xl text-gray-900">{totalJobs}</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Last Month</p>
                  <p className="text-xl text-gray-900">58</p>
                  <p className="text-xs text-gray-500">Jobs</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">This Month</p>
                  <p className="text-xl text-gray-900">₹{(totalRevenue / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500 mb-1">Last Month</p>
                  <p className="text-xl text-gray-900">₹235K</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}