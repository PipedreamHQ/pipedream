import { ConfigurationError } from "@pipedream/platform";
import voxellForge from "../../voxell_forge.app.mjs";

export default {
  key: "voxell_forge-create-embeddings",
  name: "Create Embeddings",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Create vector embeddings for one or more text inputs using Voxell Forge. [See the documentation](https://dash.voxell.ai/docs)",
  type: "action",
  props: {
    voxellForge,
    texts: {
      type: "string[]",
      label: "Texts",
      description: "One or more text inputs to embed.",
    },
    model: {
      propDefinition: [
        voxellForge,
        "model",
      ],
    },
    dim: {
      propDefinition: [
        voxellForge,
        "dim",
      ],
    },
    inputType: {
      propDefinition: [
        voxellForge,
        "inputType",
      ],
    },
  },
  async run({ $ }) {
    if (!this.texts?.length) {
      throw new ConfigurationError("Provide at least one text input.");
    }

    const emptyIndex = this.texts.findIndex((text) => !text?.trim());
    if (emptyIndex >= 0) {
      throw new ConfigurationError(`Text #${emptyIndex + 1} is empty.`);
    }

    const response = await this.voxellForge.createEmbeddings({
      $,
      texts: this.texts,
      model: this.model,
      dim: this.dim,
      inputType: this.inputType,
    });

    $.export("$summary", `Created ${response.embeddings?.length ?? this.texts.length} embedding(s)`);
    return response;
  },
};
