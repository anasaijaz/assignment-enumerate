import { useSelector, useDispatch } from "react-redux";
import { Scissors, FileVideo, X } from "lucide-react";
import { removeClip } from "../../store/timelineSlice";
import TimeRuler from "./TimeRuler";

export default function Timeline({ formatTime }) {
  const dispatch = useDispatch();
  const { clips, currentTime, totalDuration, pixelsPerSecond } = useSelector(
    (state) => state.timeline
  );

  const handleRemoveClip = (clipId) => {
    dispatch(removeClip({ clipId }));
  };

  const getTrackColor = (type) => {
    switch (type) {
      case "video":
        return "bg-blue-500";
      case "audio":
        return "bg-green-500";
      case "image":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-32 bg-gray-800 border-t border-gray-700 flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <Scissors className="h-4 w-4" />
          Timeline
        </h2>
      </div>

      <div className="flex-1 flex">
        {/* Track Label */}
        <div className="w-32 bg-gray-700 border-r border-gray-600">
          <div className="h-8" />

          <div className="h-12 flex items-center px-3 border-b border-t border-gray-600">
            <div className="flex items-center gap-2">
              <FileVideo className="h-3 w-3 text-blue-400" />
              <span className="text-xs font-medium truncate">Main Track</span>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div
            className="relative"
            style={{
              minWidth: `${Math.max(
                totalDuration * pixelsPerSecond + 80,
                6000
              )}px`, // +80 for label space
            }}
          >
            {/* Time Ruler */}
            <TimeRuler
              totalDuration={Math.max(totalDuration, 60)} // Minimum 1 minute visible
              pixelsPerSecond={pixelsPerSecond}
              formatTime={formatTime}
            />

            {/* Single Track */}
            <div className="h-12 border-b border-gray-600 relative">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className={`group absolute top-1 bottom-1 ${getTrackColor(
                    clip.type
                  )} rounded px-2 flex items-center cursor-pointer hover:opacity-80 transition-opacity`}
                  style={{
                    left: `${clip.pixelStart}px`,
                    width: `${clip.pixelWidth}px`,
                  }}
                >
                  <span className="text-xs font-medium text-white truncate flex-1">
                    {clip.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveClip(clip.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 ml-1 p-0.5 hover:bg-black/20 rounded transition-all"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>

            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
            >
              <div className="absolute top-0 w-3 h-3 bg-red-500 transform -translate-x-1.5 -translate-y-1 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
