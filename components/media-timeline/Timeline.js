import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Scissors,
  FileVideo,
  X,
  Edit3,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  removeClip,
  trimClip,
  setCurrentTime,
  setClipPosition,
  setIsPlaying,
} from "../../store/timelineSlice";
import TimeRuler from "./TimeRuler";
import TimelineClip from "./TimelineClip";
import TrimDialog from "./TrimDialog";

export default function Timeline({ formatTime }) {
  const dispatch = useDispatch();
  const { clips, currentTime, totalDuration, pixelsPerSecond, isPlaying } =
    useSelector((state) => state.timeline);
  const [editingClip, setEditingClip] = useState(null);
  const [showTrimDialog, setShowTrimDialog] = useState(false);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [isDraggingClip, setIsDraggingClip] = useState(false);
  const [draggedClip, setDraggedClip] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [snapLine, setSnapLine] = useState(null); // For showing snap guides
  const timelineRef = useRef(null);
  const timelineContainerRef = useRef(null);

  const handleRemoveClip = (clipId) => {
    dispatch(removeClip({ clipId }));
  };

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTime - 10);
    dispatch(setCurrentTime(newTime));
  };

  const handleSkipForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 10);
    dispatch(setCurrentTime(newTime));
  };

  const handleEditClip = (clip) => {
    setEditingClip(clip);
    setShowTrimDialog(true);
  };

  const handleApplyTrim = (trimData) => {
    dispatch(trimClip(trimData));
    setEditingClip(null);
    setShowTrimDialog(false);
  };

  const handleCancelTrim = () => {
    setEditingClip(null);
    setShowTrimDialog(false);
  };

  // Playhead drag handlers
  const handlePlayheadMouseDown = (e) => {
    e.preventDefault();
    setIsDraggingPlayhead(true);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      if (isDraggingPlayhead) {
        const newTime = clickX / pixelsPerSecond;
        const clampedTime = Math.max(0, Math.min(newTime, totalDuration));
        dispatch(setCurrentTime(clampedTime));
      } else if (isDraggingClip && draggedClip) {
        // Calculate new start time for the clip
        let newStartTime = (clickX - dragOffset) / pixelsPerSecond;

        // Snap to nearby clips
        const snapDistance = 10 / pixelsPerSecond; // 10 pixels in time units
        const draggedClipDuration =
          (draggedClip.trimEnd || draggedClip.duration) -
          (draggedClip.trimStart || 0);
        const draggedClipEndTime = newStartTime + draggedClipDuration;
        let snapPosition = null;

        // Find nearby clips (excluding the dragged clip)
        const otherClips = clips.filter((clip) => clip.id !== draggedClip.id);

        for (const clip of otherClips) {
          const clipStart = clip.startTime;
          const clipEnd =
            clip.startTime +
            ((clip.trimEnd || clip.duration) - (clip.trimStart || 0));

          // Check if dragged clip start is close to other clip's end
          if (Math.abs(newStartTime - clipEnd) < snapDistance) {
            newStartTime = clipEnd;
            snapPosition = clipEnd * pixelsPerSecond;
            break;
          }

          // Check if dragged clip start is close to other clip's start
          if (Math.abs(newStartTime - clipStart) < snapDistance) {
            newStartTime = clipStart;
            snapPosition = clipStart * pixelsPerSecond;
            break;
          }

          // Check if dragged clip end is close to other clip's start
          if (Math.abs(draggedClipEndTime - clipStart) < snapDistance) {
            newStartTime = clipStart - draggedClipDuration;
            snapPosition = clipStart * pixelsPerSecond;
            break;
          }

          // Check if dragged clip end is close to other clip's end
          if (Math.abs(draggedClipEndTime - clipEnd) < snapDistance) {
            newStartTime = clipEnd - draggedClipDuration;
            snapPosition = clipEnd * pixelsPerSecond;
            break;
          }
        }

        // Snap to timeline start (0)
        if (Math.abs(newStartTime) < snapDistance) {
          newStartTime = 0;
          snapPosition = 0;
        }

        // Update snap line for visual feedback
        setSnapLine(snapPosition);

        // Dispatch the position update - overlap checking is handled in the reducer
        dispatch(
          setClipPosition({
            clipId: draggedClip.id,
            newStartTime: newStartTime,
          })
        );
      }
    },
    [
      isDraggingPlayhead,
      isDraggingClip,
      draggedClip,
      dragOffset,
      pixelsPerSecond,
      totalDuration,
      clips,
      dispatch,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingPlayhead(false);
    setIsDraggingClip(false);
    setDraggedClip(null);
    setDragOffset(0);
    setSnapLine(null); // Clear snap line when drag ends
  }, []);

  // Clip drag handlers
  const handleClipMouseDown = (e, clip) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent timeline click

    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clipPixelStart = clip.startTime * pixelsPerSecond;

    setIsDraggingClip(true);
    setDraggedClip(clip);
    setDragOffset(clickX - clipPixelStart); // Store offset from clip start
  };

  // Add global mouse event listeners when dragging
  useEffect(() => {
    if (isDraggingPlayhead || isDraggingClip) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDraggingPlayhead, isDraggingClip, handleMouseMove, handleMouseUp]);

  // Auto-scroll timeline to keep playhead visible
  useEffect(() => {
    if (!timelineContainerRef.current || isDraggingPlayhead || isDraggingClip)
      return;

    const container = timelineContainerRef.current;
    const playheadPosition = currentTime * pixelsPerSecond;
    const containerWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const scrollRight = scrollLeft + containerWidth;

    // Add some padding so playhead doesn't touch the edges
    const padding = 100;

    // Check if playhead is outside visible area
    if (playheadPosition < scrollLeft + padding) {
      // Scroll left to keep playhead visible
      container.scrollTo({
        left: Math.max(0, playheadPosition - padding),
        behavior: "smooth",
      });
    } else if (playheadPosition > scrollRight - padding) {
      // Scroll right to keep playhead visible
      container.scrollTo({
        left: playheadPosition - containerWidth + padding,
        behavior: "smooth",
      });
    }
  }, [currentTime, pixelsPerSecond, isDraggingPlayhead, isDraggingClip]);

  return (
    <div className="h-32 bg-background border-t border-border flex flex-col">
      <div className="px-4 py-2 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Timeline</h2>

          <div className="flex items-center gap-1">
            <button
              onClick={handleSkipBackward}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface rounded transition-colors"
              title="Skip 10s backward"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              onClick={handlePlayPause}
              className="p-1.5 bg-primary text-primary-foreground hover:bg-primary-600 rounded transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={handleSkipForward}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface rounded transition-colors"
              title="Skip 10s forward"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Track Label */}
        <div className="w-32 bg-background border-r border-border">
          <div className="h-8 bg-background border-b border-border" />

          <div className="h-12 flex items-center px-3 border-b border-t border-border bg-background">
            <div className="flex items-center gap-2">
              <FileVideo className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium truncate text-foreground">
                Main Track
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div
          ref={timelineContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden bg-background"
        >
          <div
            ref={timelineRef}
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
            <div className="h-12 border-b border-border relative bg-background">
              {clips.map((clip) => (
                <TimelineClip
                  key={clip.id}
                  clip={clip}
                  pixelsPerSecond={pixelsPerSecond}
                  onRemove={handleRemoveClip}
                  onEdit={handleEditClip}
                  onMouseDown={(e) => handleClipMouseDown(e, clip)}
                  isDragging={isDraggingClip && draggedClip?.id === clip.id}
                />
              ))}
            </div>

            {/* Snap Line */}
            {snapLine !== null && (
              <motion.div
                className="absolute top-0 bottom-0 w-0.5 bg-primary z-30 pointer-events-none"
                style={{ left: `${snapLine}px` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            )}

            {/* Playhead */}
            <motion.div
              className={`absolute top-0 bottom-0 w-0.5 bg-primary z-10 ${
                isDraggingPlayhead ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{ left: `${currentTime * pixelsPerSecond}px` }}
              animate={{
                left: `${currentTime * pixelsPerSecond}px`,
              }}
              transition={{
                type: "spring",
                stiffness: isDraggingPlayhead ? 1000 : 300,
                damping: isDraggingPlayhead ? 50 : 30,
                mass: 0.8,
                duration: isDraggingPlayhead ? 0 : 0.3,
              }}
              onMouseDown={handlePlayheadMouseDown}
            >
              <motion.div
                className={`absolute top-0 w-3 h-3 bg-primary rounded-full transform -left-[5px] -translate-y-0.5 ${
                  isDraggingPlayhead ? "cursor-grabbing" : "cursor-grab"
                }`}
                animate={{
                  scale: isDraggingPlayhead ? 1.2 : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
                onMouseDown={handlePlayheadMouseDown}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Trim Controls Dialog */}
      <TrimDialog
        editingClip={editingClip}
        showTrimDialog={showTrimDialog}
        setShowTrimDialog={setShowTrimDialog}
        onApplyTrim={handleApplyTrim}
        onCancelTrim={handleCancelTrim}
        formatTime={formatTime}
      />
    </div>
  );
}
