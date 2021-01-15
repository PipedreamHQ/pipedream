const activecampaign = require("../activecampaign.app.js");

module.exports = {
  dedupe: "unique",
  props: {
    activecampaign,
    db: "$.service.db",
  },
};
