import {
  COUNTRY_OPTIONS, GENDER_OPTIONS,
} from "../../common/constants.mjs";
import app from "../../doppler_marketing_automation.app.mjs";

export default {
  key: "doppler_marketing_automation-add-update-subscriber",
  name: "Add or Update Subscriber",
  description: "Adds a new subscriber or updates an existing one. [See the documentation](https://restapi.fromdoppler.com/docs/resources#!/Subscribers/AccountsByAccountNameListsByListIdSubscribersPost)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
    subscriberEmail: {
      type: "string",
      label: "Subscriber Email",
      description: "The email of the subscriber to add or update.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Subscriber first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Subscriber last name",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birth Date",
      description: "The birth date of the subscriber",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Optional country of the subscriber",
      options: COUNTRY_OPTIONS,
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "The gender of the subscriber",
      options: GENDER_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = [];
    if (this.firstName) fields.push({
      name: "FIRSTNAME",
      value: this.firstName,
    });
    if (this.lastName) fields.push({
      name: "LASTNAME",
      value: this.lastName,
    });
    if (this.birthDate) fields.push({
      name: "BIRTHDAY",
      value: this.birthDate,
    });
    if (this.country) fields.push({
      name: "COUNTRY",
      value: this.country,
    });
    if (this.gender) fields.push({
      name: "GENDER",
      value: this.gender,
    });

    const response = await this.app.addOrUpdateSubscriber({
      $,
      listId: this.listId,
      data: {
        email: this.subscriberEmail,
        fields,
      },
    });

    $.export("$summary", `Successfully added or updated subscriber with email: ${this.subscriberEmail}`);
    return response;
  },
};
