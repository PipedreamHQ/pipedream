import affinity from "../../affinity.app.mjs";

export default {
  key: "affinity-new-organization",
  name: "New Organization",
  description: "Emits an event when a new organization is added to Affinity",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    affinity,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    ...affinity.methods,
    _getPreviousLastOrganizationId() {
      return this.db.get("lastOrganizationId") || 0;
    },
    _setLastOrganizationId(lastOrganizationId) {
      this.db.set("lastOrganizationId", lastOrganizationId);
    },
  },
  hooks: {
    async deploy() {
      const { data: organizations } = await this.affinity.searchEntities({
        type: 1, // organization type
        page: 0,
        per_page: 1,
        order: "desc",
      });
      if (organizations.length > 0) {
        this._setLastOrganizationId(organizations[0].id);
      }
    },
  },
  async run() {
    let lastOrganizationId = this._getPreviousLastOrganizationId();
    let page = 0;
    while (true) {
      const { data: organizations } = await this.affinity.searchEntities({
        type: 1, // organization type
        page,
        per_page: 100,
      });
      if (organizations.length === 0) {
        console.log("No new organizations found");
        break;
      }
      for (const organization of organizations) {
        if (organization.id <= lastOrganizationId) {
          // we've already seen this organization (and all the following ones)
          return;
        }
        this.$emit(organization, {
          id: organization.id,
          summary: `New organization: ${organization.name}`,
          ts: Date.now(),
        });
        if (organization.id > lastOrganizationId) {
          lastOrganizationId = organization.id;
        }
      }
      page++;
    }
    this._setLastOrganizationId(lastOrganizationId);
  },
};
