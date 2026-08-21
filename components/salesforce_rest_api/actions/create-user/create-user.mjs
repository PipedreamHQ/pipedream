// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import user from "../../common/sobjects/user.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_user.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-user",
  name: "Create User",
  description: "Create a Salesforce user (a login for a person in your org)."
    + " Requires an available user license and a unique `Username` in email form; the `Username` must be globally unique across all Salesforce orgs."
    + " Use **Get User** or **Find Records** on `User` to check whether the person already has an account."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.1.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
  },
  props: getProps({
    objType: user,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      additionalFields,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("User", {
      $,
      data: {
        ...data,
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created user (ID: ${response.id})`);
    return response;
  },
};
