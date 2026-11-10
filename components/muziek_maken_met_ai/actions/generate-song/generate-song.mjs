import { ConfigurationError } from "@pipedream/platform";
import muziekMakenMetAi from "../../muziek_maken_met_ai.app.mjs";

export default {
  key: "muziek_maken_met_ai-generate-song",
  name: "Generate Song",
  description: "Start a song generation from a prompt (costs 1 credit) and optionally wait for the audio files. Supports standard mode (describe the music) and custom mode (full lyrics plus style). [See the documentation](https://muziekmakenmetai.nl/developers/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    muziekMakenMetAi,
    prompt: {
      propDefinition: [
        muziekMakenMetAi,
        "prompt",
      ],
    },
    waitForCompletion: {
      propDefinition: [
        muziekMakenMetAi,
        "waitForCompletion",
      ],
    },
    customMode: {
      propDefinition: [
        muziekMakenMetAi,
        "customMode",
      ],
    },
    model: {
      propDefinition: [
        muziekMakenMetAi,
        "model",
      ],
    },
    style: {
      propDefinition: [
        muziekMakenMetAi,
        "style",
      ],
      optional: true,
    },
    title: {
      propDefinition: [
        muziekMakenMetAi,
        "title",
      ],
    },
    language: {
      propDefinition: [
        muziekMakenMetAi,
        "language",
      ],
    },
    instrumental: {
      propDefinition: [
        muziekMakenMetAi,
        "instrumental",
      ],
    },
    // The props below only apply in custom mode.
    vocalGender: {
      propDefinition: [
        muziekMakenMetAi,
        "vocalGender",
      ],
    },
    styleWeight: {
      propDefinition: [
        muziekMakenMetAi,
        "styleWeight",
      ],
    },
    creativity: {
      propDefinition: [
        muziekMakenMetAi,
        "creativity",
      ],
    },
    audioWeight: {
      propDefinition: [
        muziekMakenMetAi,
        "audioWeight",
      ],
    },
    durationSeconds: {
      propDefinition: [
        muziekMakenMetAi,
        "durationSeconds",
      ],
    },
    variety: {
      propDefinition: [
        muziekMakenMetAi,
        "variety",
      ],
    },
    negativeTags: {
      propDefinition: [
        muziekMakenMetAi,
        "negativeTags",
      ],
    },
    personaId: {
      propDefinition: [
        muziekMakenMetAi,
        "personaId",
      ],
    },
    personaType: {
      propDefinition: [
        muziekMakenMetAi,
        "personaType",
      ],
    },
  },
  async run({ $ }) {
    const prompt = (this.prompt ?? "").trim();
    if (!prompt) {
      throw new ConfigurationError("Prompt is required.");
    }
    const maxPromptLength = this.customMode
      ? 5000
      : 500;
    if (prompt.length > maxPromptLength) {
      throw new ConfigurationError(this.customMode
        ? `Prompt is longer than ${maxPromptLength} characters.`
        : "Prompt is longer than 500 characters. Turn on Custom Mode to use full song lyrics (max 5,000 characters).");
    }

    const body = {
      model: this.model,
      prompt,
    };

    const style = (this.style ?? "").trim();
    if (style.length > 1000) {
      throw new ConfigurationError("Style is longer than 1,000 characters.");
    }
    if (this.customMode) {
      body.custom_mode = true;
      if (!style) {
        throw new ConfigurationError("Style is required in custom mode. Describe the genre, instruments, tempo and mood.");
      }
      body.style = style;
    }

    const title = (this.title ?? "").trim();
    if (title.length > 80) {
      throw new ConfigurationError("Title is longer than 80 characters.");
    }
    if (title) {
      body.title = title;
    }

    const language = (this.language ?? "").trim();
    if (language.length > 40) {
      throw new ConfigurationError("Language is longer than 40 characters.");
    }
    if (language) {
      body.language = language;
    }

    if (this.instrumental) {
      body.instrumental = true;
    }

    if (this.customMode) {
      if (this.vocalGender) {
        body.vocal_gender = this.vocalGender;
      }
      for (const [
        prop,
        apiField,
      ] of [
          [
            "styleWeight",
            "style_weight",
          ],
          [
            "creativity",
            "creativity",
          ],
          [
            "audioWeight",
            "audio_weight",
          ],
        ]) {
        if (this[prop] !== undefined && this[prop] !== null) {
          body[apiField] = this[prop] / 100;
        }
      }
      if (this.durationSeconds !== undefined && this.durationSeconds !== null) {
        body.duration_seconds = this.durationSeconds;
      }
      if (this.variety !== undefined && this.variety !== null && this.variety !== 1) {
        body.variety = this.variety;
      }
      const negativeTags = (this.negativeTags ?? "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (negativeTags.length) {
        const combined = negativeTags.join(", ");
        if (combined.length > 300) {
          throw new ConfigurationError("Negative Tags is longer than 300 characters.");
        }
        body.negative_tags = negativeTags;
      }
      const personaId = (this.personaId ?? "").trim();
      if (personaId) {
        body.persona_id = personaId;
        body.persona_type = this.personaType ?? "style";
      }
    }

    let generation = await this.muziekMakenMetAi.createSong($, body);

    if (this.waitForCompletion && !this.muziekMakenMetAi.isTerminalStatus(generation.status)) {
      generation = await this.muziekMakenMetAi.pollSong($, generation.id);
    }

    if (generation.status === "succeeded") {
      $.export("$summary", `Song "${generation.title ?? generation.id}" generated successfully`);
    } else {
      $.export("$summary", `Song generation ${generation.id} has status "${generation.status}"`);
    }

    return generation;
  },
};
