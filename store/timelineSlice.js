import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clips: [], // Single track - just an array of clips
  totalDuration: 0,
  currentTime: 0,
  isPlaying: false,
  zoom: 1, // Timeline zoom level
  pixelsPerSecond: 100, // 100 pixels represent one second
};

// Helper function to calculate clip positions
const calculateClipPositions = (clips, pixelsPerSecond = 100) => {
  let currentPosition = 0;
  return clips.map((clip) => {
    const clipDuration = clip.duration; // Use the actual duration from the clip
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
    return total + clip.duration;
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

    setZoom: (state, action) => {
      state.zoom = action.payload;
      state.pixelsPerSecond = 100 * action.payload;

      // Recalculate all clip positions with new zoom
      state.clips = state.clips.map((clip) => ({
        ...clip,
        pixelStart: clip.startTime * state.pixelsPerSecond,
        pixelWidth: clip.duration * state.pixelsPerSecond,
      }));
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
  setZoom,
  clearTimeline,
} = timelineSlice.actions;

export default timelineSlice.reducer;
