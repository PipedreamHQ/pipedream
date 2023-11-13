import toggl from "../../toggl.app.mjs";

export default {
    name: "Update a Project",
    version: "0.0.1",
    description: "Update project for given workspace. [See docs here.](https://developers.track.toggl.com/docs/api/projects#post-workspaceprojects)",
    type: "action",
    key: "toggle-update-project",
    props: {
        toggl,
        workspace_id: {
            type: "integer",
            label: "Workspace ID",
            description: "Numeric ID of the workspace"
        },
        project_id: {
            type: "integer",
            label: "Project ID",
            description: "Numeric ID of the project"
        },
        name: {
            type: "string",
            label: "Name",
            description: 'unique for client and workspace'
        },
        client_id: {
            type: 'integer',
            label: 'client ID',
            optional: true,
        },
        client_name: {
            type: 'string',
            label: 'client Name',
            optional: true,
        },
        active: {
            type: 'boolean',
            label: 'Active',
            optional: true,
            description: ' Whether the project is archived or not',
        },
        is_private: {
            type: 'boolean',
            label: 'Is Private',
            optional: true,
            description: 'Whether project is accessible for only project users or for all workspace users',
        },
        template: {
            type: 'boolean',
            label: 'Template',
            optional: true,
            description: 'Whether the project can be used as a template',
        },
        template_id: {
            type: 'integer',
            label: 'Template ID',
            description: "Id of the template project used on current project's creation",
            optional: true,
        },
        billable: {
            type: 'boolean',
            label: 'Billable',
            description: "Whether the project is billable or no (available only for pro workspaces)",
        },
        auto_estimates: {
            type: 'boolean',
            label: 'Auto Estimates',
            optional: true,
            description: "whether the estimated hours are automatically calculated based on task estimations or manually fixed based on the value of 'estimated_hours' (premium functionality) ",
        },
        estimated_hours: {
            type: 'boolean',
            label: 'Estimated Hours',
            optional: true,
            description: "if auto_estimates is true then the sum of task estimations is returned, otherwise user inserted hours (premium functionality)"
            
        },
        color: {
            type: 'string',
            label: 'Color',
            description: 'Project color',
        },
        rate: {
            type: 'integer',
            label: 'Rate',
            description: 'Hourly Rate. premium feature',
            optional: true,
        },
        fixed_fee: {
            type: 'integer',
            label: 'Rate',
            description: 'Project fixed fee. premium feature',
            optional: true,
        },
        currency: {
            type: 'string',
            label: 'Currency',
            description: 'Project currency. premium feature',
            optional: true,
        },
        start_date: {
            type: 'string',
            label: 'Start Date',
            description: 'Start date of a project timeframe',
        },
        end_date: {
            type: 'string',
            label: 'End Date',
            description: 'End date of a project timeframe',
        },
    },
    async run({ $ }) {
        const { 
            name, workspace_id,client_id,client_name, active, 
            is_private, template, template_id, billable, auto_estimates, 
            estimated_hours, color, rate, fixed_fee, currency, start_date, end_date} =  this;
        const data = {
            name, 
            workspace_id,
            client_id,
            client_name, 
            active,
            is_private, 
            template, 
            template_id, 
            billable, 
            auto_estimates,
            estimated_hours, 
            color, 
            rate,
            fixed_fee, 
            currency,
            start_date,
            end_date
        }
        const response = await this.toggl.updateProject({
            workspace_id: this.workspace_id,
            project_id: this.project_id,
            payload: data,
        })

        response && $.export("$summary", `Successfully created updated the ${response.name} project`);
    }
}