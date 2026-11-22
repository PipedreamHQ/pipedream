import acedatacloud from "../../acedatacloud.app.mjs";
import { requiredText } from "../../common/utils.mjs";
import { createSubmissionAction } from "../common/create-submission-action.mjs";

export default createSubmissionAction({
  version: "0.0.1",
  acedatacloud,
  key: "acedatacloud-producer-generate-music",
  name: "Generate Producer Music",
  description: "Generate Producer music through Ace Data Cloud from an idea or supplied lyrics. [See the documentation](https://platform.acedata.cloud/documents/producer-audios)",
  path: "/producer/audios",
  modelChoices: true,
  props: {
    model: {
      type: "string",
      label: "Model",
      description: "Published Producer model from the current audio API. Example: `FUZZ-2.0`.",
      default: "FUZZ-2.0",
    },
    customLyrics: {
      type: "boolean",
      label: "Use Custom Lyrics",
      description: "Generate from Lyrics instead of Music Idea. Example: `false`.",
      default: false,
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
      label: "Music Idea",
      description: "Required without custom lyrics; at most 200 characters. Example: `A calm lake at sunrise`.",
      optional: true,
    },
    lyrics: {
      propDefinition: [
        acedatacloud,
        "lyrics",
      ],
      label: "Lyrics",
      description: "Required when Use Custom Lyrics is enabled. Example: `A new day begins`.",
      optional: true,
    },
    title: {
      propDefinition: [
        acedatacloud,
        "songTitle",
      ],
      label: "Song Title",
      description: "Optional title for the generated song. Example: `Sunrise`.",
      optional: true,
    },
    instrumental: {
      type: "boolean",
      label: "Instrumental",
      description: "Generate accompaniment without sung lyrics. Example: `false`.",
      default: false,
    },
  },
  buildData: (step) => {
    const custom = step.customLyrics === true;
    const prompt = custom
      ? undefined
      : requiredText(step.prompt, "Music Idea");
    if (prompt && [
      ...prompt,
    ].length > 200) throw new Error("Music Idea must be at most 200 characters.");
    return {
      action: "generate",
      model: requiredText(step.model, "Model"),
      custom,
      instrumental: step.instrumental === true,
      ...(custom
        ? {
          lyric: requiredText(step.lyrics, "Lyrics"),
        }
        : {
          prompt,
        }),
      ...(step.title && {
        title: requiredText(step.title, "Song Title"),
      }),
    };
  },
});
