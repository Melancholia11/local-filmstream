import { useRef } from "react";
import { Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  accept: string;
  onFileSelect: (file: File) => void;
  label: string;
  description: string;
}

export const FileUploader = ({ accept, onFileSelect, label, description }: FileUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        onClick={handleClick}
        className="border-2 border-dashed border-primary/30 rounded-xl p-8 text-center cursor-pointer smooth-transition hover:border-primary/50 hover:bg-primary/5 group"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 smooth-transition">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{label}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleClick}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <File className="w-5 h-5 mr-2" />
        Pilih File
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};