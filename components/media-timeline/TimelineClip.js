import { X, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TimelineClip({
  clip,
  pixelsPerSecond,
  onRemove,
  onEdit,
  onMouseDown,
  isDragging,
}) {
  const isTrimmable = clip.type === "video" || clip.type === "audio";
  const trimStart = clip.trimStart || 0;
  const trimEnd = clip.trimEnd || clip.duration;
  const trimmedDuration = trimEnd - trimStart;
  const trimmedWidth = trimmedDuration * pixelsPerSecond;

  const getTrackColor = (type) => {
    switch (type) {
      case "video":
        return "bg-primary/90 border border-primary";
      case "audio":
        return "bg-secondary-500/90 border border-secondary-500";
      case "image":
        return "bg-info/90 border border-info";
      default:
        return "bg-muted border border-border";
    }
  };

  return (
    <motion.div
      className={`group absolute top-1 bottom-1 ${getTrackColor(
        clip.type
      )} px-3 flex items-center font-medium rounded-md ${
        isDragging
          ? "cursor-grabbing z-20 "
          : "cursor-grab hover:opacity-90 transition-all"
      }`}
      style={{
        left: `${clip.pixelStart}px`,
        width: `${trimmedWidth}px`,
      }}
      animate={{}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.05,
      }}
      onMouseDown={onMouseDown}
    >
      <span className="text-xs font-medium text-white truncate flex-1">
        {clip.name}
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isTrimmable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(clip);
            }}
            className="p-1 hover:bg-white/20 rounded transition-all"
            title="Trim clip"
          >
            <Edit3 className="h-3 w-3 text-white" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(clip.id);
          }}
          className="p-1 hover:bg-white/20 rounded transition-all"
        >
          <X className="h-3 w-3 text-white" />
        </button>
      </div>
    </motion.div>
  );
}
