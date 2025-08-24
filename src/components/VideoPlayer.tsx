import { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  SkipBack, 
  SkipForward, 
  Settings,
  ArrowLeft,
  Subtitles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SubtitleCustomizer } from "@/components/SubtitleCustomizer";
import { SubtitleUploader } from "@/components/SubtitleUploader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlayerProps {
  videoUrl: string;
  subtitleUrl?: string | null;
  fileName: string;
  onBack: () => void;
}

interface SubtitleSettings {
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  position: 'bottom' | 'center' | 'top';
}

export const VideoPlayer = ({ videoUrl, subtitleUrl, fileName, onBack }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSubtitleCustomizer, setShowSubtitleCustomizer] = useState(false);
  const [showSubtitleUploader, setShowSubtitleUploader] = useState(false);
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>({
    fontSize: 24,
    fontFamily: 'Arial',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#ffffff',
    position: 'bottom'
  });
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [currentSubtitle, setCurrentSubtitle] = useState("");

  let controlsTimeout: NodeJS.Timeout;

  // Load subtitles
  useEffect(() => {
    if (subtitleUrl) {
      fetch(subtitleUrl)
        .then(response => response.text())
        .then(text => {
          // Basic SRT parser - you might want to use a more robust parser
          const lines = text.split('\n');
          const subs = [];
          for (let i = 0; i < lines.length; i += 4) {
            if (lines[i + 2]) {
              subs.push(lines[i + 2]);
            }
          }
          setSubtitles(subs);
        })
        .catch(console.error);
    }
  }, [subtitleUrl]);

  // Update current subtitle based on time (simplified)
  useEffect(() => {
    if (subtitles.length > 0) {
      const index = Math.floor(currentTime / 5); // Very basic timing
      setCurrentSubtitle(subtitles[index] || "");
    }
  }, [currentTime, subtitles]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [volume]);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  // Control functions
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubtitleLoad = (url: string) => {
    fetch(url)
      .then(response => response.text())
      .then(text => {
        const lines = text.split('\n');
        const subs = [];
        for (let i = 0; i < lines.length; i += 4) {
          if (lines[i + 2]) {
            subs.push(lines[i + 2]);
          }
        }
        setSubtitles(subs);
      })
      .catch(console.error);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Subtitle Overlay */}
      {currentSubtitle && (
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 subtitle-text text-center px-4 py-2 rounded-lg max-w-4xl ${
            subtitleSettings.position === 'top' ? 'top-24' :
            subtitleSettings.position === 'center' ? 'top-1/2 -translate-y-1/2' :
            'bottom-24'
          }`}
          style={{
            fontSize: `${subtitleSettings.fontSize}px`,
            fontFamily: subtitleSettings.fontFamily,
            backgroundColor: subtitleSettings.backgroundColor,
            color: subtitleSettings.textColor
          }}
        >
          {currentSubtitle}
        </div>
      )}

      {/* Top Controls */}
      <div className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full p-3"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <h1 className="text-2xl font-bold text-white text-center flex-1 mx-8 truncate">
            {fileName}
          </h1>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowSubtitleUploader(true)}
            className="text-white hover:bg-white/20 rounded-full p-3"
          >
            <Subtitles className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="mb-6">
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-white/70 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls - Centered */}
        <div className="flex items-center justify-center space-x-6 mb-4">
          {/* Skip Back */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => skipTime(-10)}
            className="text-white hover:bg-white/20 rounded-full p-4 hover:scale-110 transition-all"
          >
            <SkipBack className="w-7 h-7" />
          </Button>

          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="lg"
            onClick={togglePlay}
            className="text-white hover:bg-white/20 w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all shadow-lg"
          >
            {isPlaying ? <Pause className="w-9 h-9" /> : <Play className="w-9 h-9 ml-1" />}
          </Button>

          {/* Skip Forward */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => skipTime(10)}
            className="text-white hover:bg-white/20 rounded-full p-4 hover:scale-110 transition-all"
          >
            <SkipForward className="w-7 h-7" />
          </Button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Volume Control */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleMute}
                className="text-white hover:bg-white/20 rounded-full p-3"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="w-28">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="lg" className="text-white hover:bg-white/20 rounded-full px-4 py-3">
                  <Settings className="w-5 h-5 mr-2" />
                  <span className="text-sm">{playbackRate}x</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                  <DropdownMenuItem
                    key={rate}
                    onClick={() => changePlaybackRate(rate)}
                    className={playbackRate === rate ? "bg-primary text-primary-foreground" : ""}
                  >
                    {rate}x
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 rounded-full p-3"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Subtitle Uploader Modal */}
      {showSubtitleUploader && (
        <SubtitleUploader
          onSubtitleLoad={handleSubtitleLoad}
          onOpenSettings={() => {
            setShowSubtitleUploader(false);
            setShowSubtitleCustomizer(true);
          }}
          onClose={() => setShowSubtitleUploader(false)}
        />
      )}

      {/* Subtitle Customizer Modal */}
      {showSubtitleCustomizer && (
        <SubtitleCustomizer
          settings={subtitleSettings}
          onSettingsChange={setSubtitleSettings}
          onClose={() => setShowSubtitleCustomizer(false)}
        />
      )}
    </div>
  );
};