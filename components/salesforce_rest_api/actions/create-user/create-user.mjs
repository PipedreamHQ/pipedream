import common from "../common/base.mjs";
import user from "../../common/sobjects/user.mjs";
import {
  pickBy, pick,
} from "lodash-es";
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
    Alias: {
      type: "string",
      label: "Alias",
      description: "Required. Alias of the user. The alias can contain only underscores and alphanumeric characters. It must be unique in your org, not include spaces, not end with a hyphen, and not contain two consecutive hyphens.",
    },
    Email: {
      type: "string",
      label: "Email",
      description: "Required. The email address of the user.",
    },
    EmailEncodingKey: {
      type: "string",
      label: "Email Encoding Key",
      description: "Required. The key used to encode the user's email.",
    },
    LanguageLocaleKey: {
      type: "string",
      label: "Language Locale Key",
      description: "Required. The user's language locale key.",
    },
    LastName: {
      type: "string",
      label: "Last Name",
      description: "Required. The user's last name.",
    },
    LocaleSidKey: {
      type: "string",
      label: "Locale Sid Key",
      description: "Required. The user's locale sid key.",
    },
    ProfileId: {
      type: "string",
      label: "Profile ID",
      description: "Required. The ID of the user's profile.",
    },
    TimeZoneSidKey: {
      type: "string",
      label: "Time Zone Sid Key",
      description: "Required. The user's time zone sid key.",
    },
    UserName: {
      type: "string",
      label: "User Name",
      description: "Required. The user's username.",
    },
  },  
  additionalProps() {
    return this.additionalProps(this.selector, user);
  },
  async run({ $ }) {
    const data = pickBy(pick(this, [
      "Alias",
      "Email",
      "EmailEncodingKey",
      "LanguageLocaleKey",
      "LastName",
      "LocaleSidKey",
      "ProfileId",
      "TimeZoneSidKey",
      "UserName",
    ]));
    const response = await this.salesforce.createUser({
      $,
      data,
    });
    $.export("$summary", `Successfully created user "${this.Alias}"`);
    return response;
  },
};