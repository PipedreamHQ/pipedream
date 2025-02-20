import klipy from "../../klipy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "klipy-get-clips-by-slug",
  name: "Get Clips by Slug",
  description: "Identify user-viewed content and recommend tailored content to the same user. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    klipy,
    slug: {
      propDefinition: [
        klipy,
        "viewClipsSlug",
      ],
    },
    customerId: {
      propDefinition: [
        klipy,
        "viewClipsCustomerId",
      ],
    },
  },
  async run({ $ }) {
    // Trigger the view action for the specified slug and customer ID
    await this.klipy.viewClips({
      slug: this.slug,
      customer_id: this.customerId,
    });

    // Retrieve tailored content recommendations based on the viewed slug and customer ID
    const recommendations = await this.klipy.searchClips({
      q: this.slug,
      customer_id: this.customerId,
    });

    // Export a summary of the action
    $.export("$summary", "Successfully identified viewed content and fetched tailored recommendations.");

    // Return the recommended clips
    return recommendations;
  },
};
