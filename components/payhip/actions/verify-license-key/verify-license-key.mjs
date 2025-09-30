import app from "../../payhip.app.mjs";

export default {
  name: "Verify License Key",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "payhip-verify-license-key",
  description: "Verify a license key. [See the documentation](https://help.payhip.com/article/114-software-license-keys#:~:text=License%20Key%20Verification)",
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
      description: "The license key to be verified",
    },
  },
  async run({ $ }) {
    const response = await this.app.verifyLicenseKey({
      $,
      params: {
        product_link: this.productLink,
        license_key: this.licenseKey,
      },
    });

    if (response) {
      $.export("$summary", "Successfully verified license key");
    }

    return response;
  },
};
