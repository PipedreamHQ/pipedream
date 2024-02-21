import common from "../common/base.mjs";
import utils from "../../common/props-utils.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

const { salesforce } = common.props;

export default {
  ...common,
  key: "salesforce_rest_api-create-user",
  name: "Create User",
  description: toSingleLineString(`
    Creates a Salesforce user.
    See [User SObject](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_objects_user.htm)
    and [Create Record](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_sobject_create.htm)
  `),
  version: "0.0.1",
  type: "action",
  props: {
    salesforce,
    alias: {
      type: "string",
      label: "Alias",
      description: "Alias of the user. The alias can contain only underscores and alphanumeric characters. It must be unique in your org, not include spaces, not end with a hyphen, and not contain two consecutive hyphens.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the user.",
    },
    emailEncodingKey: {
      type: "string",
      label: "Email Encoding Key",
      description: "The key used to encode the user's email.",
      options: [
        "ISO-8859-1",
        "UTF-8",
        "Shift_JIS",
        "EUC-JP",
        "ISO-2022-JP",
      ],
      default: "UTF-8",
    },
    languageLocaleKey: {
      type: "string",
      label: "Language Locale Key",
      description: "The user's language locale key.",
      async options() {
        const fields = await this.salesforce.getFieldsForObjectType("User");
        const { picklistValues } = fields.find(({ name }) => name === "LanguageLocaleKey");
        return picklistValues.map(({
          value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The user's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The user's last name.",
    },
    localeSidKey: {
      type: "string",
      label: "Locale Sid Key",
      description: "The user's locale sid key.",
      async options() {
        const fields = await this.salesforce.getFieldsForObjectType("User");
        const { picklistValues } = fields.find(({ name }) => name === "LocaleSidKey");
        return picklistValues.map(({
          value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "The ID of the user's profile.",
      async options() {
        const { records } = await this.salesforce.query({
          query: "SELECT Id, Name FROM Profile",
        });
        return records.map(({
          Id: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    timeZoneSidKey: {
      type: "string",
      label: "Time Zone Sid Key",
      description: "The user's time zone sid key.",
      async options() {
        const fields = await this.salesforce.getFieldsForObjectType("User");
        const { picklistValues } = fields.find(({ name }) => name === "TimeZoneSidKey");
        return picklistValues.map(({
          value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "The user's username. It should be in email format. Eg. `john@acme.com`.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The user's title.",
      optional: true,
    },
    department: {
      type: "string",
      label: "Department",
      description: "The department the user belongs to.",
      optional: true,
    },
    division: {
      type: "string",
      label: "Division",
      description: "The division the user belongs to.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The user's phone number.",
      optional: true,
    },
    mobilePhone: {
      type: "string",
      label: "Mobile Phone",
      description: "The user's mobile phone number.",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The user's street address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The user's city.",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The user's state.",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The user's postal code.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The user's country.",
      optional: true,
    },
    userRoleId: {
      type: "string",
      label: "User Role ID",
      description: "The ID of the user's role.",
      optional: true,
    },
    isActive: {
      type: "boolean",
      label: "Is Active",
      description: "Whether the user is active.",
      optional: true,
    },
  },
  methods: {
    createUser(args = {}) {
      return this.salesforce._makeRequest({
        method: "POST",
        url: this.salesforce._sObjectTypeApiUrl("User"),
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createUser,
      ...data
    } = this;

    const response = await createUser({
      $,
      data: utils.keysToCapitalCase(data),
    });
    $.export("$summary", `Successfully created user with ID \`${response.id}\``);
    return response;
  },
};
