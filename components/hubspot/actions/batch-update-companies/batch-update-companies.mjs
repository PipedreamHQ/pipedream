import hubspot from "../../hubspot.app.mjs";
import { API_PATH } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "hubspot-batch-update-companies",
  name: "Batch Update Companies",
  description: "Update a batch of companies in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupdate)",
  version: "0.0.1",
  type: "action",
  props: {
    hubspot,
    inputs: {
      type: "string[]",
      label: "Inputs (Companies)",
      description: "Provide a **list of companies** to be updated. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupdate) for more information. Example: `[ { \"id\": \"123\", \"properties\": { \"name\": \"CompanyName\"} } ]`",
    },
  },
  methods: {
    batchUpdateCompanies(opts = {}) {
      return this.hubspot.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/companies/batch/update",
        method: "POST",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const response = await this.batchUpdateCompanies({
      $,
      data: {
        inputs: parseObject(this.inputs),
      },
    });
    $.export("$summary", `Updated ${response.results.length} companies`);
    return response;
  },
};
