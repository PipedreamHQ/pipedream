import { ConfigurationError } from "@pipedream/platform";
import realGeeks from "../../realgeeks.app.mjs";

export default {
  key: "realgeeks-create-lead",
  name: "Create Lead",
  description: "Creates a new lead in Real Geeks. [See the documentation](https://developers.realgeeks.com/leads/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    realGeeks,
    source: {
      type: "string",
      label: "Source",
      description: "Name of your source, where leads are coming from. This will be displayed to agents so they know where this lead was generated",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Valid email address",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone number",
      description: "Phone number. US numbers could be formatted as `808-123-1234` or `(808) 123-1234`. International number format: `+55 83 1234-1234`",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Full formatted address",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Fields",
      description: "Any additional fields to be passed. Values will be parsed as JSON when applicable. [See the documentation for all available fields](https://developers.realgeeks.com/leads/).",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      realGeeks, additionalOptions, source, ...idProps
    } = this;
    if (Object.keys(idProps).length === 0) {
      throw new ConfigurationError("You must provide **at least one** of `email`, `firstName`, `lastName`, `phone`, `address`");
    }

    const {
      firstName, lastName, ...otherIdProps
    } = idProps;

    const response = await realGeeks.createLead({
      $,
      data: {
        source,
        first_name: firstName,
        last_name: lastName,
        ...otherIdProps,
        ...Object.fromEntries(Object.entries(additionalOptions ?? {}).map(([
          key,
          value,
        ]) => {
          try {
            return [
              key,
              JSON.parse(value),
            ];
          } catch (e) {
            return [
              key,
              value,
            ];
          }
        })),
      },
    });

    $.export("$summary", "Successfully created lead");
    return response;
  },
};
