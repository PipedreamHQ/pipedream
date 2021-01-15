const activecampaign = require("../activecampaign.app.js");
const common = require("./common-webhook.js");

module.exports = {
	...common,
	props: {
		...common.props,
		campaigns: { propDefinition: [activecampaign, "campaigns"] },
	},
	methods: {
		isRelevant(body) {
			return (
				this.campaigns.length === 0 ||
				this.campaigns.includes(body["campaign[id]"])
			);
		},
		getMeta(body) {
			return {
				id: `${body["campaign[id]"]}${body["contact[id]"]}`,
				summary: `${body["contact[email]"]}, Campaign: ${body["campaign[name]"]}`,
			};
		},
	},
};