import duxSoup from "../../dux_soup.app.mjs";

export default {
  key: "dux_soup-save-profile-lead",
  name: "Save Profile as Lead",
  description: "Queues a profile save action to store the targeted profile as a lead. [See the documentation](https://support.dux-soup.com/article/115-remote-control-by-example)",
  version: "0.0.1",
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
        command: "saveaslead",
        params: {
          profile: this.targetProfileURL,
        },
      },
    });
    $.export("$summary", `Successfully saved profile ${this.targetProfileUrl} as a lead`);
    return response;
  },
};
