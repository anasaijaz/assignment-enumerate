export default function TimeRuler({
  totalDuration,
  pixelsPerSecond,
  formatTime,
}) {
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
      className="h-8 bg-gray-600 border-b border-gray-500 relative"
      style={{ minWidth: `${totalWidth + extraSpace}px` }}
    >
      {/* Major tick marks (every 10 seconds) */}
      {Array.from({ length: majorMarkerCount }, (_, i) => {
        const timeValue = i * majorInterval;
        const position = timeValue * pixelsPerSecond;

        return (
          <div
            key={`major-${i}`}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: `${position}px` }}
          >
            {/* Major tick mark */}
            <div className="w-px h-full bg-gray-300"></div>
            {/* Time label - positioned inside the ruler */}
            <span className="absolute top-1 text-[10px] text-gray-200 whitespace-nowrap bg-gray-600 px-1 rounded">
              {formatTime(timeValue)}
            </span>
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
            className="absolute top-0"
            style={{ left: `${position}px` }}
          >
            <div className="w-px h-4 bg-gray-400"></div>
          </div>
        );
      })}

      {/* Second marks (every 1 second, very subtle) */}
      {pixelsPerSecond >= 50 &&
        Array.from({ length: Math.ceil(totalDuration) + 1 }, (_, i) => {
          const timeValue = i;
          const position = timeValue * pixelsPerSecond;

          // Skip if this overlaps with minor or major ticks
          if (timeValue % minorInterval === 0) return null;

          return (
            <div
              key={`second-${i}`}
              className="absolute top-0"
              style={{ left: `${position}px` }}
            >
              <div className="w-px h-2 bg-gray-500"></div>
            </div>
          );
        })}
    </div>
  );
}
