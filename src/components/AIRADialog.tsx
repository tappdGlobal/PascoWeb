import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bot, Send, FileText, Users, DollarSign, Sparkles } from "lucide-react";
import { useState } from "react";

interface AIRADialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportReport: () => void;
  onManagerDetails: () => void;
  onRevenue: () => void;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  options?: {
    label: string;
    icon: any;
    action: () => void;
  }[];
}

export function AIRADialog({ 
  open, 
  onOpenChange, 
  onExportReport, 
  onManagerDetails, 
  onRevenue 
}: AIRADialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm AIRA, your AI Assistant for bodyshop operations. How can I help you today?",
      isUser: false,
      options: [
        { label: "Export Report", icon: FileText, action: () => handleOptionClick("Export Report", onExportReport) },
        { label: "Manager Details", icon: Users, action: () => handleOptionClick("Manager Details", onManagerDetails) },
        { label: "Revenue Analytics", icon: DollarSign, action: () => handleOptionClick("Revenue Analytics", onRevenue) },
      ]
    }
  ]);

  const handleOptionClick = (optionLabel: string, action: () => void) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: optionLabel,
      isUser: true,
    };

    // Add AIRA response
    const airaResponse: Message = {
      id: messages.length + 2,
      text: getResponseText(optionLabel),
      isUser: false,
    };

    setMessages(prev => [...prev, userMessage, airaResponse]);

    // Execute the action after a short delay
    setTimeout(() => {
      action();
      onOpenChange(false);
    }, 500);
  };

  const getResponseText = (option: string) => {
    switch (option) {
      case "Export Report":
        return "Opening Export Report options for you...";
      case "Manager Details":
        return "Loading Manager Details and organizational structure...";
      case "Revenue Analytics":
        return "Fetching revenue analytics and insights...";
      default:
        return "Processing your request...";
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm AIRA, your AI Assistant for bodyshop operations. How can I help you today?",
        isUser: false,
        options: [
          { label: "Export Report", icon: FileText, action: () => handleOptionClick("Export Report", onExportReport) },
          { label: "Manager Details", icon: Users, action: () => handleOptionClick("Manager Details", onManagerDetails) },
          { label: "Revenue Analytics", icon: DollarSign, action: () => handleOptionClick("Revenue Analytics", onRevenue) },
        ]
      }
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AIRA</span>
              <p className="text-xs text-gray-500 font-normal">AI Assistant</p>
            </div>
            <Badge className="ml-auto bg-green-100 text-green-700 border-0">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
              Online
            </Badge>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chat with AIRA AI Assistant to access manager operations including export reports, view manager details, and analyze revenue
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[500px]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-white rounded-xl">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[85%] ${message.isUser ? "order-2" : "order-1"}`}>
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-purple-600">AIRA</span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl p-3 ${
                      message.isUser
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white border-2 border-purple-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>

                  {/* Quick Action Options */}
                  {message.options && (
                    <div className="mt-3 space-y-2">
                      {message.options.map((option, index) => {
                        const Icon = option.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            className="w-full justify-start gap-3 hover:bg-purple-50 hover:border-purple-300 transition-all"
                            onClick={option.action}
                          >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm">{option.label}</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t bg-gray-50 rounded-b-xl">
            <Button
              variant="outline"
              className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={handleReset}
            >
              <Bot className="w-4 h-4 mr-2" />
              Start New Conversation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}