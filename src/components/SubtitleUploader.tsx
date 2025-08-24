import { useState } from "react";
import { X, Upload, FileText, Settings, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SubtitleUploaderProps {
  onSubtitleLoad: (url: string) => void;
  onOpenSettings: () => void;
  onClose: () => void;
}

export const SubtitleUploader = ({ onSubtitleLoad, onOpenSettings, onClose }: SubtitleUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file && file.name.endsWith('.srt')) {
      const url = URL.createObjectURL(file);
      onSubtitleLoad(url);
      toast({
        title: "Subtitle berhasil dimuat",
        description: `File ${file.name} telah dimuat.`,
      });
      onClose();
    } else {
      toast({
        title: "Format file tidak didukung",
        description: "Silakan pilih file dengan format .srt",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Subtitle</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
              dragActive 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('subtitle-file')?.click()}
          >
            <CloudUpload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Upload File Subtitle</p>
            <p className="text-sm text-muted-foreground mb-4">
              Drag & drop file .srt atau klik untuk memilih
            </p>
            
            <input
              id="subtitle-file"
              type="file"
              accept=".srt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelect(e.target.files[0]);
                }
                e.target.value = ''; // Reset input
              }}
            />
            
            <Button variant="outline" className="pointer-events-none">
              Pilih File
            </Button>
          </div>

          {/* Settings Button */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onOpenSettings}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Subtitle</span>
            </Button>
            
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};