import app from "../../tubular.app.mjs";

export default {
  key: "tubular-get-deals-by-date",
  name: "Get Deals By Date",
  description: "Get deals ordered by date of creation. [See the documentation](https://developer.tubular.io/examples/#get-deals-ordered-by-date-of-creation)",
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
        pipelines(first:100){
          edges{
            node{
              deals(orderBy:CREATED_AT, direction: DESC){
                edges{
                  node{
                    id
                    name
                    currency
                  }
                }
              }
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
    $.export("$summary", "Successfully fetched Deals");
    return response;
  },
};
