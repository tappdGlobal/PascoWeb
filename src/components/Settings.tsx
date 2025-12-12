import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { User, Bell, Shield, LogOut, ChevronRight } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function Settings() {
  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
  };

  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-gray-900">Amit Singh</p>
            <p className="text-sm text-gray-600">EMP001</p>
            <p className="text-sm text-gray-600">amit.singh@pasco.com</p>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </Card>

      {/* Account Settings */}
      <Card className="p-4">
        <h3 className="text-gray-900 mb-4">Account Settings</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">Personal Information</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-4">
        <h3 className="text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-600">Updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-900">SMS Notifications</p>
              <p className="text-xs text-gray-600">SMS alerts</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-900">WhatsApp Updates</p>
              <p className="text-xs text-gray-600">WhatsApp messages</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-900">Job Updates</p>
              <p className="text-xs text-gray-600">Status changes</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* App Settings */}
      <Card className="p-4">
        <h3 className="text-gray-900 mb-4">App Settings</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-900">Dark Mode</p>
              <p className="text-xs text-gray-600">Switch theme</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-gray-900">Auto-Backup</p>
              <p className="text-xs text-gray-600">Daily data backup</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="p-4">
        <h3 className="text-gray-900 mb-4">Support</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200">
            <span className="text-sm text-gray-900">Help & FAQs</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200">
            <span className="text-sm text-gray-900">About PASCO</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200">
            <span className="text-sm text-gray-900">Terms & Conditions</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </Card>

      {/* Logout */}
      <Button
        variant="destructive"
        className="w-full"
        onClick={handleLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>

      {/* Version */}
      <div className="text-center py-4">
        <p className="text-xs text-gray-500">PASCO v1.0.0</p>
        <p className="text-xs text-gray-400">Build 2025.11.11</p>
      </div>
    </div>
  );
}