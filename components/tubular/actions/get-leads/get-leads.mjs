import app from "../../tubular.app.mjs";

export default {
  key: "tubular-get-leads",
  name: "Get Leads",
  description: "Get leads ordered by date of creation. [See the documentation](https://developer.tubular.io/examples/#get-first-10-leads)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const query = `{
      viewer{
        leads(first: 100){
          edges{
            node{
              id
              fullName
              email
              lead
            }
          }
        }
      }
    }`;
    const response = await this.app.post({
      $,
      data: {
        query,
      },
    });
    $.export("$summary", "Successfully fetched Leads");
    return response;
  },
};
