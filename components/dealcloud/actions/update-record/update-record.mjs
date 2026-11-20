import commonCreateUpdate from "../common/common-create-update.mjs";

const {
  props: {
    dealcloud, entryTypeId, fields, ignoreNearDups,
  },
} = commonCreateUpdate;

export default {
  ...commonCreateUpdate,
  key: "dealcloud-update-record",
  name: "Update Record",
  description: "Updates a record (entry) in DealCloud. [See the documentation](https://api.docs.dealcloud.com/docs/data/cells/postput)",
  version: "0.1.0",
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
    fields: {
      ...fields,
      description: `${fields.description} Only the fields you name are changed; everything else on the record keeps its stored value.`,
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
    const data = await this.buildRequestData();

    const response = await this.dealcloud.updateEntry({
      $,
      entryTypeId: this.entryTypeId,
      data,
    });

    $.export("$summary", `Successfully updated record ${this.entryId}`);
    return response;
  },
};

