import mailbluster from "../../app/mailbluster.app";

export default {
  key: "mailbluster-create-lead",
  name: "Create New Lead",
  description: "Create a new lead. [See the documentation](https://app.mailbluster.com/api-doc/leads)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    mailbluster,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the lead.",
    },
    subscribed: {
      type: "boolean",
      label: "Subscribed",
      description: "Lead is subscribed to receive email or not.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the lead.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the lead.",
      optional: true,
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "An object containing field information of the lead. Field merge tag is the key and field value is the value.",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone of the lead. View supported timezones from [here](https://app.mailbluster.com/pages/timezones).",
      optional: true,
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "IP address of the lead. IP address is used to find country, city, latitude, longitude, timezone (if no timezone is given) etc of this lead & store them as `meta`.",
      optional: true,
    },
    doubleOptIn: {
      type: "boolean",
      label: "Double Opt-In",
      description: "If true, the lead will receive the opt-in confirmation email.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tag(s) name of the lead. For each tag, if tag already exists, it will be only attached to the lead. Otherwise, it will be created first and then get attached.",
      optional: true,
    },
    overrideExisting: {
      type: "boolean",
      label: "Override Existing",
      description: "If lead exists, should it get overridden? Before creating a lead, we will try to find whether the lead already exists in the system using the provided email. This param controls if lead is found, we should override the lead info or throw an error message.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      mailbluster,
      ...data
    } = this;

    const response = await mailbluster.createLead({
      $,
      data,
    });

    $.export("$summary", `Lead ${data.firstName} ${data.lastName} was successfully created!`);
    return response;
  },
};
