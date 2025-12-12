import { Bell, Menu, Zap, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { toast } from "sonner@2.0.3";

interface MobileHeaderProps {
  title: string;
}

export function MobileHeader({ title }: MobileHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 safe-top glass-card border-b border-blue-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-xl gradient-text">{title}</h1>
              <p className="text-xs text-blue-600">Bodyshop Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setShowSearch(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-gradient-to-r from-orange-400 to-orange-600 text-white text-xs border-0 shadow-lg">
                3
              </Badge>
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <Dialog open={showSearch} onOpenChange={setShowSearch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search jobs, customers, vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1">Search</Button>
              <Button variant="outline" onClick={() => setShowSearch(false)}>Cancel</Button>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Quick Filters:</p>
              <div className="flex flex-wrap gap-2">
                {["Today", "Pending", "Insurance", "Urgent", "Completed"].map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery(filter);
                      handleSearch();
                    }}
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}