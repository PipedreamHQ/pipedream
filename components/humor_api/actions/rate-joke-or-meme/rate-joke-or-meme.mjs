import app from "../../humor_api.app.mjs";

export default {
  key: "humor_api-rate-joke-or-meme",
  name: "Rate Joke or Meme",
  description: "Rate a joke or a meme with your upvote or downvote. [See the docs here](https://humorapi.com/docs/#Upvote-Joke).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    id: {
      type: "string",
      label: "Id",
      description: "The id of the joke or meme to vote.",
    },
    kind: {
      type: "string",
      label: "Kind",
      description: "Select if it's either a joke or a meme that you are rating.",
      options: [
        "jokes",
        "memes",
      ],
    },
    vote: {
      type: "string",
      label: "Vote",
      description: "Select if it's an upvote or downvote",
      options: [
        "upvote",
        "downvote",
      ],
    },
  },
  async run({ $ }) {
    const {
      id,
      kind,
      vote,
    } = this;

    const response = await this.app.rateContent({
      $,
      kind,
      id,
      vote,
    });

    $.export("$summary", `Successfully rated the ${kind.slice(0, -1)} with ${vote} and ID "${id}"`);

    return response;
  },
};
