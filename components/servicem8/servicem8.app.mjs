/**
 * ServiceM8 Pipedream app: OAuth, CRUD, webhooks, and messaging against the ServiceM8 API.
 * @module servicem8.app
 */
import { axios } from "@pipedream/platform";
import * as logic from "./common/logic.mjs";
import { createMethods } from "./common/methods.mjs";

/**
 * Build a prop definition that loads UUIDs for a ServiceM8 list resource via async options.
 * @param {string} resource - API resource segment (e.g. `job`, `companycontact`)
 * @param {string} label - UI label for the prop
 * @param {string} noun - Short noun for the description (e.g. `job`, `company`)
 * @returns {object} Pipedream prop definition with async options
 */
function makeResourceUuidProp(resource, label, noun) {
  return {
    type: "string",
    label,
    description: `Select a ${noun} or enter its UUID`,
    async options({
      $, prevContext,
    }) {
      return this._uuidOptionsForResource({
        $: $ ?? this,
        resource,
        prevContext,
      });
    },
  };
}

export default {
  type: "app",
  app: "servicem8",
  propDefinitions: {
    ...logic.listQueryPropDefinitions,
    record: {
      type: "object",
      label: "Record",
      description: "JSON object of fields for the ServiceM8 API request body. Updates use POST (not PATCH); include the full set of fields to persist—omitted fields may be cleared.",
    },
    ...Object.fromEntries(
      Object.entries(logic.RESOURCES).map(([
        key,
        {
          label, noun,
        },
      ]) => [
        `${key}Uuid`,
        makeResourceUuidProp(key, label, noun),
      ]),
    ),
  },
  methods: createMethods(axios),
};
