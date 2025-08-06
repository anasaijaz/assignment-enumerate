import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import {
  Folder,
  FileVideo,
  FileAudio,
  FileImage,
  Clock,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import {
  uploadMediaFile,
  removeMediaFile,
  clearUploadError,
  selectFile,
} from "../../store/mediaSlice";
import { addClip } from "../../store/timelineSlice";

export default function MediaLibrary() {
  const dispatch = useDispatch();
  const { mediaFiles, selectedFile, uploadError, uploadProgress } = useSelector(
    (state) => state.media
  );
  const fileInputRef = useRef(null);

  const getFileIcon = (type, thumbnail = null) => {
    if (type === "image" && thumbnail) {
      return (
        <div className="w-5 h-5 rounded overflow-hidden relative border border-border">
          <Image
            src={thumbnail}
            alt="thumbnail"
            fill
            className="object-cover"
            sizes="20px"
          />
        </div>
      );
    }

    switch (type) {
      case "video":
        return <FileVideo className="h-5 w-5 text-primary" />;
      case "audio":
        return <FileAudio className="h-5 w-5 text-secondary-500" />;
      case "image":
        return <FileImage className="h-5 w-5 text-info" />;
      default:
        return <Folder className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach((file) => {
      dispatch(uploadMediaFile(file));
    });
    event.target.value = ""; // Reset input
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (fileId) => {
    dispatch(removeMediaFile(fileId));
  };

  const handleClearError = () => {
    dispatch(clearUploadError());
  };

  const handleSelectFile = (file) => {
    dispatch(selectFile(file));
  };

  const handleAddToTimeline = (file) => {
    // Add directly to the single timeline
    dispatch(addClip({ mediaFile: file }));
  };

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col">
      <div className="p-[14px] border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Media Library</h2>
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary-600 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>

        {/* Upload Progress */}
        {uploadProgress !== null && (
          <div className="mb-4 p-3 bg-surface border border-border rounded-lg">
            <div className="flex items-center justify-between text-xs font-medium mb-2 text-muted-foreground">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">
                  {uploadError}
                </p>
              </div>
              <button
                onClick={handleClearError}
                className="text-destructive hover:text-destructive/80 p-1 rounded transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".mp4,.webm,.mov,.mp3,.wav,.jpg,.jpeg,.png,.gif"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="space-y-2">
          {mediaFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => handleSelectFile(file)}
              onDoubleClick={() => handleAddToTimeline(file)}
              className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                selectedFile?.id === file.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-surface border border-transparent"
              }`}
              title="Double-click to add to timeline"
            >
              {getFileIcon(file.type, file.thumbnail)}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-foreground">
                  {file.name}
                </div>
                <div className="text-xs flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {file.type === "image"
                    ? file.format || "Image"
                    : file.duration}
                  <span>•</span>
                  {file.size}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-md font-medium ${
                    selectedFile?.id === file.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {file.type}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}

          {mediaFiles.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-lg bg-surface/50">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground font-medium mb-2">No media files</p>
              <p className="text-sm text-muted-foreground mb-2">
                Click upload to add files
              </p>
              <p className="text-xs text-muted-foreground">
                MP4, WEBM, MP3, WAV, JPG, PNG, GIF
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Double-click to add to timeline
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
