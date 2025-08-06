import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clips: [], // Single track - just an array of clips
  totalDuration: 0,
  currentTime: 0,
  isPlaying: false,
  pixelsPerSecond: 100, // 100 pixels represent one second
};

// Helper function to calculate clip positions
const calculateClipPositions = (clips, pixelsPerSecond = 100) => {
  let currentPosition = 0;
  return clips.map((clip) => {
    // Use trimmed duration instead of original duration
    const trimStart = clip.trimStart || 0;
    const trimEnd = clip.trimEnd || clip.duration;
    const clipDuration = trimEnd - trimStart;
    const clipWithPosition = {
      ...clip,
      startTime: currentPosition,
      endTime: currentPosition + clipDuration,
      pixelStart: currentPosition * pixelsPerSecond,
      pixelWidth: clipDuration * pixelsPerSecond,
    };
    currentPosition += clipDuration;
    return clipWithPosition;
  });
};

// Helper function to calculate total timeline duration
const calculateTotalDuration = (clips) => {
  return clips.reduce((total, clip) => {
    // Use trimmed duration instead of original duration
    const trimStart = clip.trimStart || 0;
    const trimEnd = clip.trimEnd || clip.duration;
    const trimmedDuration = trimEnd - trimStart;
    return total + trimmedDuration;
  }, 0);
};

const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    addClip: (state, action) => {
      const { mediaFile } = action.payload;

      console.log(mediaFile);

      // Parse duration from MM:SS format to seconds
      const durationString = mediaFile.duration || "00:30";
      console.log(durationString);
      const [minutes, seconds] = durationString.split(":").map(Number);
      const durationInSeconds = minutes * 60 + seconds;

      console.log(
        `Adding clip: ${mediaFile.name}, duration: ${durationString}, parsed: ${durationInSeconds}s`
      );

      const newClip = {
        id: Date.now(),
        mediaFileId: mediaFile.id,
        name: mediaFile.name,
        type: mediaFile.type,
        duration: durationInSeconds,
        thumbnail: mediaFile.thumbnail,
        startTime: state.totalDuration,
        endTime: state.totalDuration + durationInSeconds,
        pixelStart: state.totalDuration * state.pixelsPerSecond,
        pixelWidth: durationInSeconds * state.pixelsPerSecond,
      };

      state.clips.push(newClip);

      // Update total duration to the end of the new clip
      state.totalDuration = newClip.endTime;
    },

    removeClip: (state, action) => {
      const { clipId } = action.payload;

      state.clips = state.clips.filter((clip) => clip.id !== clipId);

      // Don't recalculate positions - keep clips in their original positions
      // Only update total duration to reflect the timeline's actual end
      if (state.clips.length > 0) {
        const lastClip = state.clips.reduce((latest, clip) =>
          clip.endTime > latest.endTime ? clip : latest
        );
        state.totalDuration = lastClip.endTime;
      } else {
        state.totalDuration = 0;
      }
    },

    moveClip: (state, action) => {
      const { clipId, newPosition } = action.payload;

      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId);
      if (clipIndex !== -1) {
        // Remove clip from current position
        const [clip] = state.clips.splice(clipIndex, 1);

        // Insert at new position
        state.clips.splice(newPosition, 0, clip);

        // Recalculate positions
        state.clips = calculateClipPositions(
          state.clips,
          state.pixelsPerSecond
        );

        // Update total duration
        state.totalDuration = calculateTotalDuration(state.clips);
      }
    },

    setCurrentTime: (state, action) => {
      state.currentTime = action.payload;
    },

    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },

    trimClip: (state, action) => {
      const { clipId, trimStart, trimEnd } = action.payload;

      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId);
      if (clipIndex !== -1) {
        const clip = state.clips[clipIndex];
        const trimmedDuration = trimEnd - trimStart;

        // Calculate how much we're trimming from the start
        const originalTrimStart = clip.trimStart || 0;
        const trimFromStart = trimStart - originalTrimStart;

        // New start time: move right if we're trimming from start
        const newStartTime = clip.startTime + trimFromStart;
        const newEndTime = newStartTime + trimmedDuration;

        // Update the clip with new position and trim values
        state.clips[clipIndex] = {
          ...clip,
          trimStart: trimStart,
          trimEnd: trimEnd,
          startTime: newStartTime,
          endTime: newEndTime,
          pixelStart: newStartTime * state.pixelsPerSecond,
          pixelWidth: trimmedDuration * state.pixelsPerSecond,
        };

        console.log("Updated clip:", { ...state.clips[clipIndex] });

        // Update total duration only if this was the last clip or if it affects the timeline end
        const maxEndTime = Math.max(...state.clips.map((c) => c.endTime));
        state.totalDuration = maxEndTime;
      }
    },

    setClipPosition: (state, action) => {
      const { clipId, newStartTime } = action.payload;

      const clipIndex = state.clips.findIndex((clip) => clip.id === clipId);
      if (clipIndex !== -1) {
        const clip = state.clips[clipIndex];
        const trimStart = clip.trimStart || 0;
        const trimEnd = clip.trimEnd || clip.duration;
        const trimmedDuration = trimEnd - trimStart;
        const clampedStartTime = Math.max(0, newStartTime);
        const newEndTime = clampedStartTime + trimmedDuration;

        // Check for overlaps with other clips
        const otherClips = state.clips.filter((c) => c.id !== clipId);
        const hasOverlap = otherClips.some((otherClip) => {
          const otherTrimStart = otherClip.trimStart || 0;
          const otherTrimEnd = otherClip.trimEnd || otherClip.duration;
          const otherStart = otherClip.startTime;
          const otherEnd =
            otherClip.startTime + (otherTrimEnd - otherTrimStart);

          // Check if new position would overlap with this clip
          return (
            (clampedStartTime >= otherStart && clampedStartTime < otherEnd) ||
            (newEndTime > otherStart && newEndTime <= otherEnd) ||
            (clampedStartTime <= otherStart && newEndTime >= otherEnd)
          );
        });

        // Only update position if there's no overlap
        if (!hasOverlap) {
          // Update clip position
          state.clips[clipIndex] = {
            ...clip,
            startTime: clampedStartTime,
            endTime: newEndTime,
            pixelStart: clampedStartTime * state.pixelsPerSecond,
          };

          // Update total duration if needed
          if (newEndTime > state.totalDuration) {
            state.totalDuration = newEndTime;
          }
        }
      }
    },

    clearTimeline: (state) => {
      state.clips = [];
      state.totalDuration = 0;
      state.currentTime = 0;
      state.isPlaying = false;
    },
  },
});

export const {
  addClip,
  removeClip,
  moveClip,
  setCurrentTime,
  setIsPlaying,
  trimClip,
  setClipPosition,
  clearTimeline,
} = timelineSlice.actions;

export default timelineSlice.reducer;
