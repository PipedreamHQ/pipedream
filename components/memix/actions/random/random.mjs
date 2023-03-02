import { axios } from "@pipedream/platform";
export default {
  name: "Caption to Memix URL",
  description:
    "Generate a Memix share URL with a random template using the supplied caption",
  key: "memix-random",
  version: "0.0.1",
  type: "action",
  props: {
    caption: {
      type: "string",
      label: "Caption",
    },
  },
  async run() {
    const data = await axios(this, {
      method: "get",
      headers: {
        "X-API-Partner": "pipedream",
      },
      url: "https://partner-api.memix.com/templates",
    });
    var template = data[Math.floor(Math.random() * data.length)];
    const memixUrl = `https://media.memix.com/memix-${
      template.id
    }.gif?text=${encodeURIComponent(this.caption)}`;
    return memixUrl;
  },
};
