import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mediaFiles: [],
  selectedFile: null,
  uploadError: null,
  uploadProgress: null,
};

// Helper function to get file type from extension
const getFileType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  if (["mp4", "webm", "mov"].includes(extension)) return "video";
  if (["mp3", "wav"].includes(extension)) return "audio";
  if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "image";
  return "unknown";
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

// Helper function to get media duration
const getMediaDuration = (file) => {
  return new Promise((resolve) => {
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        resolve(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      };
      video.onerror = () => resolve("00:05");
      video.src = URL.createObjectURL(file);
    } else if (file.type.startsWith("audio/")) {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      audio.onloadedmetadata = () => {
        const duration = Math.floor(audio.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        resolve(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      };
      audio.onerror = () => resolve("00:05");
      audio.src = URL.createObjectURL(file);
    } else {
      // For images and other formats, default to 5 seconds
      resolve("00:05");
    }
  });
};

// Helper function to generate thumbnail for images
const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    } else {
      resolve(null);
    }
  });
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    addMediaFile: (state, action) => {
      const newFile = {
        id: Date.now(),
        ...action.payload,
      };

      state.mediaFiles.push(newFile);
      state.uploadError = null;
    },
    removeMediaFile: (state, action) => {
      state.mediaFiles = state.mediaFiles.filter(
        (file) => file.id !== action.payload
      );
    },
    setUploadError: (state, action) => {
      state.uploadError = action.payload;
    },
    clearUploadError: (state) => {
      state.uploadError = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    selectFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    clearSelectedFile: (state) => {
      state.selectedFile = null;
    },
  },
});

export const {
  addMediaFile,
  removeMediaFile,
  setUploadError,
  clearUploadError,
  setUploadProgress,
  selectFile,
  clearSelectedFile,
} = mediaSlice.actions;

// Async action for file upload
export const uploadMediaFile = (file) => async (dispatch) => {
  try {
    dispatch(clearUploadError());
    dispatch(setUploadProgress(0));

    // Validate file type
    const allowedTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Unsupported file type: ${file.type}. Please upload MP4, WebM, MP3, WAV, JPG, PNG, or GIF files.`
      );
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 500MB.");
    }

    dispatch(setUploadProgress(30));

    // Get file metadata
    const fileType = getFileType(file.name);
    const formattedSize = formatFileSize(file.size);
    const duration = await getMediaDuration(file);
    const thumbnail = await generateThumbnail(file);

    dispatch(setUploadProgress(80));

    // Create media file object with file URL
    const fileUrl = URL.createObjectURL(file);
    const mediaFile = {
      name: file.name,
      type: fileType,
      duration,
      size: formattedSize,
      url: fileUrl,
      thumbnail,
    };

    dispatch(addMediaFile(mediaFile));
    dispatch(setUploadProgress(100));

    // Clear progress after a short delay
    setTimeout(() => {
      dispatch(setUploadProgress(null));
    }, 1000);
  } catch (error) {
    dispatch(setUploadError(error.message));
    dispatch(setUploadProgress(null));
  }
};

export default mediaSlice.reducer;
