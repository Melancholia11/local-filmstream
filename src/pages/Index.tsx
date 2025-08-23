import { useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { VideoLibrary } from "@/components/VideoLibrary";

interface VideoItem {
  id: string;
  url: string;
  name: string;
  subtitle?: string;
}

const Index = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const handleVideoSelect = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  return (
    <>
      {!selectedVideo ? (
        <VideoLibrary onVideoSelect={handleVideoSelect} />
      ) : (
        <VideoPlayer
          videoUrl={selectedVideo.url}
          subtitleUrl={selectedVideo.subtitle}
          fileName={selectedVideo.name}
          onBack={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
};

export default Index;