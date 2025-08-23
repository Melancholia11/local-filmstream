import { useState } from "react";
import { Play, Plus, Upload, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploader } from "@/components/FileUploader";

interface VideoItem {
  id: string;
  url: string;
  name: string;
  subtitle?: string;
}

interface VideoLibraryProps {
  onVideoSelect: (video: VideoItem) => void;
}

export const VideoLibrary = ({ onVideoSelect }: VideoLibraryProps) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  const handleVideoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const newVideo: VideoItem = {
      id: crypto.randomUUID(),
      url,
      name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
    };
    setVideos(prev => [...prev, newVideo]);
    setShowUploader(false);
  };

  const handleMultipleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newVideos = Array.from(files).map(file => ({
        id: crypto.randomUUID(),
        url: URL.createObjectURL(file),
        name: file.name.replace(/\.[^/.]+$/, ""),
      }));
      setVideos(prev => [...prev, ...newVideos]);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (videos.length === 0 && !showUploader) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <Film className="w-16 h-16 text-primary mr-4 animate-pulse-glow" />
              <h1 className="text-6xl font-bold gradient-text">
                FilmStream
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pengalaman menonton film lokal yang luar biasa dengan perpustakaan video pribadi
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 w-full max-w-2xl animate-slide-in-bottom">
            <div className="text-center space-y-6">
              <Upload className="w-16 h-16 text-primary mx-auto" />
              <h2 className="text-2xl font-semibold">Mulai Perpustakaan Video Anda</h2>
              <p className="text-muted-foreground">
                Tambahkan video lokal Anda untuk membuat perpustakaan pribadi seperti Netflix
              </p>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setShowUploader(true)}
                  className="w-full"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tambah Video Pertama
                </Button>
                
                <div className="relative">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleMultipleFiles}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Atau Pilih Beberapa Video Sekaligus
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showUploader) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="glass-card rounded-2xl p-8 w-full max-w-2xl">
            <FileUploader
              accept="video/*"
              onFileSelect={handleVideoUpload}
              label="Pilih file video"
              description="Mendukung semua format video (MP4, AVI, MKV, MOV, dll.)"
            />
            <Button
              variant="outline"
              onClick={() => setShowUploader(false)}
              className="w-full mt-4"
            >
              Kembali ke Perpustakaan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Film className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold gradient-text">FilmStream</h1>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleMultipleFiles}
                className="hidden"
                id="multi-upload"
              />
              <label htmlFor="multi-upload">
                <Button asChild variant="outline">
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Tambah Video
                  </span>
                </Button>
              </label>
              <Button onClick={() => setShowUploader(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Satu Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-xl font-semibold mb-6">Perpustakaan Video Anda</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {videos.map((video) => (
            <Card
              key={video.id}
              className="group cursor-pointer smooth-transition hover:scale-105 hover:shadow-lg bg-card/50 backdrop-blur-sm"
              onClick={() => onVideoSelect(video)}
            >
              <CardContent className="p-0">
                {/* Poster Placeholder */}
                <div className="aspect-[2/3] bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  
                  {/* Content */}
                  <div className="relative z-10 text-center p-4">
                    <div className="w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold text-lg">
                        {getInitials(video.name)}
                      </span>
                    </div>
                    <Film className="w-8 h-8 text-primary/70 mx-auto" />
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate" title={video.name}>
                    {video.name}
                  </h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};