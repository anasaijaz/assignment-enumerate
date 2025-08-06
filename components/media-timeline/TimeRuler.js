import { useDispatch } from "react-redux";
import { setCurrentTime } from "../../store/timelineSlice";

export default function TimeRuler({
  totalDuration,
  pixelsPerSecond,
  formatTime,
}) {
  const dispatch = useDispatch();

  // Handle clicking on the time ruler to seek
  const handleTimeRulerClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickTime = clickX / pixelsPerSecond;

    // Clamp the time to valid range
    const newTime = Math.max(0, Math.min(clickTime, totalDuration));

    dispatch(setCurrentTime(newTime));
  };

  // With 100px per second, show major markers every 10 seconds (1000px)
  // This gives us a clean, readable timeline
  const majorInterval = 10; // seconds
  const minorInterval = 5; // seconds

  const totalWidth = totalDuration * pixelsPerSecond;
  const majorMarkerCount = Math.ceil(totalDuration / majorInterval) + 1;
  const minorMarkerCount = Math.ceil(totalDuration / minorInterval) + 1;

  // Add extra space at the end to accommodate the last time label
  const extraSpace = 80; // pixels for the last label

  return (
    <div
      className="h-8 bg-background border-b border-border relative cursor-pointer"
      style={{ minWidth: `${totalWidth + extraSpace}px` }}
      onClick={handleTimeRulerClick}
    >
      {/* Major tick marks (every 10 seconds) */}
      {Array.from({ length: majorMarkerCount }, (_, i) => {
        const timeValue = i * majorInterval;
        const position = timeValue * pixelsPerSecond;

        return (
          <div
            key={`major-${i}`}
            className="absolute top-0 bottom-0 flex flex-col"
            style={{ left: `${position}px` }}
          >
            {/* Time label - positioned at the top */}
            <span className="absolute -top-0.5 text-[10px] text-muted-foreground whitespace-nowrap bg-background px-1 border border-border rounded-sm transform -translate-x-1/2 font-medium">
              {formatTime(timeValue)}
            </span>
            {/* Major tick mark - extends from bottom */}
            <div className="w-0.5 h-full bg-border absolute bottom-0"></div>
          </div>
        );
      })}

      {/* Minor tick marks (every 5 seconds, but not on major marks) */}
      {Array.from({ length: minorMarkerCount }, (_, i) => {
        const timeValue = i * minorInterval;
        const position = timeValue * pixelsPerSecond;

        // Skip if this overlaps with a major tick
        if (timeValue % majorInterval === 0) return null;

        return (
          <div
            key={`minor-${i}`}
            className="absolute bottom-0"
            style={{ left: `${position}px` }}
          >
            <div className="w-0.5 h-5 bg-border"></div>
          </div>
        );
      })}

      {/* Second marks (every 1 second) */}
      {pixelsPerSecond >= 50 &&
        Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => {
          const timeValue = i;
          const position = timeValue * pixelsPerSecond;

          // Skip if this overlaps with minor or major ticks
          if (timeValue % minorInterval === 0) return null;

          return (
            <div
              key={`second-${i}`}
              className="absolute bottom-0"
              style={{ left: `${position}px` }}
            >
              <div className="w-0.5 h-3 bg-border"></div>
            </div>
          );
        })}

      {pixelsPerSecond >= 80 &&
        Array.from({ length: Math.ceil(totalDuration * 4) + 1 }, (_, i) => {
          const timeValue = i * 0.25;
          const position = timeValue * pixelsPerSecond;

          // Skip if this overlaps with second, minor, or major ticks
          if (timeValue % 1 === 0) return null;

          return (
            <div
              key={`quarter-${i}`}
              className="absolute bottom-0"
              style={{ left: `${position}px` }}
            >
              <div className="w-0.5 h-2 bg-border opacity-75"></div>
            </div>
          );
        })}

      {/* Tenth-second marks (every 0.1 seconds) - only when very zoomed in */}
      {pixelsPerSecond >= 200 &&
        Array.from({ length: Math.ceil(totalDuration * 10) + 1 }, (_, i) => {
          const timeValue = i * 0.1;
          const position = timeValue * pixelsPerSecond;

          // Skip if this overlaps with any other tick
          if (timeValue % 0.25 === 0) return null;

          return (
            <div
              key={`tenth-${i}`}
              className="absolute bottom-0"
              style={{ left: `${position}px` }}
            >
              <div className="w-0.5 h-1 bg-border opacity-50"></div>
            </div>
          );
        })}
    </div>
  );
}
