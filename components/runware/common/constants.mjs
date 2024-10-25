const BASE_URL = "https://api.runware.ai";
const VERSION_PATH = "/v1";

const TASK_TYPE = {
  IMAGE_INFERENCE: {
    value: "imageInference",
    label: "Image Inference",
  },
  IMAGE_CONTROL_NET_PREPROCESS: {
    value: "imageControlNetPreProcess",
    label: "Image Control Net Preprocess",
  },
  IMAGE_UPSCALE: {
    value: "imageUpscale",
    label: "Image Upscale",
  },
  IMAGE_BACKGROUND_REMOVAL: {
    value: "imageBackgroundRemoval",
    label: "Image Background Removal",
  },
  IMAGE_CAPTION: {
    value: "imageCaption",
    label: "Image Caption",
  },
  PROMPT_ENHANCE: {
    value: "promptEnhance",
    label: "Prompt Enhance",
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  TASK_TYPE,
};
