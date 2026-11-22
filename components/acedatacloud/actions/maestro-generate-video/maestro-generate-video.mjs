import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredText, requiredHttpUrl,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  version: "0.0.1",
  acedatacloud,
  key: "acedatacloud-maestro-generate-video",
  name: "Generate Maestro Video",
  description: "Produce a Maestro video from a brief with optional reference media through Ace Data Cloud. [See the documentation](https://platform.acedata.cloud/documents/maestro-videos)",
  path: "/maestro/videos",
  asyncMode: false,
  props: {
    "prompt": {
      "propDefinition": [
        acedatacloud,
        "prompt",
      ],
      "label": "Video Brief",
      "description": "Describe the topic, audience, tone and intended visuals. Example: `A calm lake at sunrise`.",
    },
    "duration": {
      "type": "integer",
      "label": "Duration",
      "description": "Requested seconds, from 5 to 300. Example: `30`.",
      "default": 30,
    },
    "aspect": {
      "type": "string",
      "label": "Aspect Ratio",
      "description": "Output aspect ratio. Example: `9:16`.",
      "options": [
        "9:16",
        "16:9",
        "1:1",
      ],
      "default": "9:16",
    },
    "language": {
      "type": "string",
      "label": "Language",
      "description": "One output language, for example en or zh-cn. Example: `zh-cn`.",
      "default": "zh-cn",
    },
    "scenario": {
      "type": "string",
      "label": "Scenario",
      "description": "Captions requires source video; Avatar requires a portrait. Example: `auto`.",
      "options": [
        "auto",
        "narrated",
        "captions",
        "avatar",
        "drama",
      ],
      "default": "auto",
    },
    "fileUrls": {
      "type": "string[]",
      "label": "Reference Media URLs",
      "description": "Up to 20 public image, video or audio references. Example: `[\"https://example.com/image.png\"]`.",
      "optional": true,
    },
    "style": {
      "type": "string",
      "label": "Visual Style",
      "description": "Optional named style or freeform visual hint. Example: `folk`.",
      "optional": true,
    },
  },
  buildData: (step) => {
    if (!Number.isInteger(step.duration) || step.duration < 5 || step.duration > 300) throw new Error("Duration must be an integer from 5 to 300 seconds.");
    if (![
      "9:16",
      "16:9",
      "1:1",
    ].includes(step.aspect)) throw new Error("Choose a published aspect ratio.");
    if (![
      "auto",
      "narrated",
      "captions",
      "avatar",
      "drama",
    ].includes(step.scenario)) throw new Error("Choose a published scenario.");
    const files = step.fileUrls?.map((url) => requiredHttpUrl(url, "Reference Media URL")) || [];
    if (files.length > 20) throw new Error("Supply at most 20 reference files.");
    if ([
      "captions",
      "avatar",
    ].includes(step.scenario) && !files.length) throw new Error("Captions requires source video; Avatar requires a portrait reference.");
    return {
      action: "generate",
      prompt: requiredText(step.prompt, "Video Brief"),
      duration: step.duration,
      aspect: step.aspect,
      langs: [
        requiredText(step.language, "Language"),
      ],
      scenario: step.scenario,
      ...(files.length && {
        file_urls: files,
      }),
      ...(step.style && {
        style: requiredText(step.style, "Visual Style"),
      }),
    };
  },
});
