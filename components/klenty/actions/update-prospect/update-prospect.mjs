import klenty from "../../klenty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klenty-update-prospect",
  name: "Update Prospect",
  description: "Updates an existing prospect's information in Klenty. [See the documentation](https://www.klenty.com/developers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klenty,
    prospectEmail: {
      propDefinition: [
        klenty,
        "prospectEmail",
        async (options, { prevContext }) => {
          const { page = 0 } = prevContext;
          const { items } = await klenty.getProspectsByList({
            params: {
              start: page,
            },
          });
          return {
            options: items.map(({
              Email, FullName,
            }) => ({
              label: FullName,
              value: Email,
            })),
            context: {
              page: page + 100,
            },
          };
        },
      ],
    },
    prospectData: {
      propDefinition: [
        klenty,
        "prospectData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.klenty.updateProspect({
      prospectEmail: this.prospectEmail,
      prospectData: this.prospectData,
    });

    $.export("$summary", `Updated prospect ${this.prospectEmail} successfully`);
    return response;
  },
};
