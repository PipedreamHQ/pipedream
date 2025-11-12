import common from "../common/base.mjs";

export default {
  ...common,
  key: "domain_group-agency-listing-updated",
  name: "Agency Listing Updated",
  description: "Emit new event when an agency listing is updated. [See the documentation](https://developer.domain.com.au/docs/latest/apis/pkg_listing_management/references/agencies_getlistings/)",
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
      return "dateUpdated";
    },
    generateMeta(item) {
      const ts = Date.parse(item[this.getTsField()]);
      return {
        id: `${item.id}${ts}`,
        summary: `Updated Listing with ID: ${item.id}`,
        ts,
      };
    },
  },
};
