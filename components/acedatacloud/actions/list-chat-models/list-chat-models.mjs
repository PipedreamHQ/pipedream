import acedatacloud from "../../acedatacloud.app.mjs";

export default {
  key: "acedatacloud-list-chat-models",
  name: "List Chat Models",
  description: "List GPT chat models present in both the published Ace Data Cloud catalog and authenticated Models API. This read-only action does not generate text. [See the documentation](https://platform.acedata.cloud/documents/openai-models)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    acedatacloud,
  },
  async run({ $ }) {
    const models = await this.acedatacloud.listChatModels({
      $,
    });
    $.export("$summary", `Retrieved ${models.length} published GPT chat models; service access is checked when a request runs`);
    return models;
  },
};
