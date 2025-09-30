import pipedream from "../../pipedream.app.mjs";

export default {
  key: "pipedream-get-component",
  name: "Get Component",
  description: "Get info for a published component. [See docs](https://pipedream.com/docs/api/rest/#get-a-component)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pipedream,
    componentKey: {
      propDefinition: [
        pipedream,
        "componentKey",
      ],
    },
    globalRegistry: {
      type: "boolean",
      label: "Pipedream Registry",
      description: "Defaults to `true`. If set to `true`, this will fetch component data from the public Pipedream registry. Set to `false` to search your private published components.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.pipedream.getComponent(this.componentKey, this.globalRegistry);

    if (data) {
      $.export("$summary", `Succesfully fetched ${this.componentKey}`);
      return data;
    }

    console.log(`${this.componentKey} was not found`);
  },
};
