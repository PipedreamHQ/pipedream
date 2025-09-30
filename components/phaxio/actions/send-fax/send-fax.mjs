import phaxio from "../../phaxio.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Send Fax",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "phaxio-send-fax",
  description: "Sends a fax. [See docs here](https://www.phaxio.com/docs/api/v2.1/faxes/create_and_send_fax)",
  type: "action",
  props: {
    phaxio,
    to: {
      label: "To",
      description: "A phone number in [E.164 format](https://www.twilio.com/docs/glossary/what-e164) (+[country code][number]). E.g. `+5547991856893`",
      type: "string",
    },
    contentUrl: {
      label: "Content URL",
      description: "A URL to be rendered and sent as the fax content. E.g. `https://i.imgur.com/BRkm0s0.jpeg`",
      type: "string",
    },
    headerText: {
      label: "Header Text",
      description: "Text that will be displayed at the top of each page of the fax. 50 characters maximum, all unicode characters accepted.",
      type: "string",
      optional: true,
    },
    headerPageNums: {
      label: "Header Page Nums",
      description: "Turns page numbers in header on or off. Default is `true`",
      type: "boolean",
      default: true,
      optional: true,
    },
    callbackUrl: {
      label: "Callback URL",
      description: "You can specify a callback url that will override the one you have defined globally for your account.",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.headerText?.length > 50) {
      throw new ConfigurationError("The header must be have an maximum of 50 characters");
    }

    const response = await this.phaxio.sendFax({
      $,
      data: {
        to: this.to,
        content_url: this.contentUrl,
        header_text: this.headerText,
        header_page_nums: this.headerPageNums,
        callback_url: this.callbackUrl,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent fax with id ${response.id}`);
    }

    return response;
  },
};
