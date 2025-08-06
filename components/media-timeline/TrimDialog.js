import { useState, useEffect } from "react";
import { Edit3 } from "lucide-react";
import {
  CustomDialog,
  CustomDialogContent,
  CustomDialogHeader,
  CustomDialogTitle,
  CustomDialogFooter,
} from "../common/CustomDialog";

export default function TrimDialog({
  editingClip,
  showTrimDialog,
  setShowTrimDialog,
  onApplyTrim,
  onCancelTrim,
  formatTime,
}) {
  const [trimValues, setTrimValues] = useState({ start: "", end: "" });
  const [trimErrors, setTrimErrors] = useState({ start: "", end: "" });

  // Initialize trim values when editing clip changes
  useEffect(() => {
    if (editingClip) {
      setTrimValues({
        start: formatTimeInput(editingClip.trimStart || 0),
        end: formatTimeInput(editingClip.trimEnd || editingClip.duration),
      });
      setTrimErrors({ start: "", end: "" });
    }
  }, [editingClip]);

  const formatTimeInput = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    return `${mins}:${secs.padStart(4, "0")}`;
  };

  const parseTimeInput = (timeStr) => {
    const parts = timeStr.split(":");
    if (parts.length !== 2) return null;
    const mins = parseInt(parts[0]);
    const secs = parseFloat(parts[1]);
    if (isNaN(mins) || isNaN(secs)) return null;
    return mins * 60 + secs;
  };

  const validateTrimValues = (startStr, endStr, clipDuration) => {
    const errors = { start: "", end: "" };

    const startTime = parseTimeInput(startStr);
    const endTime = parseTimeInput(endStr);

    if (startTime === null) {
      errors.start = "Invalid format (use M:SS.S)";
    } else if (startTime < 0) {
      errors.start = "Start time cannot be negative";
    } else if (startTime >= clipDuration) {
      errors.start = "Start time must be less than clip duration";
    }

    if (endTime === null) {
      errors.end = "Invalid format (use M:SS.S)";
    } else if (endTime > clipDuration) {
      errors.end = "End time cannot exceed clip duration";
    } else if (startTime !== null && endTime <= startTime) {
      errors.end = "End time must be greater than start time";
    }

    return { errors, startTime, endTime };
  };

  const handleTrimInputChange = (field, value) => {
    setTrimValues((prev) => ({ ...prev, [field]: value }));

    // Clear errors when user starts typing
    if (trimErrors[field]) {
      setTrimErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleApplyTrim = () => {
    if (!editingClip) return;

    const { errors, startTime, endTime } = validateTrimValues(
      trimValues.start,
      trimValues.end,
      editingClip.duration
    );

    if (errors.start || errors.end) {
      setTrimErrors(errors);
      return;
    }

    // Call the parent callback with trim data
    onApplyTrim({
      clipId: editingClip.id,
      trimStart: startTime,
      trimEnd: endTime,
    });

    // Reset state
    setTrimValues({ start: "", end: "" });
    setTrimErrors({ start: "", end: "" });
  };

  const handleCancelTrim = () => {
    setTrimValues({ start: "", end: "" });
    setTrimErrors({ start: "", end: "" });
    onCancelTrim();
  };

  return (
    <CustomDialog open={showTrimDialog} onOpenChange={setShowTrimDialog}>
      <CustomDialogContent onClose={() => setShowTrimDialog(false)}>
        <CustomDialogHeader>
          <CustomDialogTitle className="flex items-center gap-2 font-medium text-foreground">
            <Edit3 className="h-5 w-5" />
            Trim {editingClip?.name}
          </CustomDialogTitle>
        </CustomDialogHeader>

        {editingClip && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Time (M:SS.S)
              </label>
              <input
                type="text"
                value={trimValues.start}
                onChange={(e) => handleTrimInputChange("start", e.target.value)}
                className={`w-full px-3 py-2 bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md ${
                  trimErrors.start ? "border-destructive" : "border-input"
                }`}
                placeholder="0:00.0"
              />
              {trimErrors.start && (
                <p className="text-destructive text-sm mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  {trimErrors.start}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Time (M:SS.S)
              </label>
              <input
                type="text"
                value={trimValues.end}
                onChange={(e) => handleTrimInputChange("end", e.target.value)}
                className={`w-full px-3 py-2 bg-background border border-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-md ${
                  trimErrors.end ? "border-destructive" : "border-input"
                }`}
                placeholder={
                  editingClip && formatTimeInput(editingClip.duration)
                }
              />
              {trimErrors.end && (
                <p className="text-destructive text-sm mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  {trimErrors.end}
                </p>
              )}
            </div>

            <div className="text-sm text-muted-foreground p-3 bg-surface border border-border rounded-md">
              Original Duration:{" "}
              {editingClip && formatTimeInput(editingClip.duration)}
            </div>
          </div>
        )}

        <CustomDialogFooter className="gap-2">
          <button
            onClick={handleCancelTrim}
            className="px-4 py-2 bg-background text-foreground border border-border font-medium rounded-md hover:bg-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyTrim}
            className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary-600 transition-colors"
          >
            Apply Trim
          </button>
        </CustomDialogFooter>
      </CustomDialogContent>
    </CustomDialog>
  );
}
