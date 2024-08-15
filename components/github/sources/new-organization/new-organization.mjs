import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-organization",
  name: "New Organization",
  description: "Emit new events when the authenticated user is added to a new organization",
  version: "0.1.17",
  type: "source",
  dedupe: "unique",
  async run() {
    const organizations = await this.github.getOrganizations();

    organizations.map((organization) => {
      this.$emit(organization, {
        id: organization.id,
        summary: `New organization ${organization.id}`,
        ts: new Date(),
      });
    });
  },
};
