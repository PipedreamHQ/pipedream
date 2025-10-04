import { ConfigurationError } from "@pipedream/platform";
import app from "../../heyy.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "heyy-update-contact",
  name: "Update Contact",
  description: "Updates the details of a contact under your business. [See the documentation](https://documenter.getpostman.com/view/27408936/2sA2r3a6DW#5a5ee22b-c16e-4d46-ae5d-3844b6501a34).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    phoneNumber: {
      optional: true,
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    firstName: {
      optional: true,
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    labels: {
      propDefinition: [
        app,
        "labels",
      ],
    },
    attributes: {
      propDefinition: [
        app,
        "attributes",
      ],
    },
  },
  methods: {
    updateContact({
      contactId, ...args
    } = {}) {
      return this.app.put({
        path: `/contacts/${contactId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateContact,
      contactId,
      phoneNumber,
      firstName,
      lastName,
      email,
      labels,
      attributes,
    } = this;

    if (phoneNumber && !utils.isPhoneNumberValid(phoneNumber)) {
      throw new ConfigurationError(`The phone number \`${phoneNumber}\` is invalid. Please provide a valid phone number.`);
    }

    const response = await updateContact({
      $,
      contactId,
      data: {
        phoneNumber,
        firstName,
        lastName,
        email,
        ...(labels?.length && {
          labels: labels.map((name) => ({
            name,
          })),
        }),
        attributes:
          attributes && Object.entries(attributes)
            .reduce((acc, [
              externalId,
              value,
            ]) => ([
              ...acc,
              {
                externalId,
                value,
              },
            ]), []),
      },
    });

    $.export("$summary", `Successfully updated contact with ID \`${response.data.id}\`.`);
    return response;
  },
};
