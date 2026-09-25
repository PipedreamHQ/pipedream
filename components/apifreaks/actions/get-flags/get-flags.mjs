import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-flags",
  name: "Get Flag for Country",
  description: "Retrieve the flag for a specific country [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Country code in ISO 3166-1 alpha-2 format.",
      optional: false,
    },
    shape: {
      type: "string",
      label: "Shape",
      description: "Flag shape. One of: `'flat'` or `'round'`.",
      optional: false,
      options: ["flat","round"],
    },
    size: {
      type: "string",
      label: "Size",
      description: "Flag size in pixels. Valid options: `16px`, `24px`, `32px`, `48px`, `64px`. Applicable only for PNG or WEBP formats.",
      optional: true,
      options: ["16px","24px","32px","48px","64px"],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of flag. One of: `country` or `organization`.",
      optional: false,
      options: ["country","organization"],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/flags",
      params: {
        name: this.name,
        shape: this.shape,
        size: this.size,
        type: this.type,
      },
    });
    $.export("$summary", "Successfully executed Get Flag for Country");
    return response;
  },
};
