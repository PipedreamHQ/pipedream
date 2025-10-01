import lmnt from "../../lmnt.app.mjs";
import { getFileStream } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "lmnt-create-custom-voice",
  name: "Create Custom Voice",
  description: "Generates a custom voice from a batch of input audio data. [See the documentation](https://docs.lmnt.com/api-reference/voice/create-voice)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lmnt,
    files: {
      type: "string[]",
      label: "Audio Files Paths or URLs",
      description: "One or more `.wav` or `.mp3` file paths or URLs. Max attached files: 20. Max total file size: 250 MB.",
    },
    name: {
      propDefinition: [
        lmnt,
        "name",
      ],
    },
    enhance: {
      propDefinition: [
        lmnt,
        "enhance",
      ],
    },
    type: {
      propDefinition: [
        lmnt,
        "type",
      ],
    },
    gender: {
      propDefinition: [
        lmnt,
        "gender",
      ],
    },
    description: {
      propDefinition: [
        lmnt,
        "description",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();

    const metadata = {};
    [
      "name",
      "enhance",
      "type",
      "gender",
      "description",
    ].forEach((field) => {
      if (this[field]) metadata[field] = this[field];
    });
    data.append("metadata", JSON.stringify(metadata), {
      contentType: "application/json",
    });

    for (const file of this.files) {
      const stream = await getFileStream(file);
      data.append("files", stream);
    }

    const response = await this.lmnt.createVoice({
      $,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", "Successfully created a custom voice");
    return response;
  },
};
