import { ConfigurationError } from "@pipedream/platform";
import app from "../../heyy.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "heyy-create-contact",
  name: "Create Contact",
  description: "Creates a new contact for the business. [See the documentation](https://documenter.getpostman.com/view/27408936/2sA2r3a6DW#a1249b8d-10cf-446a-be35-eb8793ffa967).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phoneNumber: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
    },
    firstName: {
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
    createContact(args = {}) {
      return this.app.post({
        path: "/contacts",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createContact,
      phoneNumber,
      firstName,
      lastName,
      email,
      labels,
      attributes,
    } = this;

    if (!utils.isPhoneNumberValid(phoneNumber)) {
      throw new ConfigurationError(`The phone number \`${phoneNumber}\` is invalid. Please provide a valid phone number.`);
    }

    const response = await createContact({
      $,
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
    $.export("$summary", `Successfully created contact with ID \`${response.data.id}\`.`);
    return response;
  },
};
