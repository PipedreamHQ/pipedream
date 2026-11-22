import acedatacloud from "../../acedatacloud.app.mjs";
import {
  requiredHttpUrl, requiredText,
} from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  acedatacloud,
  key: "acedatacloud-hailuo-generate-video",
  name: "Generate Hailuo Video",
  description: "Generate a Hailuo video through Ace Data Cloud using text or a first-frame image. [See the documentation](https://platform.acedata.cloud/documents/hailuo-videos)",
  path: "/hailuo/videos",
  modelChoices: true,
  props: {
    model: {
      type: "string",
      label: "Model",
      description: "Published Hailuo model; image models require First Frame URL. Example: `minimax-t2v`.",
      default: "minimax-t2v",
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      description: "Describe the video or desired motion. Example: `A calm lake at sunrise`.",
    },
    firstFrameUrl: {
      propDefinition: [
        acedatacloud,
        "imageUrl",
      ],
      label: "First Frame URL",
      description: "Required for minimax-i2v and minimax-i2v-director. Example: `https://example.com/image.png`.",
      optional: true,
    },
  },
  buildData: (step) => {
    const model = requiredText(step.model, "Model");
    const image = step.firstFrameUrl
      ? requiredHttpUrl(step.firstFrameUrl, "First Frame URL")
      : undefined;
    if ([
      "minimax-i2v",
      "minimax-i2v-director",
    ].includes(model) && !image) throw new Error("This Hailuo model requires a first frame.");
    if (model === "minimax-t2v" && image) throw new Error("Choose an image-to-video model to use a first frame.");
    return {
      action: "generate",
      model,
      prompt: requiredText(step.prompt, "Prompt"),
      ...(image && {
        first_image_url: image,
      }),
    };
  },
});
