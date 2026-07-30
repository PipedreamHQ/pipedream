// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_contacts-modify-contact-group-members",
  name: "Modify Contact Group Members",
  description:
    "Adds contacts to or removes contacts from a contact group. [See the documentation](https://developers.google.com/people/api/rest/v1/contactGroups.members/modify)",
  version: "0.0.1",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  type: "action",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        common.props.googleContacts,
        "contactGroupResourceName",
      ],
    },
    resourceNamesToAdd: {
      type: "string[]",
      label: "Contacts to Add",
      description:
        "The resource names of contacts to add to the group, in the form `people/{person_id}`.",
      optional: true,
    },
    resourceNamesToRemove: {
      type: "string[]",
      label: "Contacts to Remove",
      description:
        "The resource names of contacts to remove from the group, in the form `people/{person_id}`.",
      optional: true,
    },
  },
  methods: {
    async processResults(client) {
      if (
        !this.resourceNamesToAdd?.length &&
        !this.resourceNamesToRemove?.length
      ) {
        throw new ConfigurationError(
          "Provide at least one contact to add or remove.",
        );
      }
      return this.googleContacts.modifyContactGroupMembers(client, {
        resourceName: this.resourceName,
        requestBody: {
          resourceNamesToAdd: this.resourceNamesToAdd,
          resourceNamesToRemove: this.resourceNamesToRemove,
        },
      });
    },
    emitSummary($, results) {
      const requestedAdded = this.resourceNamesToAdd?.length || 0;
      const requestedRemoved = this.resourceNamesToRemove?.length || 0;

      const unresolved =
        (results?.notFoundResourceNames?.length || 0) +
        (results?.canNotRemoveLastContactGroupResourceNames?.length || 0);

      const processed = requestedAdded + requestedRemoved - unresolved;

      $.export(
        "$summary",
        `Processed ${processed} contact membership change${
          processed === 1
            ? ""
            : "s"
        }${unresolved
          ? ` (${unresolved} could not be completed)`
          : ""}.`,
      );
    },
  },
};
