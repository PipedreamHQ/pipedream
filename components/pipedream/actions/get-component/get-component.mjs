import pipedream from "../../pipedream.app.mjs";

export default {
  key: "pipedream-get-component",
  name: "Get Component",
  description: "Get a published component. [See docs](https://pipedream.com/docs/api/rest/#get-a-component)",
  version: "0.0.1",
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
      label: "Global Registry",
      description: "Defaults to `true`. Gets component from the global registry.",
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
