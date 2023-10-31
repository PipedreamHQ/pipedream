import blink from "../../blink.app.mjs";

export default {
  key: "blink-post-feed",
  name: "Post to Feed",
  description: "Create a new card in selected users or teams' feeds. [See the documentation](https://developer.joinblink.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    blink,
    userId: {
      propDefinition: [
        blink,
        "userId",
      ],
    },
    teamId: {
      propDefinition: [
        blink,
        "teamId",
      ],
    },
    data: {
      propDefinition: [
        blink,
        "data",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.blink.createCard({
      userId: this.userId,
      teamId: this.teamId,
      data: this.data,
    });

    $.export("$summary", "Card successfully created");
    return response;
  },
};
