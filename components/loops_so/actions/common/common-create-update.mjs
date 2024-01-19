import loops from "../../loops_so.app.mjs";

export default {
  async additionalProps() {
    return (this.customFields || []).reduce((acc, key) => {
      acc[key] = {
        type: "string",
        label: `Custom Field: ${key}`,
        optional: true,
      };
      return acc;
    }, {});
  },
  props: {
    loops,
    email: {
      propDefinition: [
        loops,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        loops,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        loops,
        "lastName",
      ],
    },
    userGroup: {
      propDefinition: [
        loops,
        "userGroup",
      ],
    },
    customFields: {
      propDefinition: [
        loops,
        "customFields",
      ],
    },
  },
};
