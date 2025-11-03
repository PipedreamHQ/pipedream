import app from "../../payhip.app.mjs";
import qs from "qs";

export default {
  name: "Enable License Key",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "payhip-enable-license-key",
  description: "Enable a license key. [See the documentation](https://help.payhip.com/article/114-software-license-keys#:~:text=Enable%20or%20Disable%20a%20License%20Key)",
  type: "action",
  props: {
    app,
    productLink: {
      propDefinition: [
        app,
        "productLink",
      ],
    },
    licenseKey: {
      type: "string",
      label: "License Key",
      description: "The license key to be enabled",
    },
  },
  async run({ $ }) {
    const response = await this.app.enableLicenseKey({
      $,
      data: qs.stringify({
        product_link: this.productLink,
        license_key: this.licenseKey,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response) {
      $.export("$summary", "Successfully enabled license key");
    }

    return response;
  },
};
