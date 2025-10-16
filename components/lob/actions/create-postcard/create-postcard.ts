import { defineAction } from "@pipedream/types";
import lob from "../../app/lob.app";
import constants from "../../app/common/constants";

export default defineAction({
  key: "lob-create-postcard",
  name: "Create Postcard",
  description: "Creates a new postcard given information. [See docs here](https://docs.lob.com/#tag/Postcards/operation/postcard_create).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lob,
    description: {
      type: "string",
      label: "Description",
      description: "An internal description that identifies this resource",
    },
    to: {
      propDefinition: [
        lob,
        "addressId",
      ],
      label: "To",
      description: "Must either be an `addressId` or an inline object with correct address parameters",
    },
    front: {
      type: "string",
      label: "Front",
      description: "The artwork to use as the front of your postcard. May be a `templateId` or a HTML string. [HTML Examples](https://docs.lob.com/#section/HTML-Examples)",
    },
    back: {
      type: "string",
      label: "Back",
      description: "The artwork to use as the back of your postcard. May be a `templateId` or a HTML string. Be sure to leave room for address and postage information as in this [example template](https://s3-us-west-2.amazonaws.com/public.lob.com/assets/templates/postcards/4x6_postcard.pdf).",
    },
    size: {
      type: "string",
      label: "Size",
      description: "Specifies the size of the postcard. Only **4x6** postcards can be sent to international destinations",
      options: constants.POSTCARD_SIZES,
      default: "4x6",
    },
    mailType: {
      type: "string",
      label: "Mail Type",
      description: "The mail postage type: `usps_first_class` (default) or `usps_standard` - a cheaper option which is less predictable and takes longer to deliver",
      options: constants.MAIL_TYPES,
      default: "usps_first_class",
    },
    mergeVariables: {
      type: "object",
      label: "Merge Variables",
      description: "An object for substituting variables to render dynamic content in your template. [Merge Variables Guide](https://help.lob.com/en_US/print_mail/dynamic-personalization#using-html-and-merge-variables)",
      optional: true,
    },
    sendDate: {
      type: "string",
      label: "Send Date",
      description: "A timestamp in **ISO 8601** format which specifies a date after the current time and up to 180 days in the future to send the letter off for production. Until the `send_date` has passed, the mailpiece can be canceled",
      optional: true,
    },
    from: {
      propDefinition: [
        lob,
        "addressId",
      ],
      label: "From",
      description: "Required if `to` address is international. Must either be an `addressId` or an inline object with correct address parameters",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lob.createPostcard({
      description: this.description,
      to: this.to,
      front: this.front,
      back: this.back,
      size: this.size,
      mailType: this.mailType,
      merge_variables: this.mergeVariables,
      send_date: this.sendDate,
      from: this.from,
    });
    $.export("$summary", "Successfully created postcard");
    return response;
  },
});
