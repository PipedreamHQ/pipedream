import common from "../common/base.mjs";

export default {
  ...common,
  key: "domain_group-new-agency-listing-created",
  name: "New Agency Listing Created",
  description: "Emit new event when a new agency listing is created. [See the documentation](https://developer.domain.com.au/docs/latest/apis/pkg_listing_management/references/agencies_getlistings/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    agencyId: {
      propDefinition: [
        common.props.domainGroup,
        "agencyId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.domainGroup.listAgencyListings;
    },
    getArgs(lastTs) {
      const args = {
        agencyId: this.agencyId,
      };
      if (lastTs) {
        args.params = {
          dateUpdatedSince: lastTs,
        };
      }
      return args;
    },
    getTsField() {
      return "dateCreated";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Listing with ID: ${item.id}`,
        ts: Date.parse(item[this.getTsField()]),
      };
    },
  },
};
