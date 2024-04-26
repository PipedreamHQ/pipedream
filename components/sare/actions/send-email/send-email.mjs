import sare from "../../sare.app.mjs";

export default {
  key: "sare-send-email",
  name: "Send Transactional Email",
  description: "Send a transactional email. [See the documentation](https://dev.sare.pl/rest-api/other/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    sare,
    email: sare.propDefinitions.email,
    subject: sare.propDefinitions.subject,
    from: sare.propDefinitions.from,
    gsm: {
      ...sare.propDefinitions.gsm,
      optional: true,
    },
    group: {
      ...sare.propDefinitions.group,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sare.sendTransactionalEmail({
      email: this.email,
      subject: this.subject,
      from: this.from,
      ...(this.gsm
        ? {
          gsm: this.gsm,
        }
        : {}),
      ...(this.group
        ? {
          group: this.group,
        }
        : {}),
    });
    $.export("$summary", `Successfully sent email to ${this.email}`);
    return response;
  },
};
