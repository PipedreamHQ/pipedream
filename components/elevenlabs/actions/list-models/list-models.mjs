import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-list-models",
  name: "Get Models",
  version: "0.0.3",
  description: "Gets a list of available models. [See the documentation](https://docs.elevenlabs.io/api-reference/models-get)",
  type: "action",
  props: {
    elevenlabs,
  },
  async run({ $ }) {
    const response = await this.elevenlabs.listModels({
      $,
    });

    const length = response.length;

    $.export("$summary", `${length} model${length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
