import app from "../../themarketer.app.mjs";

export default {
  key: "themarketer-add-subscriber",
  name: "Add Subscriber",
  description: "Creates a new subscriber. [See the documentation](https://developers.themarketer.com/reference/post_api-v1-add-subscriber)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstname: {
      propDefinition: [
        app,
        "firstname",
      ],
    },
    lastname: {
      propDefinition: [
        app,
        "lastname",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    birthday: {
      propDefinition: [
        app,
        "birthday",
      ],
    },
    channels: {
      propDefinition: [
        app,
        "channels",
      ],
    },
    addTags: {
      propDefinition: [
        app,
        "addTags",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addSubscriber({
      $,
      params: {
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname,
        phone: this.phone,
        city: this.city,
        country: this.country,
        birthday: this.birthday,
        channels: this.channels,
        add_tags: this.addTags?.join(","),
      },
    });

    $.export("$summary", "Successfully added subscriber");

    return response;
  },
};
