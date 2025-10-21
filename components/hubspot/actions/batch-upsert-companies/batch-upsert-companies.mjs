import { ConfigurationError } from "@pipedream/platform";
import { API_PATH } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-batch-upsert-companies",
  name: "Batch Upsert Companies",
  description: "Upsert a batch of companies in Hubspot. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupsert)",
  version: "0.0.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hubspot,
    infoAlert: {
      type: "alert",
      alertType: "info",
      content:
        "Create or update companies identified by a unique property value as specified by the `idProperty` query parameter. `idProperty` query param refers to a property whose values are unique for the object. To manage properties in Hubspot, navigate to your Settings -> Data Management -> Properties.",
    },
    inputs: {
      type: "string[]",
      label: "Inputs (Companies)",
      description:
        "Provide a **list of companies** to be upserted. [See the documentation](https://developers.hubspot.com/docs/reference/api/crm/objects/companies#post-%2Fcrm%2Fv3%2Fobjects%2Fcompanies%2Fbatch%2Fupsert) for more information. Example: `[ { \"idProperty\": \"unique_property\", \"id\": \"123\", \"properties\": { \"name\": \"CompanyName\" } } ]`",
    },
  },
  methods: {
    batchUpsertCompanies(opts = {}) {
      return this.hubspot.makeRequest({
        api: API_PATH.CRMV3,
        endpoint: "/objects/companies/batch/upsert",
        method: "POST",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    try {
      const response = await this.batchUpsertCompanies({
        $,
        data: {
          inputs: parseObject(this.inputs),
        },
      });
      $.export("$summary", `Upserted ${response.results.length} companies`);
      return response;
    } catch (error) {
      const message = JSON.parse(
        JSON.parse(error.message).message.split(/:(.+)/)[1],
      )[0].message;
      throw new ConfigurationError(message.split(/:(.+)/)[0]);
    }
  },
};
