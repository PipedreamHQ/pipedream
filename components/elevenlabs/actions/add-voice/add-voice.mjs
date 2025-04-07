import fs from "fs";
import FormData from "form-data";
import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-add-voice",
  name: "Add Voice",
  version: "0.0.2",
  description: "Add a voice from one or more audio files. [See the documentation](https://elevenlabs.io/docs/api-reference/add-voice)",
  type: "action",
  props: {
    elevenlabs,
    name: {
      type: "string",
      label: "Name",
      description: "The name that identifies this voice. This will be displayed in the dropdown of the website.",
    },
    files: {
      type: "string[]",
      label: "Files",
      description: "One or more audio files (in the `/tmp` folder) to clone the voice from. Example: `/tmp/voice.mp3`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "How would you describe the voice?",
      optional: true,
    },
    labels: {
      type: "string",
      label: "Labels",
      description: "Serialized labels dictionary for the voice.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      elevenlabs,
      name,
      files,
      description,
      labels,
    } = this;

    const data = new FormData();
    if (description) data.append("description", description);

    files.forEach((file) => {
      data.append("files", fs.createReadStream(file.includes("tmp/")
        ? file
        : `/tmp/${file}`));});

    if (labels) data.append("labels", labels);
    data.append("name", name);

    const response = await elevenlabs.addVoice({
      $,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", `Successfully added voice (ID: ${response.voice_id})`);
    return response;
  },
};
