import { ConfigurationError } from "@pipedream/platform";
import common from "../common/polling.mjs";
import utils from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "linkedin-new-organization-post-created",
  name: "New Organization Post Created",
  description: "Emit new event when a new post is created by the organization. [See the documentation](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2024-09&tabs=curl#find-posts-by-authors).",
  type: "source",
  version: "0.0.5",
  dedupe: "unique",
  props: {
    ...common.props,
    organizationVanityName: {
      type: "string",
      label: "Organization Vanity Name",
      description: "You can get the Orgainization Vanity Name from the company LinkedIN URL, for example, if the company LinkedIn URL is `https://www.linkedin.com/company/confluent`, then the Organization Vanity Name is `confluent`.",
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const {
        app,
        organizationVanityName,
        setOrganizationId,
        setIsFirstRun,
      } = this;

      const { elements } = await app.searchOrganizations("vanityName", {
        debug: true,
        params: {
          vanityName: organizationVanityName,
        },
        paramsSerializer: utils.getParamsSerializer(utils.encodeFn),
      });

      const organizationFound =
        elements?.find(({ vanityName }) => vanityName === organizationVanityName);

      if (!organizationFound) {
        throw new ConfigurationError(`There's no Organization matched for Organization Vanity Name \`${organizationVanityName}\`.`);
      }

      setOrganizationId(organizationFound.id);
      setIsFirstRun(true);
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "createdAt";
    },
    getResourceName() {
      return "elements";
    },
    getResourcesFn() {
      return this.app.listPosts;
    },
    getResourcesFnArgs() {
      const author = `urn:li:organization:${this.getOrganizationId()}`;
      return {
        debug: true,
        params: {
          author,
          q: "author",
          sortBy: "CREATED",
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Org Post: ${resource.id}`,
        ts: resource.createdAt,
      };
    },
  },
  sampleEmit,
};
