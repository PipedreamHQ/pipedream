import vbout from "../../vbout.app.mjs";

export default {
  props: {
    vbout,
  },
  async run({ $ }) {
    const { response } = await this.processEvent($);
    $.export("$summary", response.data?.item || this.getSummary(response));
    return response;
  },
};
