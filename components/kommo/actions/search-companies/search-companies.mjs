import kommo from "../../kommo.app.mjs";

export default {
  key: "kommo-search-companies",
  name: "Search Companies",
  description: "Searches for companies within Kommo or lists all of them. [See the documentation](https://www.kommo.com/developers/content/api_v4/companies-api/)",
  version: "0.0.1",
  type: "action",
  props: {
    kommo,
    companyId: {
      propDefinition: [
        kommo,
        "companyId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Filter by company name",
      optional: true,
    },
    createdBy: {
      propDefinition: [
        kommo,
        "userId",
      ],
      label: "Created By",
      description: "Filter by ID of the user who created the entity.",
      optional: true,
    },
    updatedBy: {
      propDefinition: [
        kommo,
        "userId",
      ],
      label: "Updated By",
      description: "Filter by ID of the user who changed the entity last.",
      optional: true,
    },
    responsibleUserId: {
      propDefinition: [
        kommo,
        "userId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kommo.searchCompanies({
      $,
      params: {
        "filter[id]": this.companyId,
        "filter[name]": this.name,
        "filter[created_by]": this.createdBy,
        "filter[updated_by]": this.updatedBy,
        "filter[responsible_user_id]": this.responsibleUserId,
      },
    });

    $.export("$summary", `Successfully found ${response.length} companies`);
    return response;
  },
};
