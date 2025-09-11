import app from "../../sproutgigs.app.mjs";

export default {
  key: "sproutgigs-get-zones",
  name: "Get Zones",
  description: "Get the available zones. [See the documentation](https://sproutgigs.com/api/documentation.php#jobs-zones)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getZones({
      $,
    });
    $.export("$summary", "Successfully sent the request. " + response.length + " results retrieved");
    return response;
  },
};
