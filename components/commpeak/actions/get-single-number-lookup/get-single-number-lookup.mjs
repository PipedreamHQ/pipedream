import commpeak from "../../commpeak.app.mjs";

export default {
  key: "commpeak-get-single-number-lookup",
  name: "Get Single Number Lookup",
  description: "Perform validation or lookup for a single phone number. [See the documentation](https://lookup.api-docs.commpeak.com/?_gl=1*50xs02*_gcl_au*MTMxMzgzMzA3Ny4xNjk3NTY0NDE3#46bd7a69-dc33-4014-a8de-54c54bdc57d7)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    commpeak,
    key: {
      type: "integer",
      label: "Number",
      description: "Phone number to lookup in E.164 format, e.g. `447520640056`.",
    },
    requestType: {
      propDefinition: [
        commpeak,
        "requestType",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.commpeak.getSingleNumberLookup({
      $,
      requestType: this.requestType,
      phoneNumber: this.key,
    });
    $.export("$summary", `Successfully looked up number ${this.key}`);
    return response;
  },
};
