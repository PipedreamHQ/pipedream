import intellihr from "../../intellihr.app.mjs";

export default {
  key: "intellihr-find-person",
  name: "Find Person",
  description: "Searches for a person in intellihr using. [See the documentation](https://developers.intellihr.io/docs/v1/#tag/People/paths/~1people/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    intellihr,
    name: {
      type: "string",
      label: "Name",
      description: "Name of a Person in the system. This filter checks for an exact string match with any part of a Persons name. This filter is performed case insensitively and regardless of name order",
      optional: true,
    },
    email: {
      propDefinition: [
        intellihr,
        "email",
      ],
      optional: true,
    },
    employeeNumber: {
      propDefinition: [
        intellihr,
        "employeeNumber",
      ],
    },
    jobId: {
      propDefinition: [
        intellihr,
        "jobId",
      ],
    },
    updatedWithin: {
      type: "integer",
      label: "Updated Within",
      description: "Filters people that have been updated within the specified amount of days.",
      optional: true,
    },
    isOnExtendedLeave: {
      type: "boolean",
      label: "Is On Extended Leave",
      description: "Filters people that are on extended leave.",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.intellihr.paginate({
      resourceFn: this.intellihr.listPeople,
      params: {
        "filters[name][eq]": this.name,
        "filters[primaryEmailAddress][eq]": this.email,
        "filters[employeeNumber][eq]": this.employeeNumber,
        "filters[jobId][eq]": this.jobId,
        "filters[updatedWithin][eq]": this.updatedWithin,
        "filters[isOnExtendedLeave][eq]": this.isOnExtendedLeave === true
          ? "true"
          : this.isOnExtendedLeave === false
            ? "false"
            : undefined,
      },
    });

    const people = [];
    for await (const person of results) {
      people.push(person);
    }

    $.export("$summary", `Found ${people.length} person(s)`);
    return people;
  },
};
