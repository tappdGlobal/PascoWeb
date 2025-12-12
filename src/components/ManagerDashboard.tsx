import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Users,
  DollarSign,
  TrendingUp,
  Download,
  FileText,
  CheckCircle,
  Wrench,
  Calendar,
  Star,
  UserCheck,
  Activity,
  BarChart3,
  Bot,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { ExportReportDialog } from "./ExportReportDialog";
import { TeamViewDialog } from "./TeamViewDialog";
import { RevenueDialog } from "./RevenueDialog";
import { AIRADialog } from "./AIRADialog";

export function ManagerDashboard() {
  const [showExportReport, setShowExportReport] = useState(false);
  const [showTeamView, setShowTeamView] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const [showAIRA, setShowAIRA] = useState(false);

  // Key Metrics
  const metrics = [
    { 
      label: "Today's Revenue", 
      value: "₹45,230", 
      change: "+12%", 
      trend: "up",
      icon: DollarSign,
      color: "green"
    },
    { 
      label: "Active Jobs", 
      value: "28", 
      change: "+5", 
      trend: "up",
      icon: Wrench,
      color: "blue"
    },
    { 
      label: "Team Members", 
      value: "12", 
      change: "2 on leave", 
      trend: "neutral",
      icon: Users,
      color: "purple"
    },
    { 
      label: "Completed Today", 
      value: "8", 
      change: "+2 from yesterday", 
      trend: "up",
      icon: CheckCircle,
      color: "teal"
    },
  ];

  // Team Performance
  const teamMembers = [
    { name: "Rajesh Kumar", role: "Senior Technician", jobs: 8, rating: 4.8, status: "active" },
    { name: "Amit Sharma", role: "Paint Specialist", jobs: 6, rating: 4.9, status: "active" },
    { name: "Priya Singh", role: "Service Advisor", jobs: 12, rating: 4.7, status: "active" },
    { name: "Vijay Patel", role: "Technician", jobs: 5, rating: 4.6, status: "on-break" },
    { name: "Suresh Reddy", role: "Parts Manager", jobs: 4, rating: 4.8, status: "active" },
  ];

  // Today's Schedule
  const schedule = [
    { time: "09:00 AM", task: "Honda City - Paint Job", technician: "Amit Sharma", status: "in-progress" },
    { time: "10:30 AM", task: "Maruti Swift - Dent Repair", technician: "Rajesh Kumar", status: "completed" },
    { time: "12:00 PM", task: "Hyundai Creta - Full Service", technician: "Vijay Patel", status: "pending" },
    { time: "02:00 PM", task: "Tata Nexon - Insurance Claim", technician: "Priya Singh", status: "in-progress" },
    { time: "04:00 PM", task: "Toyota Fortuner - Detailing", technician: "Rajesh Kumar", status: "scheduled" },
  ];

  // Revenue Overview
  const revenueData = [
    { period: "Today", amount: "₹45,230", jobs: 8 },
    { period: "This Week", amount: "₹2,14,500", jobs: 42 },
    { period: "This Month", amount: "₹8,95,000", jobs: 156 },
    { period: "This Year", amount: "₹1,02,45,000", jobs: 1842 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "text-green-600 bg-green-50";
      case "in-progress":
        return "text-blue-600 bg-blue-50";
      case "pending":
      case "scheduled":
        return "text-orange-600 bg-orange-50";
      case "on-break":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 border-0 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Manager Dashboard</h2>
              <p className="text-blue-100">Complete overview of your bodyshop operations</p>
            </div>
            <Activity className="w-12 h-12 text-white/80" />
          </div>
        </CardContent>
      </Card>

      {/* AIRA AI Assistant */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all cursor-pointer" onClick={() => setShowAIRA(true)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AIRA</h3>
                <Badge className="bg-green-100 text-green-700 border-0">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                  Online
                </Badge>
              </div>
              <p className="text-sm text-gray-600">AI Assistant for Manager Operations</p>
              <div className="flex items-center gap-2 mt-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <p className="text-xs text-purple-600">Click to chat • Export Reports • View Analytics</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.label} className="hover-lift cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-${metric.color}-100 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                  </div>
                  {metric.trend === "up" && (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                <p className="text-2xl font-bold mb-1">{metric.value}</p>
                <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Overview
            </CardTitle>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenueData.map((data) => (
              <div key={data.period} className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100">
                <div>
                  <p className="font-semibold">{data.period}</p>
                  <p className="text-xs text-gray-600">{data.jobs} jobs completed</p>
                </div>
                <p className="text-xl font-bold text-green-600">{data.amount}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Performance
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => setShowTeamView(true)}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold">{member.rating}</span>
                  </div>
                  <Badge variant={member.status === "active" ? "default" : "secondary"} className="text-xs">
                    {member.jobs} jobs
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((item, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="text-center min-w-[60px]">
                  <p className="text-xs font-semibold text-gray-600">{item.time}</p>
                </div>
                <div className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm">{item.task}</p>
                      <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                        <UserCheck className="w-3 h-3" />
                        {item.technician}
                      </p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ExportReportDialog open={showExportReport} onOpenChange={setShowExportReport} />
      <TeamViewDialog open={showTeamView} onOpenChange={setShowTeamView} />
      <RevenueDialog open={showRevenue} onOpenChange={setShowRevenue} />
      <AIRADialog 
        open={showAIRA} 
        onOpenChange={setShowAIRA}
        onExportReport={() => setShowExportReport(true)}
        onManagerDetails={() => setShowTeamView(true)}
        onRevenue={() => setShowRevenue(true)}
      />
    </div>
  );
}