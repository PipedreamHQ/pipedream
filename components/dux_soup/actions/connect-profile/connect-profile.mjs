import duxSoup from "../../dux_soup.app.mjs";

export default {
  key: "dux_soup-connect-profile",
  name: "Connect Profile",
  description: "Queues a connection request to actively connect with a targeted LinkedIn profile. [See the documentation](https://support.dux-soup.com/article/115-remote-control-by-example)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    duxSoup,
    targetProfileUrl: {
      propDefinition: [
        duxSoup,
        "targetProfileUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.duxSoup.makeRequest({
      $,
      requestBody: {
        command: "connect",
        params: {
          profile: this.targetProfileURL,
        },
      },
    });
    $.export("$summary", `Successfully queued connection request to profile ID: ${this.targetProfileUrl}`);
    return response;
  },
};
