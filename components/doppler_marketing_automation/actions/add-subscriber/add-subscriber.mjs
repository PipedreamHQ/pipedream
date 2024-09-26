import app from "../../doppler_marketing_automation.app.mjs";

export default {
  name: "Add Subscriber",
  version: "0.0.1",
  key: "doppler_marketing_automation-add-subscriber",
  description: "Add new subscriber. [See the documentation](https://restapi.fromdoppler.com/docs/resources#!/Subscribers/AccountsByAccountNameSubscribersPost)",
  type: "action",
  props: {
    app,
    email: {
      label: "Subscriber Email",
      description: "The subscriber email",
      type: "string",
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Birthday of the subscriber in YYYY-MM-DD format. E.g. `1999-05-28`",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the subscriber",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the subscriber",
    },
  },
  async run({ $ }) {
    const response = await this.app.addSubscriber({
      $,
      data: {
        email: this.email,
        fields: [
          {
            name: "BIRTHDAY",
            value: this.birthday,
          },
          {
            name: "FIRSTNAME",
            value: this.firstName,
          },
          {
            name: "LASTNAME",
            value: this.lastName,
          },
        ],
      },
    });

    if (response) {
      $.export("$summary", `Successfully added subscriber with email ${this.email}`);
    }

    return response;
  },
};
