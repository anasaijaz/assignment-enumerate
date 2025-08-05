"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MediaLibrary from "../../../components/media-timeline/MediaLibrary";
import VideoPreview from "../../../components/media-timeline/VideoPreview";
import Timeline from "../../../components/media-timeline/Timeline";
import { setCurrentTime, setIsPlaying } from "../../../store/timelineSlice";

export default function MediaTimelinePage() {
  const dispatch = useDispatch();
  const { currentTime, isPlaying } = useSelector((state) => state.timeline);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSetIsPlaying = (playing) => {
    dispatch(setIsPlaying(playing));
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Section */}
      <div className="flex flex-1 min-h-0">
        {/* Media Directory - Left */}
        <MediaLibrary />

        {/* Media Playback - Right */}
        <VideoPreview
          isPlaying={isPlaying}
          setIsPlaying={handleSetIsPlaying}
          currentTime={currentTime}
          formatTime={formatTime}
        />
      </div>

      {/* Timeline Section - Bottom */}
      <Timeline formatTime={formatTime} />
    </div>
  );
}
