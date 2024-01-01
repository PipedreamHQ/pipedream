import lmnt from "../../lmnt.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "lmnt-create-custom-voice",
  name: "Create Custom Voice",
  description: "Generates a custom voice from a batch of input audio data. [See the documentation](https://docs.lmnt.com/api-reference/voice/create-voice)",
  version: "0.0.1",
  type: "action",
  props: {
    lmnt,
    files: {
      type: "string[]",
      label: "Audio Files",
      description: "One or more `.wav` or `.mp3` filepaths in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory). Max attached files: 20. Max total file size: 250 MB.",
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

    this.files.forEach?.((file) => {
      const content = fs.createReadStream(file.includes("tmp/")
        ? file
        : `/tmp/${file}`);
      data.append("files", content);
    });

    const response = await this.lmnt.createVoice({
      $,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", "Successfully created a custom voice");
    return response;
  },
};
