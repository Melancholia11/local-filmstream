import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Film, Upload, Settings } from "lucide-react";

const Index = () => {
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [subtitleFile, setSubtitleFile] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState<string>("");

  const handleVideoUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setVideoFile(url);
    setVideoFileName(file.name);
  };

  const handleSubtitleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setSubtitleFile(url);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 pointer-events-none" />
      
      {!videoFile ? (
        // Landing Page
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <Film className="w-16 h-16 text-primary mr-4 animate-pulse-glow" />
              <h1 className="text-6xl font-bold gradient-text">
                FilmStream
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Pengalaman menonton film lokal yang luar biasa dengan media player kustom yang modern dan fitur subtitle yang dapat disesuaikan
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 w-full max-w-4xl animate-slide-in-bottom">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Upload className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Upload Video</h2>
                </div>
                <FileUploader
                  accept="video/*"
                  onFileSelect={handleVideoUpload}
                  label="Pilih file video"
                  description="Mendukung semua format video (MP4, AVI, MKV, MOV, dll.)"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-semibold">Upload Subtitle</h2>
                </div>
                <FileUploader
                  accept=".srt,.vtt,.ass,.ssa"
                  onFileSelect={handleSubtitleUpload}
                  label="Pilih file subtitle (opsional)"
                  description="Format: SRT, VTT, ASS, SSA"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Fitur Unggulan:</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-card/50">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">10s</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Forward/Backward</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card/50">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">CC</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Custom Subtitle</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card/50">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">2x</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Playback Speed</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-card/50">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">HD</span>
                  </div>
                  <p className="text-sm text-muted-foreground">High Quality</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Video Player Page
        <VideoPlayer
          videoUrl={videoFile}
          subtitleUrl={subtitleFile}
          fileName={videoFileName}
          onBack={() => {
            setVideoFile(null);
            setSubtitleFile(null);
            setVideoFileName("");
          }}
        />
      )}
    </div>
  );
};

export default Index;