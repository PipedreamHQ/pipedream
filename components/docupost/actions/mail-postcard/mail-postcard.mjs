import app from "../../docupost.app.mjs";

export default {
  key: "docupost-mail-postcard",
  name: "Mail Postcard",
  description: "Dispatches a glossy, color 4x6 postcard via the US Postal Service. [See the documentation](https://help.docupost.com/help/send-postcard-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    frontImage: {
      type: "string",
      label: "Front Image URL",
      description: "A valid image URL for the front of your postcard. Image should be 1875 x 1275. PNG recommended. Your API request will succeed but your mailing will later fail if the image is the incorrect size.",
    },
    backImage: {
      type: "string",
      label: "Back Image URL",
      description: "A valid image URL for the back of your postcard. Image should be 1875 x 1275. PNG recommended. Your API request will succeed but your mailing will later fail if the image is the incorrect size. Important: Your recipient/sender and postage information will be automatically overlaid onto your image. See [this template](https://docupost.s3.us-east-2.amazonaws.com/postcardtemplateback_ip0jws.png) as an example. ",
    },
    toName: {
      propDefinition: [
        app,
        "toName",
      ],
    },
    toAddress1: {
      propDefinition: [
        app,
        "toAddress1",
      ],
    },
    toAddress2: {
      propDefinition: [
        app,
        "toAddress2",
      ],
    },
    toCity: {
      propDefinition: [
        app,
        "toCity",
      ],
    },
    toState: {
      propDefinition: [
        app,
        "toState",
      ],
    },
    toZip: {
      propDefinition: [
        app,
        "toZip",
      ],
    },
    fromName: {
      propDefinition: [
        app,
        "fromName",
      ],
    },
    fromAddress1: {
      propDefinition: [
        app,
        "fromAddress1",
      ],
    },
    fromAddress2: {
      propDefinition: [
        app,
        "fromAddress2",
      ],
    },
    fromCity: {
      propDefinition: [
        app,
        "fromCity",
      ],
    },
    fromState: {
      propDefinition: [
        app,
        "fromState",
      ],
    },
    fromZip: {
      propDefinition: [
        app,
        "fromZip",
      ],
    },
  },
  methods: {
    sendPostcard(args = {}) {
      return this.app.post({
        path: "/sendpostcard",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendPostcard,
      frontImage,
      backImage,
      toName,
      toAddress1,
      toAddress2,
      toCity,
      toState,
      toZip,
      fromName,
      fromAddress1,
      fromAddress2,
      fromCity,
      fromState,
      fromZip,
    } = this;

    const response = await sendPostcard({
      $,
      params: {
        front_image: frontImage,
        back_image: backImage,
        to_name: toName,
        to_address1: toAddress1,
        to_address2: toAddress2,
        to_city: toCity,
        to_state: toState,
        to_zip: toZip,
        from_name: fromName,
        from_address1: fromAddress1,
        from_address2: fromAddress2,
        from_city: fromCity,
        from_state: fromState,
        from_zip: fromZip,
      },
    });

    $.export("$summary", "Successfully sent postcard");
    return response;
  },
};
