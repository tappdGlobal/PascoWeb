import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Camera, Upload, X, Car, Image as ImageIcon } from "lucide-react";
import { Job } from "./BodyshopDataContext";
import { toast } from "sonner@2.0.3";

interface PhotoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: Job | null;
}

export function PhotoUploadDialog({ open, onOpenChange, job }: PhotoUploadDialogProps) {
  const [photoType, setPhotoType] = useState("before");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simulate file upload
      const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
      setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
      toast.success(`${files.length} photo(s) uploaded`);
    }
  };

  const handleTakePhoto = () => {
    toast.success("Opening camera...");
  };

  const handleRemovePhoto = (index: number) => {
    const updated = uploadedPhotos.filter((_, i) => i !== index);
    setUploadedPhotos(updated);
    toast.success("Photo removed");
  };

  const handleSave = () => {
    if (uploadedPhotos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }
    toast.success(`${uploadedPhotos.length} photo(s) saved to job card ${job?.jobCardNumber}`);
    setUploadedPhotos([]);
    onOpenChange(false);
  };

  if (!job) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            Upload Photos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Job Card Info */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">{job.jobCardNumber}</p>
                <p className="text-sm text-gray-600">{job.vehicleModel} • {job.vehicleRegNo}</p>
                <p className="text-xs text-gray-500">Customer: {job.customerName}</p>
              </div>
            </div>
          </div>

          {/* Photo Type Selection */}
          <div className="space-y-2">
            <Label>Photo Type</Label>
            <Select value={photoType} onValueChange={setPhotoType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">Before Work</SelectItem>
                <SelectItem value="during">Work in Progress</SelectItem>
                <SelectItem value="after">After Work</SelectItem>
                <SelectItem value="damage">Damage Documentation</SelectItem>
                <SelectItem value="parts">Parts Used</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload Options */}
          <div className="w-full">
            <Button
              variant="outline"
              className="w-full h-24 flex-col gap-2"
              onClick={handleTakePhoto}
            >
              <Camera className="w-8 h-8 text-blue-600" />
              <span>Take Photo</span>
            </Button>
          </div>

          {/* Uploaded Photos Grid */}
          {uploadedPhotos.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Uploaded Photos ({uploadedPhotos.length})</Label>
                <span className="text-xs text-gray-500">
                  Type: <span className="font-semibold">{photoType}</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {uploadedPhotos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={photo}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {uploadedPhotos.length === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">No photos uploaded yet</p>
              <p className="text-xs text-gray-500">Take a photo or upload from gallery</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setUploadedPhotos([]);
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600"
              onClick={handleSave}
              disabled={uploadedPhotos.length === 0}
            >
              Save Photos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}