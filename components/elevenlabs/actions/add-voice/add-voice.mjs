import FormData from "form-data";
import elevenlabs from "../../elevenlabs.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "elevenlabs-add-voice",
  name: "Add Voice",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      label: "File Paths or URLs",
      description: "Provide either an array of file URLs or an array of paths to a files in the /tmp directory (for example, /tmp/myFile.pdf).",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
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

    for (const file of files) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      data.append("files", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }

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
