const BASE_URL = "https://apipie.ai";
const VERSION_PATH = "/v1";

const MODEL_TYPE_OPTION = {
  LLM: "llm",
  VISION: "vision",
  EMBEDDING: "embedding",
  IMAGE: "image",
  VOICE: "voice",
  MODERATION: "moderation",
  CODING: "coding",
  FREE: "free",
};

const MODEL_SUBTYPE_OPTION = {
  CHAT: "chat",
  FILL_MASK: "fill-mask",
  QUESTION_ANSWERING: "question-answering",
  TTS: "tts",
  STT: "stt",
  MULTIMODAL: "multimodal",
};

export default {
  BASE_URL,
  VERSION_PATH,
  MODEL_TYPE_OPTION,
  MODEL_SUBTYPE_OPTION,
};
