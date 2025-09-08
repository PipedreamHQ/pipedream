import exactMails from "../../exact_mails.app.mjs";

export default {
  props: {
    exactMails,
  },
  async run({ $ }) {
    const fn = this.getFn();
    const response = await fn({
      $,
      data: this.getData(),
    });

    $.export("$summary", response.message);
    return response;
  },
};
