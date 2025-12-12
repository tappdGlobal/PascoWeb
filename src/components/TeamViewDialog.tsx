import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, Star, Phone, Mail, User, ChevronDown } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface TeamViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamViewDialog({ open, onOpenChange }: TeamViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Manager Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about the manager and their team.
          </DialogDescription>
        </DialogHeader>

        <div className="p-2 md:p-6 space-y-6">
          {/* Manager Card - Sunil Thakur */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold border-4 border-white/30">
                  ST
                </div>
                <p className="text-2xl font-bold">Sunil Thakur</p>
                <p className="text-base opacity-90 mt-2">Vice President</p>
                <div className="flex gap-2 justify-center mt-4">
                  <Badge className="bg-white/20 text-white border-0">Management</Badge>
                  <Badge className="bg-white/20 text-white border-0">Leadership</Badge>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-xs opacity-80">Departments</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">35</p>
                      <p className="text-xs opacity-80">Team Members</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-xs opacity-80">Active Jobs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Heads Reporting to Sunil Thakur */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px bg-gray-300 flex-1"></div>
              <p className="text-sm font-semibold text-gray-600 px-3">Department Heads</p>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* GM - Bodyshop (Manmeet) */}
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    MS
                  </div>
                  <p className="font-bold text-sm">Manmeet Singh</p>
                  <p className="text-xs opacity-90 mt-1">GM - Bodyshop</p>
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <p className="text-xs">6 Team Members</p>
                  </div>
                  <ChevronDown className="w-4 h-4 mx-auto mt-2" />
                </div>
              </div>

              {/* GM - Operations */}
              <div className="p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    AK
                  </div>
                  <p className="font-bold text-sm">Amit Kumar</p>
                  <p className="text-xs opacity-90 mt-1">GM - Operations</p>
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <p className="text-xs">12 Team Members</p>
                  </div>
                </div>
              </div>

              {/* GM - Sales */}
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    PM
                  </div>
                  <p className="font-bold text-sm">Priya Mehta</p>
                  <p className="text-xs opacity-90 mt-1">GM - Sales</p>
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <p className="text-xs">10 Team Members</p>
                  </div>
                </div>
              </div>

              {/* GM - Quality */}
              <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/20 flex items-center justify-center font-bold">
                    VS
                  </div>
                  <p className="font-bold text-sm">Vikram Singh</p>
                  <p className="text-xs opacity-90 mt-1">GM - Quality</p>
                  <div className="mt-2 pt-2 border-t border-white/20">
                    <p className="text-xs">7 Team Members</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members under Manmeet Singh (GM - Bodyshop) */}
          <div className="border-t-4 border-orange-400 pt-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="w-5 h-5 text-orange-600" />
              <p className="font-bold text-gray-800">Bodyshop Team - Reporting to Manmeet Singh</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Rajesh Kumar */}
              <div className="p-4 bg-white border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    RK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">Rajesh Kumar</p>
                    <p className="text-xs text-gray-600">Senior Technician</p>
                    <Badge className="bg-green-100 text-green-700 mt-1 text-xs border-0">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-blue-50 p-2 rounded text-center">
                    <p className="font-bold text-blue-600">8</p>
                    <p className="text-gray-600 text-[10px]">Jobs</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <p className="font-bold text-yellow-600">4.8</p>
                    </div>
                    <p className="text-gray-600 text-[10px]">Rating</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="font-bold text-green-600">92%</p>
                    <p className="text-gray-600 text-[10px]">Efficiency</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Calling Rajesh...")}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Emailing Rajesh...")}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Amit Sharma */}
              <div className="p-4 bg-white border-2 border-purple-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    AS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">Amit Sharma</p>
                    <p className="text-xs text-gray-600">Paint Specialist</p>
                    <Badge className="bg-green-100 text-green-700 mt-1 text-xs border-0">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-purple-50 p-2 rounded text-center">
                    <p className="font-bold text-purple-600">6</p>
                    <p className="text-gray-600 text-[10px]">Jobs</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <p className="font-bold text-yellow-600">4.9</p>
                    </div>
                    <p className="text-gray-600 text-[10px]">Rating</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="font-bold text-green-600">95%</p>
                    <p className="text-gray-600 text-[10px]">Efficiency</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Calling Amit...")}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Emailing Amit...")}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Priya Singh */}
              <div className="p-4 bg-white border-2 border-green-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    PS
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">Priya Singh</p>
                    <p className="text-xs text-gray-600">Service Advisor</p>
                    <Badge className="bg-green-100 text-green-700 mt-1 text-xs border-0">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="font-bold text-green-600">12</p>
                    <p className="text-gray-600 text-[10px]">Jobs</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <p className="font-bold text-yellow-600">4.7</p>
                    </div>
                    <p className="text-gray-600 text-[10px]">Rating</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="font-bold text-green-600">88%</p>
                    <p className="text-gray-600 text-[10px]">Efficiency</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Calling Priya...")}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Emailing Priya...")}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Vijay Patel */}
              <div className="p-4 bg-white border-2 border-orange-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    VP
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">Vijay Patel</p>
                    <p className="text-xs text-gray-600">Technician</p>
                    <Badge className="bg-orange-100 text-orange-700 mt-1 text-xs border-0">On Break</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-orange-50 p-2 rounded text-center">
                    <p className="font-bold text-orange-600">5</p>
                    <p className="text-gray-600 text-[10px]">Jobs</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <p className="font-bold text-yellow-600">4.6</p>
                    </div>
                    <p className="text-gray-600 text-[10px]">Rating</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="font-bold text-gray-600">—</p>
                    <p className="text-gray-600 text-[10px]">Efficiency</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Calling Vijay...")}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Emailing Vijay...")}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Suresh Reddy */}
              <div className="p-4 bg-white border-2 border-indigo-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    SR
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">Suresh Reddy</p>
                    <p className="text-xs text-gray-600">Parts Manager</p>
                    <Badge className="bg-green-100 text-green-700 mt-1 text-xs border-0">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-indigo-50 p-2 rounded text-center">
                    <p className="font-bold text-indigo-600">4</p>
                    <p className="text-gray-600 text-[10px]">Jobs</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <p className="font-bold text-yellow-600">4.8</p>
                    </div>
                    <p className="text-gray-600 text-[10px]">Rating</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="font-bold text-green-600">90%</p>
                    <p className="text-gray-600 text-[10px]">Efficiency</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Calling Suresh...")}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Emailing Suresh...")}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>

              {/* Neha Kapoor */}
              <div className="p-4 bg-white border-2 border-pink-200 rounded-xl hover:shadow-lg transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                    NK
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm">Neha Kapoor</p>
                    <p className="text-xs text-gray-600">Quality Inspector</p>
                    <Badge className="bg-green-100 text-green-700 mt-1 text-xs border-0">Active</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                  <div className="bg-pink-50 p-2 rounded text-center">
                    <p className="font-bold text-pink-600">7</p>
                    <p className="text-gray-600 text-[10px]">Jobs</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <p className="font-bold text-yellow-600">4.9</p>
                    </div>
                    <p className="text-gray-600 text-[10px]">Rating</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded text-center">
                    <p className="font-bold text-green-600">94%</p>
                    <p className="text-gray-600 text-[10px]">Efficiency</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Calling Neha...")}>
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => toast.success("Emailing Neha...")}>
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}