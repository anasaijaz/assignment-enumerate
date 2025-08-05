import { useSelector } from "react-redux";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  FileVideo,
  FileAudio,
  FileImage,
} from "lucide-react";

export default function VideoPreview({
  isPlaying,
  setIsPlaying,
  currentTime,
  formatTime,
}) {
  const { clips, totalDuration } = useSelector((state) => state.timeline);
  const { files = [] } = useSelector((state) => state.media);

  // Find the current clip based on timeline position
  const getCurrentClip = () => {
    if (!clips?.length) return null;

    for (const clip of clips) {
      if (currentTime >= clip.startTime && currentTime < clip.endTime) {
        // Find the corresponding media file
        const mediaFile = files.find((file) => file.id === clip.mediaFileId);
        return {
          ...clip,
          file: mediaFile?.file,
          thumbnail: mediaFile?.thumbnail,
        };
      }
    }
    return null;
  };

  const currentClip = getCurrentClip();

  const renderPreviewContent = () => {
    if (!currentClip) {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <FileVideo className="h-20 w-20 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">No content on timeline</p>
            <p className="text-sm text-gray-500">
              Add media to the timeline to preview
            </p>
          </div>
        </div>
      );
    }

    if (currentClip.type === "video" && currentClip.file) {
      return (
        <video
          className="absolute inset-0 w-full h-full object-contain"
          src={URL.createObjectURL(currentClip.file)}
          controls={false}
          muted
        />
      );
    }

    if (currentClip.type === "audio") {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <FileAudio className="h-20 w-20 mx-auto mb-4 text-green-500" />
            <p className="text-gray-400">{currentClip.name}</p>
            <p className="text-sm text-gray-500">
              Audio File • {formatTime(currentClip.duration)}
            </p>
          </div>
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
          <FileImage className="h-20 w-20 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">{currentClip.name}</p>
          <p className="text-sm text-gray-500">
            {currentClip.type} • {formatTime(currentClip.duration)}
          </p>
        </div>
      </div>
    );
  };
  return (
    <div className="flex-1 bg-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">
          {currentClip ? currentClip.name : "Timeline Preview"}
        </h2>
        {currentClip && (
          <p className="text-sm text-gray-400 mt-1">
            {currentClip.type} • {formatTime(currentClip.duration)} •{" "}
            {formatTime(currentClip.startTime)}-
            {formatTime(currentClip.endTime)}
          </p>
        )}
        {!currentClip && clips?.length > 0 && (
          <p className="text-sm text-gray-400 mt-1">
            {clips.length} clip{clips.length !== 1 ? "s" : ""} on timeline
          </p>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {/* Preview Area - 16:9 Aspect Ratio */}
        <div className="relative h-full">
          <div className="absolute inset-0 bg-black overflow-hidden">
            {renderPreviewContent()}
          </div>

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
            {/* Top Controls */}
            <div className="absolute top-4 right-4">
              <button className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors">
                <Maximize className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="p-4 bg-black/60 hover:bg-black/80 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!currentClip || currentClip.type === "image"}
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="relative">
                  <div className="w-full h-1 bg-white/30 rounded-full">
                    <div
                      className="h-1 bg-white rounded-full transition-all"
                      style={{
                        width: `${
                          totalDuration > 0
                            ? (currentTime / totalDuration) * 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <div
                    className="absolute top-0 w-3 h-3 bg-white rounded-full transform -translate-y-1 transition-all opacity-0 hover:opacity-100"
                    style={{
                      left: `${
                        totalDuration > 0
                          ? (currentTime / totalDuration) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Control Buttons Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors disabled:opacity-50"
                    disabled={!currentClip || currentClip.type === "image"}
                  >
                    <SkipBack className="h-4 w-4 text-white" />
                  </button>
                  <button
                    className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors disabled:opacity-50"
                    disabled={!currentClip || currentClip.type === "image"}
                  >
                    <SkipForward className="h-4 w-4 text-white" />
                  </button>
                  <div className="flex items-center gap-2 ml-2">
                    <Volume2 className="h-4 w-4 text-white" />
                    <div className="w-16 h-1 bg-white/30 rounded-full">
                      <div
                        className="h-1 bg-white rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white">
                  <span>{formatTime(currentTime)}</span>
                  <span>/</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
