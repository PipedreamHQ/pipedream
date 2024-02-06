import devrev from "../../devrev.app.mjs";

export default {
  props: {
    devrev,
    appliesToPart: {
      propDefinition: [
        devrev,
        "partId",
      ],
    },
    ownedBy: {
      propDefinition: [
        devrev,
        "userIds",
      ],
      label: "Owned By",
      description: "The users that own the work",
    },
    title: {
      propDefinition: [
        devrev,
        "title",
      ],
    },
    body: {
      propDefinition: [
        devrev,
        "body",
      ],
    },
    customSchemaFragments: {
      propDefinition: [
        devrev,
        "customSchemaFragmentIds",
      ],
    },
    tagIds: {
      propDefinition: [
        devrev,
        "tagIds",
      ],
    },
  },
  methods: {
    getType() {
      throw new Error("getType is not implemented.");
    },
  },
  async run({ $ }) {
    const type = this.getType();

    const data = {
      type,
      applies_to_part: this.appliesToPart,
      owned_by: this.ownedBy,
      title: this.title,
      body: this.body,
      custom_schema_fragments: this.customSchemaFragments,
      reported_by: this.reportedBy,
      priority: this.priority,
      account: this.accountId,
      rev_org: this.revOrgId,
    };

    if (this.tagIds?.length) {
      data.tags = this.tagIds.map((id) => ({
        id,
      }));
    }

    const response = await this.devrev.createWorks({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created ${type} with ID ${response.work.id}.`);
    }

    return response;
  },
};
