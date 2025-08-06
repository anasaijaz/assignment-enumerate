import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  FileVideo,
  FileAudio,
  FileImage,
} from "lucide-react";
import { setCurrentTime } from "../../store/timelineSlice";
import spacebarKey from "@/assets/keys/spacebar.png";
import leftKey from "@/assets/keys/left.png";
import rightKey from "@/assets/keys/right.png";

export default function VideoPreview({
  isPlaying,
  setIsPlaying,
  currentTime,
  formatTime,
}) {
  const dispatch = useDispatch();
  const { clips, totalDuration } = useSelector((state) => state.timeline);
  const { mediaFiles = [] } = useSelector((state) => state.media);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [volume, setVolume] = useState(0.75);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default behavior if we're handling the key
      if (
        e.code === "Space" ||
        e.code === "ArrowLeft" ||
        e.code === "ArrowRight"
      ) {
        e.preventDefault();

        // Only handle keyboard if not typing in an input/textarea
        if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
          return;
        }

        switch (e.code) {
          case "Space":
            // Toggle play/pause
            if (clips?.length > 0) {
              setIsPlaying(!isPlaying);
            }
            break;
          case "ArrowLeft":
            // Seek backward 1 second
            const newTimeBackward = Math.max(0, currentTime - 1);
            dispatch(setCurrentTime(newTimeBackward));
            break;
          case "ArrowRight":
            // Seek forward 1 second
            const newTimeForward = Math.min(totalDuration, currentTime + 1);
            dispatch(setCurrentTime(newTimeForward));
            break;
        }
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, setIsPlaying, currentTime, totalDuration, clips, dispatch]);

  // Timer to update current time during playback
  useEffect(() => {
    if (isPlaying && clips.length > 0) {
      timerRef.current = setInterval(() => {
        const newTime = currentTime + 0.1; // Update every 100ms

        // Stop playback when reaching the end of timeline
        if (newTime >= totalDuration) {
          setIsPlaying(false);
          dispatch(setCurrentTime(totalDuration));
        } else {
          dispatch(setCurrentTime(newTime));
        }
      }, 100); // 100ms intervals for smooth playback
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [
    isPlaying,
    clips.length,
    totalDuration,
    currentTime,
    dispatch,
    setIsPlaying,
  ]);

  // Sync media element current time with timeline position
  useEffect(() => {
    // Find the current clip based on timeline position
    const getCurrentClipForSync = () => {
      if (!clips?.length) return null;

      for (const clip of clips) {
        if (currentTime >= clip.startTime && currentTime < clip.endTime) {
          const mediaFile = mediaFiles.find(
            (file) => file.id === clip.mediaFileId
          );
          return {
            ...clip,
            url: mediaFile?.url,
            thumbnail: mediaFile?.thumbnail,
          };
        }
      }
      return null;
    };

    const currentClip = getCurrentClipForSync();
    if (!currentClip) return;

    const mediaElement =
      currentClip.type === "video"
        ? videoRef.current
        : currentClip.type === "audio"
        ? audioRef.current
        : null;

    if (mediaElement) {
      // Calculate the time within the current clip
      const clipStartTime = currentClip.trimStart || 0;
      const relativeTime = currentTime - currentClip.startTime;
      const mediaTime = clipStartTime + relativeTime;

      // Only update if there's a significant difference to avoid infinite loops
      if (Math.abs(mediaElement.currentTime - mediaTime) > 0.2) {
        mediaElement.currentTime = Math.max(0, mediaTime);
      }

      // Set volume
      mediaElement.volume = volume;

      // Sync play/pause state
      if (isPlaying && mediaElement.paused) {
        mediaElement.play().catch(console.error);
      } else if (!isPlaying && !mediaElement.paused) {
        mediaElement.pause();
      }
    }
  }, [currentTime, isPlaying, clips, mediaFiles, volume]);

  // Find the current clip based on timeline position
  const getCurrentClip = () => {
    if (!clips?.length) return null;

    for (const clip of clips) {
      if (currentTime >= clip.startTime && currentTime < clip.endTime) {
        // Find the corresponding media file
        const mediaFile = mediaFiles.find(
          (file) => file.id === clip.mediaFileId
        );

        return {
          ...clip,
          url: mediaFile?.url,
          thumbnail: mediaFile?.thumbnail,
        };
      }
    }
    return null;
  };

  const currentClip = getCurrentClip();

  const renderPreviewContent = () => {
    if (!currentClip) {
      // If there are clips on the timeline but none at current position, show black screen
      if (clips?.length > 0) {
        return <div className="absolute inset-0 bg-black" />;
      }

      // Only show "No content" message when timeline is completely empty
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <FileVideo className="h-20 w-20 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No content on timeline</p>
            <p className="text-sm text-muted-foreground">
              Add media to the timeline to preview
            </p>
          </div>
        </div>
      );
    }

    if (currentClip.type === "video" && currentClip.url) {
      return (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          src={currentClip.url}
          controls={false}
        />
      );
    }

    if (currentClip.type === "audio") {
      return (
        <div className="absolute inset-0 bg-black">
          <audio
            ref={audioRef}
            src={currentClip.url}
            controls={false}
            style={{ display: "none" }}
          />
        </div>
      );
    }

    if (currentClip.type === "image" && currentClip.thumbnail) {
      return (
        <Image
          src={currentClip.thumbnail}
          alt={currentClip.name}
          fill
          className="object-contain"
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      );
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <FileImage className="h-20 w-20 mx-auto mb-4 text-info" />
          <p className="text-muted-foreground">{currentClip.name}</p>
          <p className="text-sm text-muted-foreground">
            {currentClip.type} • {formatTime(currentClip.duration)}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex-1 bg-background border-r border-border flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {currentClip ? currentClip.name : "Timeline Preview"}
            </h2>
            {currentClip && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentClip.type} • {formatTime(currentClip.duration)} •{" "}
                {formatTime(currentClip.startTime)}-
                {formatTime(currentClip.endTime)}
              </p>
            )}
            {!currentClip && clips?.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {clips.length} clip{clips.length !== 1 ? "s" : ""} on timeline
              </p>
            )}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <div className="flex items-center">
                  <Image
                    src={spacebarKey}
                    alt="Spacebar key"
                    width={40}
                    height={24}
                    className="opacity-70"
                  />
                </div>
                Play/Pause
              </span>
              <span className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Image
                    src={leftKey}
                    alt="Left arrow key"
                    width={16}
                    height={16}
                    className="opacity-70"
                  />
                  <Image
                    src={rightKey}
                    alt="Right arrow key"
                    width={16}
                    height={16}
                    className="opacity-70"
                  />
                </div>
                Seek ±1s
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {/* Preview Area - 16:9 Aspect Ratio */}
        <div className="relative h-full">
          <div className="absolute inset-0 bg-black overflow-hidden">
            {renderPreviewContent()}
          </div>

          {/* Overlay Controls */}
          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="p-4 bg-primary/80 hover:bg-primary rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={clips?.length === 0}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-primary-foreground" />
                ) : (
                  <Play className="h-8 w-8 text-primary-foreground ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              {/* Progress Bar - HTML Range Slider */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={totalDuration}
                  step="0.1"
                  value={currentTime}
                  onChange={(e) =>
                    dispatch(setCurrentTime(parseFloat(e.target.value)))
                  }
                  className="w-full h-1 bg-transparent rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-0"
                  style={{
                    background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
                      totalDuration > 0
                        ? (currentTime / totalDuration) * 100
                        : 0
                    }%, rgba(255,255,255,0.3) ${
                      totalDuration > 0
                        ? (currentTime / totalDuration) * 100
                        : 0
                    }%, rgba(255,255,255,0.3) 100%)`,
                    height: "4px",
                    WebkitAppearance: "none",
                    outline: "none",
                  }}
                />
              </div>

              {/* Control Buttons Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 ml-2">
                      <Volume2 className="h-4 w-4 text-white" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-0"
                        style={{
                          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${
                            volume * 100
                          }%, rgba(255,255,255,0.3) ${
                            volume * 100
                          }%, rgba(255,255,255,0.3) 100%)`,
                          height: "4px",
                          WebkitAppearance: "none",
                          outline: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white font-medium">
                  <span>{Math.round(currentTime)}s</span>
                  <span>/</span>
                  <span>{Math.round(totalDuration)}s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
