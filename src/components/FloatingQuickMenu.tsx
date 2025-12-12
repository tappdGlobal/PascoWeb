import { useState } from "react";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";
import { AIRADialog } from "./AIRADialog";

interface FloatingQuickMenuProps {
  onExportReport: () => void;
  onManagerDetails: () => void;
  onRevenue: () => void;
}

export function FloatingQuickMenu({ 
  onExportReport, 
  onManagerDetails, 
  onRevenue 
}: FloatingQuickMenuProps) {
  const [showAIRA, setShowAIRA] = useState(false);

  return (
    <>
      {/* Floating AIRA Button */}
      <Button
        onClick={() => setShowAIRA(true)}
        className="fixed bottom-24 left-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-xl z-40 border-0 transition-all duration-300 hover:scale-110 animate-pulse"
        size="icon"
      >
        <Bot className="w-7 h-7 text-white" />
      </Button>

      {/* AIRA Dialog */}
      <AIRADialog 
        open={showAIRA} 
        onOpenChange={setShowAIRA}
        onExportReport={onExportReport}
        onManagerDetails={onManagerDetails}
        onRevenue={onRevenue}
      />
    </>
  );
}
