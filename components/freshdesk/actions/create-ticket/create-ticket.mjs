import freshdesk from "../../freshdesk.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "freshdesk-create-ticket",
  name: "Create a Ticket",
  description: "Create a ticket. [See docs here](https://developers.freshdesk.com/api/#tickets)",
  version: "0.0.1",
  type: "action",
  props: {
    freshdesk,
    companyId: {
      propDefinition: [
        freshdesk,
        "companyId",
      ],
      description: "ID of the company to which this ticket belongs",
    },
    email: {
      propDefinition: [
        freshdesk,
        "contactEmail",
        ({ companyId }) => ({
          companyId,
        }),
      ],
      description: "Email address of the requester.",
      optional: true,
    },
    priority: {
      propDefinition: [
        freshdesk,
        "ticketPriority",
      ],
      default: 1,
    },
    description: {
      type: "string",
      label: "Description",
      description: "HTML content of the ticket.",
    },
    phone: {
      type: "string",
      label: "Phone number",
      description: "Telephone number of the contact.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Subject of the ticket.",
    },
    status: {
      propDefinition: [
        freshdesk,
        "ticketStatus",
      ],
      default: 2,
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.email && !this.phone) {
      throw new ConfigurationError("Please fill at least 1 of email and phone fields");
    }
    const data = removeNullEntries({
      company_id: this.companyId && Number(this.companyId),
      description: this.description,
      email: this.email,
      phone: this.phone,
      subject: this.subject,
      status: this.status && Number(this.status),
      priority: this.priority && Number(this.priority),
    });
    const response = await this.freshdesk.createTicket({
      $,
      data,
    });
    response && $.export("$summary", "Ticket successfully created");
    return response;
  },
};
