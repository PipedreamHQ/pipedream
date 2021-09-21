const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-remove-webinar-panelist",
    name: "Remove Webinar Panelist",
    description: "Remove a single panelist from a webinar",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        webinarId: {
            label: "WebinarId",
            type: "integer",
            description: "The webinar ID " ,
            optional: false,
            default: ""
            // @todo use and async options to pull webinarID 
          },
          panelistId: {
            label: "PanelistId",
            type: "integer",
            description: "The panelist ID or panelist email.",
            optional: false,
            default: ""
            // @todo use and async options to pull panelistId
          }
        // @todo: add props
    },
    async run() {
        // @todo: add action logic
    }
}