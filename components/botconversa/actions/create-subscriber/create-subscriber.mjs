import botconversa from "../../botconversa.app.mjs";

export default {
  key: "botconversa-create-subscriber",
  name: "Create Subscriber",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new subscriber. [See the documentation](https://backend.botconversa.com.br/swagger/)",
  type: "action",
  props: {
    botconversa,
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the subscriber.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the subscriber.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the subscriber.",
    },
  },
  async run({ $ }) {
    const {
      botconversa,
      phone,
      firstName,
      lastName,
    } = this;

    const response = await botconversa.createSubscriber({
      $,
      data: {
        phone,
        first_name: firstName,
        last_name: lastName,
      },
    });

    $.export("$summary", `A new subscriber with Id: ${response.id} was successfully created!`);
    return response;
  },
};
