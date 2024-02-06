import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-people-enrichment",
  name: "People Enrichment",
  description: "Enriches a person's information, the more information you pass in, the more likely we can find a match. [See the documentation](https://apolloio.github.io/apollo-api-docs/?shell#people-enrichment)",
  type: "action",
  version: "0.0.2",
  props: {
    app,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The person's first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The person's last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The person's email",
      optional: true,
    },
    organizationName: {
      type: "string",
      label: "Organization Name",
      description: "The person's company name",
      optional: true,
    },
  },
  methods: {
    peopleEnrichment(args = {}) {
      return this.app.post({
        path: "/people/match",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      peopleEnrichment,
      firstName,
      lastName,
      email,
      organizationName,
    } = this;

    const response = await peopleEnrichment({
      step,
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        organization_name: organizationName,
      },
    });

    step.export("$summary", `Successfully enriched person with ID ${response.person.id}`);

    return response;
  },
};
