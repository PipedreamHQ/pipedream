import { ConfigurationError } from "@pipedream/platform";
import {
  isEmptyObject, parseObject,
} from "./utils.mjs";
import {
  IMAGE_FORMATS, SOURCE, VIDEO_FORMATS,
} from "./constants.mjs";

const SIZE_PATTERN = /^\d+x\d+$/;

/**
 * Build the POST /studio/render request body shared by the
 * "Render from Studio Template" and "Start Async Render" actions.
 * Only fields the user actually set are sent, so the API defaults apply
 * to everything else.
 */
export const buildStudioRenderBody = ({
  templateId,
  modifications,
  format = "png",
  responseType = "url",
  mode,
  size,
  customSize,
  extraSizes,
  scale,
  includePages,
  fileName,
  pdfOptions,
  videoOptions,
}) => {
  if (!templateId) {
    throw new ConfigurationError("Template ID is required");
  }

  const response = {
    type: responseType,
    format,
  };
  if (mode) {
    response.mode = mode;
  }

  if (size && customSize) {
    throw new ConfigurationError("Set either `Resize To` or `Custom Size`, not both");
  }
  const resolvedSize = customSize
    ? String(customSize).trim()
    : size;
  if (customSize && !SIZE_PATTERN.test(resolvedSize)) {
    throw new ConfigurationError("`Custom Size` must look like `WIDTHxHEIGHT`, e.g. `1200x630`");
  }
  if (resolvedSize) {
    response.size = resolvedSize;
  }

  const extras = parseObject(extraSizes);
  const hasExtras = Array.isArray(extras)
    ? extras.length > 0
    : !isEmptyObject(extras);
  if (hasExtras) {
    if (!IMAGE_FORMATS.includes(format)) {
      throw new ConfigurationError(`\`Extra Sizes\` only works with image formats (${IMAGE_FORMATS.join(", ")})`);
    }
    if (responseType === "binary") {
      throw new ConfigurationError("`Extra Sizes` needs response type `url` or `base64`");
    }
    response.extraSizes = extras;
  }

  if (scale !== undefined && scale !== null && scale !== "") {
    response.scale = Number(scale);
  }

  if (Array.isArray(includePages) && includePages.length) {
    response.includePages = includePages.map((p) => parseInt(p, 10));
  }

  if (fileName) {
    response.fileName = fileName;
  }

  const body = {
    templateId,
    modifications: parseObject(modifications),
    response,
    source: SOURCE,
  };

  const pdf = parseObject(pdfOptions);
  if (!isEmptyObject(pdf)) {
    if (format !== "pdf") {
      throw new ConfigurationError("`PDF Options` only apply when the format is `pdf`");
    }
    body.pdfOptions = pdf;
  }

  const video = parseObject(videoOptions);
  if (!isEmptyObject(video)) {
    if (!VIDEO_FORMATS.includes(format)) {
      throw new ConfigurationError(`\`Video Options\` only apply to video formats (${VIDEO_FORMATS.join(", ")})`);
    }
    body.videoOptions = video;
  }

  return body;
};
