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

const IMAGE_INFERENCE_STRUCTURE = {
  TEXT_TO_IMAGE: {
    value: "textToImage",
    label: "Text to Image",
  },
  IMAGE_TO_IMAGE: {
    value: "imageToImage",
    label: "Image to Image",
  },
  IN_OUT_PAINTING: {
    value: "inOutpainting",
    label: "In/Outpainting",
  },
  REFINER: {
    value: "refiner",
    label: "Refiner",
  },
  CONTROL_NET: {
    value: "controlNet",
    label: "Control Net",
  },
  LORA: {
    value: "lora",
    label: "LoRA",
  },
};

export default {
  BASE_URL,
  VERSION_PATH,
  IMAGE_INFERENCE_STRUCTURE,
  TASK_TYPE,
};
