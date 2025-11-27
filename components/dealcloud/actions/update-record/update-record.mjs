import commonCreateUpdate from "../common/common-create-update.mjs";

const {
  props: {
    dealcloud, entryTypeId, ignoreNearDups,
  },
} = commonCreateUpdate;

export default {
  ...commonCreateUpdate,
  key: "dealcloud-update-record",
  name: "Update Record",
  description: "Updates a record (entry) in DealCloud. [See the documentation](https://api.docs.dealcloud.com/docs/data/cells/postput)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    dealcloud,
    entryTypeId,
    entryId: {
      propDefinition: [
        dealcloud,
        "entryId",
        ({ entryTypeId }) => ({
          entryTypeId,
        }),
      ],
    },
    ignoreNearDups,
  },
  methods: {
    ...commonCreateUpdate.methods,
    isUpdate() {
      return true;
    },
    getEntryId() {
      return this.entryId;
    },
  },
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      dealcloud,
      entryTypeId,
      entryId,
      ignoreNearDups,
      convertFieldsToProps,
      isUpdate,
      getEntryId,
      getRequestData,
      ...props
    } = this;
    /* eslint-enable no-unused-vars */

    const response = await dealcloud.updateEntry({
      $,
      entryTypeId,
      data: this.getRequestData(props),
    });

    $.export("$summary", "Successfully updated record");
    return response;
  },
};

