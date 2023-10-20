import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smtp2go",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the pre-defined template in SMTP2GO.",
      async options({ prevContext }) {
        const { token } = prevContext;
        const {
          continue_token: continueToken, templates,
        } = await this.listTemplates(token);
        const options = templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
        return {
          options,
          context: {
            token: continueToken,
          },
        };
      },
    },
  },
  methods: {
    _apikey() {
      return this.$auth.api_key;
    },
    getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    async sharedRequest($, params) {
      const {
        endpoint,
        method,
        data,
      } = params;

      return axios($, {
        url: endpoint.includes("http")
          ? endpoint
          : `https://api.smtp2go.com/v3/${endpoint}`,
        method,
        headers: this.getHeaders(),
        data: {
          ...data,
          api_key: this._apikey(),
        },
      });
    },
    async sharedActionRequest($, endpoint: string, data: any) {
      return this.sharedRequest($, {
        endpoint,
        method: "POST",
        data,
      });
    },
    verifiedSent(result) {
      if (result.data.failed > 0) {
        throw new Error(`Mail sender responded with the following error(s): ${result.data.failures.join(",")}`);
      }
      return result;
    },
    async sendSingleEmail($, data: { sender: string; to: string[]; cc: string[]; bcc: string[]; subject: string; text_body: string; html_body: string; attachments: any[]; custom_headers: any[]; }, ignoreFailures: boolean) {
      const result = await this.sharedActionRequest($, "email/send", data);
      if (ignoreFailures) return result;
      return this.verifiedSent(result);
    },
    async sendSingleEmailWithTemplate($, data: { sender: string; to: string[]; cc: string[]; bcc: string[]; subject: string; template_id: string; template_data: any; attachments: any[]; custom_headers: any[]; }, ignoreFailures: boolean) {
      const result = await this.sharedActionRequest($, "email/send", data);
      if (ignoreFailures) return result;
      return this.verifiedSent(result);
    },
    async getTemplate(id: string, $ = this) {
      const { data } = await this.sharedActionRequest($, "template/view", {
        id,
      });
      return data;
    },
    async listTemplates(token: string, $ = this) {
      if (token) {
        return this.sharedActionRequest($, token);
      }
      const { data } = await this.sharedActionRequest($, "template/search");
      return data;
    },
  },
};
