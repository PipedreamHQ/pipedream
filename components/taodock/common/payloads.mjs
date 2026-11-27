/**
 * Pure request/response helpers for the Taodock OpenAI-compatible API.
 * Kept free of @pipedream/platform imports so they can be unit-tested
 * in plain Node.js.
 */

function nonEmptyString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function finiteNumber(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function buildImageRequestBody(model, prompt, settings = {}) {
  const body = {
    model,
    prompt,
    response_format: "b64_json",
  };
  const size = nonEmptyString(settings.size);
  const quality = nonEmptyString(settings.quality);
  const outputFormat = nonEmptyString(settings.outputFormat);
  const aspectRatio = nonEmptyString(settings.aspectRatio);
  const negativePrompt = nonEmptyString(settings.negativePrompt);
  const referenceImageUrl = nonEmptyString(settings.referenceImageUrl);
  const count = finiteNumber(settings.count);
  const seed = finiteNumber(settings.seed);
  if (size) body.size = size;
  if (quality) body.quality = quality;
  if (outputFormat) body.output_format = outputFormat;
  if (aspectRatio) body.aspect_ratio = aspectRatio;
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (referenceImageUrl) body.image_url = referenceImageUrl;
  if (count !== undefined) body.n = count;
  if (seed !== undefined && seed > 0) body.seed = seed;
  return body;
}

export function buildVideoRequestBody(model, prompt, settings = {}) {
  const body = {
    model,
    prompt,
  };
  const duration = finiteNumber(settings.duration);
  const resolution = nonEmptyString(settings.resolution);
  const aspectRatio = nonEmptyString(settings.aspectRatio);
  const mode = nonEmptyString(settings.mode);
  const imageUrl = nonEmptyString(settings.imageUrl);
  const lastFrameUrl = nonEmptyString(settings.lastFrameUrl);
  const inputVideoUrl = nonEmptyString(settings.inputVideoUrl);
  const negativePrompt = nonEmptyString(settings.negativePrompt);
  const seed = finiteNumber(settings.seed);
  if (duration !== undefined && duration > 0) body.duration = duration;
  if (resolution) body.resolution = resolution;
  if (aspectRatio) body.aspect_ratio = aspectRatio;
  if (mode) body.mode = mode;
  if (imageUrl) body.image_url = imageUrl;
  if (lastFrameUrl) body.last_frame_url = lastFrameUrl;
  if (inputVideoUrl) body.input_video_url = inputVideoUrl;
  if (negativePrompt) body.negative_prompt = negativePrompt;
  if (typeof settings.audio === "boolean") body.audio = settings.audio;
  if (seed !== undefined && seed > 0) body.seed = seed;
  return body;
}

/** Taodock returns the video task id as `id` or `task_id`. */
export function extractTaskId(task) {
  if (task === null || typeof task !== "object") {
    return "";
  }
  const value = task.id ?? task.task_id;
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";
}

export function extractTaskStatus(task) {
  if (task === null || typeof task !== "object") {
    return "unknown";
  }
  const value = task.status;
  return typeof value === "string" && value
    ? value.toLowerCase()
    : "unknown";
}

export function extractTaskError(task) {
  if (task === null || typeof task !== "object") {
    return undefined;
  }
  const error = task.error;
  if (error && typeof error === "object") {
    const message = error.message;
    if (typeof message === "string" && message) {
      return message;
    }
  }
  if (typeof error === "string" && error) {
    return error;
  }
  return undefined;
}

export function isTerminalVideoStatus(status) {
  return status === "completed" || status === "failed" || status === "succeeded";
}

export function isFailedVideoStatus(status) {
  return status === "failed";
}

export function parseModelIds(response) {
  const list = Array.isArray(response)
    ? response
    : response && typeof response === "object" && Array.isArray(response.data)
      ? response.data
      : [];
  const ids = [];
  for (const entry of list) {
    if (typeof entry === "string") {
      ids.push(entry);
    } else if (entry && typeof entry === "object" && typeof entry.id === "string" && entry.id) {
      ids.push(entry.id);
    }
  }
  return [
    ...new Set(ids),
  ].sort((a, b) => a.localeCompare(b));
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
