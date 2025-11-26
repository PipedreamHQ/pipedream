import { convertFieldsToProps } from "../../common/utils.mjs";
import dealcloud from "../../dealcloud.app.mjs";

export default {
  methods: {
    convertFieldsToProps,
    isUpdate() {
      return false;
    },
    getEntryId() {
      return -1;
    },
    getRequestData(props) {
      return {
        storeRequests: Object.entries(props).map(([
          key,
          value,
        ]) => {
          const fieldId = key.split("_")[1];
          return {
            entryId: this.getEntryId(),
            fieldId,
            ignoreNearDups: this.ignoreNearDups,
            value,
          };
        }),
      };
    },
  },
  props: {
    dealcloud,
    entryTypeId: {
      propDefinition: [
        dealcloud,
        "entryTypeId",
      ],
      reloadProps: true,
    },
    ignoreNearDups: {
      propDefinition: [
        dealcloud,
        "ignoreNearDups",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.entryTypeId) {
      return props;
    }
    const fields = await this.dealcloud.getEntryTypeFields({
      entryTypeId: this.entryTypeId,
    });
    return this.convertFieldsToProps(fields);
  },
};

