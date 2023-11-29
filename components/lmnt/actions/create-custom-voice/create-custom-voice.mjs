import lmnt from "../../lmnt.app.mjs";

export default {
  key: "lmnt-create-custom-voice",
  name: "Create Custom Voice",
  description: "Generates a custom voice from a batch of input audio data. [See the documentation](https://docs.lmnt.com/api-reference/speech/synthesize-speech-1)",
  version: "0.0.1",
  type: "action",
  props: {
    lmnt,
    files: {
      type: "string[]",
      label: "Audio Files",
      description: "The batch of input audio data in base64 format.",
      required: true,
    },
    metadata: {
      type: "string[]",
      label: "Metadata Objects",
      description: "Metadata for each audio file, in JSON format.",
      required: true,
    },
    format: {
      propDefinition: [
        lmnt,
        "format",
      ],
    },
    length: {
      propDefinition: [
        lmnt,
        "length",
      ],
    },
    returnDurations: {
      propDefinition: [
        lmnt,
        "returnDurations",
      ],
    },
    seed: {
      propDefinition: [
        lmnt,
        "seed",
      ],
    },
    speed: {
      propDefinition: [
        lmnt,
        "speed",
      ],
    },
    text: {
      propDefinition: [
        lmnt,
        "text",
      ],
    },
    voice: {
      propDefinition: [
        lmnt,
        "voice",
      ],
    },
    gender: {
      propDefinition: [
        lmnt,
        "gender",
      ],
    },
    owner: {
      propDefinition: [
        lmnt,
        "owner",
      ],
    },
    state: {
      propDefinition: [
        lmnt,
        "state",
      ],
    },
    type: {
      propDefinition: [
        lmnt,
        "type",
      ],
    },
  },
  async run({ $ }) {
    const metadataObjects = this.metadata.map(JSON.parse);
    const formData = new FormData();

    // Append files and metadata to the form data
    this.files.forEach((file, index) => {
      formData.append("files[]", file);
      formData.append(`metadata[${index}]`, JSON.stringify(metadataObjects[index]));
    });

    // Append other fields to the form data
    formData.append("format", this.format);
    formData.append("length", this.length);
    formData.append("return_durations", this.returnDurations);
    if (this.seed) formData.append("seed", this.seed);
    formData.append("speed", this.speed);
    formData.append("text", this.text);
    formData.append("voice", this.voice);

    // Optional fields
    if (this.gender) formData.append("gender", this.gender);
    if (this.owner) formData.append("owner", this.owner);
    if (this.state) formData.append("state", this.state);
    if (this.type) formData.append("type", this.type);

    const response = await this.lmnt._makeRequest({
      method: "POST",
      path: "/voice/create",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    $.export("$summary", "Successfully created a custom voice");
    return response;
  },
};
