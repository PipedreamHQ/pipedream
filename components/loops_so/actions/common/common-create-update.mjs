/* eslint-disable no-unused-vars */
import pickBy from "lodash.pickby";
import { parseObject } from "../../common/utils.mjs";
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
    source: {
      propDefinition: [
        loops,
        "source",
      ],
    },
    subscribed: {
      propDefinition: [
        loops,
        "subscribed",
      ],
    },
    userGroup: {
      propDefinition: [
        loops,
        "userGroup",
      ],
    },
    userId: {
      propDefinition: [
        loops,
        "userId",
      ],
    },
    mailingLists: {
      propDefinition: [
        loops,
        "mailingLists",
      ],
    },
    customFields: {
      propDefinition: [
        loops,
        "customFields",
      ],
    },
  },
  methods: {
    prepareData() {
      const {
        loops,
        customFields,
        mailingLists,
        ...data
      } = this;

      const mailingListObject = {};
      for (const item of (parseObject(mailingLists) || [])) {
        mailingListObject[item] = true;
      }

      return pickBy({
        mailingLists: mailingListObject,
        ...data,
      });
    },
  },
};
