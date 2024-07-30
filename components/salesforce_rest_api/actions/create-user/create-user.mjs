import common, { getProps } from "../common/base-create-update.mjs";
import user from "../../common/sobjects/user.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_user.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-user",
  name: "Create User",
  description: `Creates a Salesforce user. [See the documentation](${docsLink})`,
  version: "0.1.0",
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "User";
    },
    getAdvancedProps() {
      return user.extraProps;
    },
  },
  props: getProps({
    objType: user,
    docsLink,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
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
