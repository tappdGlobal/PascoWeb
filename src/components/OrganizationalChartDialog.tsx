import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Users, ArrowDown } from "lucide-react";

interface OrganizationalChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrganizationalChartDialog({ open, onOpenChange }: OrganizationalChartDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Organizational Structure
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          {/* Chairman */}
          <div className="flex flex-col items-center">
            <div className="w-64 p-4 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl shadow-lg text-center">
              <p className="text-lg font-bold">Sanjay Passi</p>
              <p className="text-sm opacity-90">Chairman</p>
            </div>
            <ArrowDown className="w-6 h-6 text-gray-400 my-2" />
          </div>

          {/* CEO */}
          <div className="flex flex-col items-center">
            <div className="w-64 p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl shadow-lg text-center">
              <p className="text-lg font-bold">KP</p>
              <p className="text-sm opacity-90">CEO</p>
            </div>
            <ArrowDown className="w-6 h-6 text-gray-400 my-2" />
          </div>

          {/* VP */}
          <div className="flex flex-col items-center">
            <div className="w-64 p-4 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-xl shadow-lg text-center">
              <p className="text-lg font-bold">Sunil Thakur</p>
              <p className="text-sm opacity-90">Vice President</p>
            </div>
            <ArrowDown className="w-6 h-6 text-gray-400 my-2" />
          </div>

          {/* GMs */}
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-64 p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl shadow-lg text-center">
                <p className="text-lg font-bold">Manmeet Singh</p>
                <p className="text-sm opacity-90">General Manager</p>
              </div>
              <ArrowDown className="w-6 h-6 text-gray-400 my-2" />
            </div>

            {/* Other GMs in a row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-full p-3 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-xl shadow-md text-center">
                  <p className="font-bold">Amit Kumar</p>
                  <p className="text-xs opacity-90">GM - Operations</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full p-3 bg-gradient-to-br from-orange-500 to-amber-500 text-white rounded-xl shadow-md text-center">
                  <p className="font-bold">Priya Mehta</p>
                  <p className="text-xs opacity-90">GM - Sales</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-full p-3 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl shadow-md text-center">
                  <p className="font-bold">Vikram Singh</p>
                  <p className="text-xs opacity-90">GM - Quality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members under Manmeet Singh */}
          <div className="border-t-2 border-gray-300 pt-6">
            <p className="text-center font-semibold text-gray-700 mb-4">Team Members (Reporting to Manmeet Singh)</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    RK
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Rajesh Kumar</p>
                    <p className="text-xs text-gray-600">Senior Technician</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                    AS
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Amit Sharma</p>
                    <p className="text-xs text-gray-600">Paint Specialist</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                    PS
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Priya Singh</p>
                    <p className="text-xs text-gray-600">Service Advisor</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white text-xs font-bold">
                    VP
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Vijay Patel</p>
                    <p className="text-xs text-gray-600">Technician</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    SR
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Suresh Reddy</p>
                    <p className="text-xs text-gray-600">Parts Manager</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white text-xs font-bold">
                    NK
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Neha Kapoor</p>
                    <p className="text-xs text-gray-600">Quality Inspector</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="font-semibold text-sm mb-2">Reporting Structure</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• All team members report to <span className="font-semibold">Manmeet Singh (GM)</span></p>
              <p>• All GMs report to <span className="font-semibold">Sunil Thakur (VP)</span></p>
              <p>• VP reports to <span className="font-semibold">KP (CEO)</span></p>
              <p>• CEO reports to <span className="font-semibold">Sanjay Passi (Chairman)</span></p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
