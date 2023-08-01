# Virtual Private Clouds

:::tip Beta feature

Virtual Private Clouds (VPCs) are now available in beta on the Business tier.

:::

Every Pipedream workflow is deployed to its own virtual machine in AWS. This means your workflow's execution environment has its own RAM and disk, isolated from other users’ workflows. 

However, outbound traffic shares the same network as other AWS services that use `us-east-1`. That means network requests from your workflows (e.g. an HTTP request or a connection to a database) originate from the standard range of AWS IP addresses.

Pipedream VPCs solve this problem. They enable you to run workflows in dedicated and isolated networks with static outbound egress IP addresss that are unique to your workspace (unlike other platforms that provide static IPs common to all customers on the platform).

Outbound network requests from workflows that run in a VPC will originate from these static IP addresses, so you can whitelist access to sensitive resources (e.g., databases, APIs) with confidence that the requests will only originate from the Pipedream workflows in your workspace.

[[toc]]

## Getting started

### Create a new VPC

1. Open the [Virtual Private Clouds tab](https://pipedream.com/settings/networks):

![Finding the Virtual Private Cloud settings within your workspace settings](https://res.cloudinary.com/pipedreamin/image/upload/v1690914583/CleanShot_2023-08-01_at_14.29.24_slx1a7.png)

1. Click on **New VPC** in the upper right of the page:

![Adding a new VPC network](https://res.cloudinary.com/pipedreamin/image/upload/v1690914653/CleanShot_2023-08-01_at_14.30.47_okdiyx.png)

2. Enter a network name and click **Create**:

![Naming you private VPC before creating it](https://res.cloudinary.com/pipedreamin/image/upload/v1690913009/CleanShot_2023-08-01_at_14.03.24_smxujq.png)

3. It may take 5-10 minutes to complete setting up your network. The status will change to **Available** when complete:

![The status of the VPC changes to available when finished](https://res.cloudinary.com/pipedreamin/image/upload/v1690913069/CleanShot_2023-08-01_at_14.04.22_ro2bgx.png)

### Run workflows within a VPC

To run workflows in a VPC, check the **Run in Private Network** option in workflow settings and select the network you created. All outbound network requests for the workflow will originate from the static egress IP for the VPM (both when testing a workflow or when running the workflow in production).

![Selecting a VPC within the workflow settings](https://res.cloudinary.com/pipedreamin/image/upload/v1690913944/CleanShot_2023-08-01_at_14.18.42_rihwff.png)

If you don’t see the network listed, the network setup may still be in progress. If the issue persists longer than 10 minutes, please [contact support](https://pipedream.com/support).

### Find the static outbound IP address for a VPC

You can view and copy the static outbound IP address for each VPC in your workspace from the [Virtual Private Cloud settings](https://pipedream.com/settings/networks). If you need to restrict access to sensitive resources (e.g., a database) by IP address, copy this address and configure it in your application with the `/32` CIDR block. Network requests from workflows running in the VPC will originate from this address.

![Finding the egress IP address for a Pipedream VPC](https://res.cloudinary.com/pipedreamin/image/upload/v1690914910/CleanShot_2023-08-01_at_14.34.56_lp5jt3.png)

## Managing a VPC

To rename or delete a VPC, navigate to the [Virtual Private Cloud settings](https://pipedream.com/settings/networks) for your workspace and select the option from the menu at the the right of the VPC you want to manage.

## Advanced Setup

If you are interested in running Pipedream workflows in your own AWS account via VPC peering or running Pipedream as a platform on your own infrastructure, please reach out to our [Enterprise Sales team](mailto:sales@pipedream.com).

## Limitations

- Only workflows can run in VPCs (other resources like sources or data stores are not currently supported)
- Creating a new network can take ~5 minutes, and deploying your first workflow into a new network / testing in the builder for the first time can take ~1 min. Subsequent operations should be as fast as normal.
- VPCs only provide static IPs for outbound network requests. This feature does not provide a static IP for or otherwise restrict inbound requests.
- You can’t set a default network for all new workflows in a workspace or project (you must select the network every time you create a new workflow)
- Managing workflow-network relationships in bulk is not supported yet (e.g., move one or more workflows to a network). You must set the network per workflow.
- Workflows running in a Private Network will still route select requests routed through Pipedream’s standard network
    - [`$.send.http()`](/destinations/http/) requests
    - Async options requests (these are requests that are made to populate options in drop down menus for actions while a building a workflow — e.g., the option to “select a Google Sheet” when using the “add row to Google Sheets” action)

## Frequently Asked Questions

### Will HTTP requests sent from Node.js, Python and the HTTP request steps use the assigned static IP address?

Yes, all steps that send HTTP requests from a workflow assigned to a VPC will use that VPC's IP address to send HTTP requests.

This will also include `axios`, `requests`, `fetch` or any HTTP client you prefer in your language of choice.

The only exception are requests sent by `$.send.http()` or the HTTP requests used to populate async options that power props like "Select a Google Sheet" or "Select a Slack channel". These requests will route through the [standard set of Pipedream IP addresses.](/workflows/networking/)

### Can a single workflow live within multiple VPCs?

No, a VPC can contain many workflows, but a single workflow can only belong to at most one VPCs.

### Can I modify my VPC's IP address to another address?

No, IP addresses are assigned to VPCs for you, and they are not changable.

### How much will VPCs cost?

VPCs are available on the **Business** plan during the Beta period. You can [upgrade your plan here.](https://pipedream.com/pricing)
