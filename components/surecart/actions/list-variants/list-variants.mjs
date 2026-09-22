import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-list-variants",
  name: "List Variants",
  description: "Return a list of variants. [See the documentation](https://developer.surecart.com/api-reference/variants/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    surecart,
    ids: {
      propDefinition: [
        surecart,
        "ids",
      ],
    },
    maxResults: {
      propDefinition: [
        surecart,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const results = this.surecart.paginate({
      fn: this.surecart.listVariants,
      args: {
        $,
        params: {
          "ids[]": this.ids,
        },
      },
      max: this.maxResults,
    });

    const variants = [];
    for await (const variant of results) {
      variants.push(variant);
    }

    $.export("$summary", `Successfully retrieved ${variants.length} variant(s)`);
    return variants;
  },
};
