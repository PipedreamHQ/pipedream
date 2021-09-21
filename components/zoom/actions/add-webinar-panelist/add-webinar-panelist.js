const { axios } = require("@pipedreamhq/platform");
const zoom = require("../../zoom.app");

module.exports = {
    key: "zoom-add-webinar-panelist",
    name: "Add webinar panelist",
    description: "Adds a Zoom webinar panelist / `Pro or higher plan with a Webinar Add-on`",
    type: "action",
    version: "0.0.1",
    props: {
        zoom,
        webinarId: {
            label: "WebinarId",
            type: "integer",
            description: "The webinar ID",
            optional: false,
            default: ""
            // @todo use and async options to pull webinarID 
        },
        panelists: {
            label: "Panelists",
            type: "any",
            description: `List of panelist objects as JSON  
            Example:
            '[
                {
                    "name": "The panelist’s full name.", // This value cannot exceed more than 12 Chinese characters.",
                    "email": "Panelist's email.",
                }
            ]'
            `,
            optional: true,
            default: ""
        }
    },
    async run() {
        const requestData = this.zoom.filterEmptyRequestFields({
            panelists: this.panelists
        });
        
        const requestConfig = this.zoom.makeRequestConfig(
            `/webinars/${this.webinarId}/panelists`,
            "post",
            requestData,
        );

        try {
            let response = await axios(this, requestConfig);
            return response;
        } catch (error) {
            return error.response.data;
        }
     }
}