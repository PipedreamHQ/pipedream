# Virtual Private Clouds

:::tip Beta feature

Virtual Private Clouds (VPCs) are now available in beta on the Business tier.

:::

Every Pipedream workflow is deployed to its own virtual machine in AWS. This means your workflow's execution environment has its own RAM and disk, isolated from other users’ workflows. 

However, outbound traffic shares the same network as other AWS services that use `us-east-1`. That means network requests from your workflows (e.g. an HTTP request or a connection to a database) originate from the standard range of AWS IP addresses.

Pipedream VPCs solve this problem. They enable you to run workflows in dedicated and isolated networks with static outbound egress IP addresss that are unique to your workspace (unlike other platforms that provide static IPs common to all customers on the platform). Outbound network requests from workflows that run in a VPC will originate from these static IP addresses, so you can whitelist access to sensitive resources (e.g., databases, APIs) with confidence that the requests will only originate from the Pipedream workflows in your workspace.

:::tip Control outbound HTTP requests IP addresses with VPCs

You may create one or more VPCs in your workspace. Each VPC will get a unique IP address for outbound traffic. However, each workflow can only run in a single network.

:::

[toc]

## Getting started

### Create a new VPC

1. Open the [Virtual Private Clouds tab](https://pipedream.com/settings/networks)

![]()

1. Click on New Network
1. Enter a network name and click Create
1. It may take 5-10 minutes to complete setting up your network. The status will change to *Available* when complete.

### Run workflows within a VPC

To run workflows in a VPC, check the Run in Private Network option in workflow settings and select the network you created. All outbound network requests for the workflow will originate from the static egress IP for the VPM (both when testing a workflow or when running the workflow in production).

![]()

If you don’t see the network listed, the network setup may still be in progress. If the issue persists longer than 10 minutes, please [contact support](https://pipedream.com/support).

### Find the static outbound IP address for a VPC

You can view and copy the static egress IP for each VPC in your workspace from the [Virtual Private Cloud settings](https://pipedream.com/settings/networks). If you need to restrict access to sensitive resources (e.g., a database) by IP address, copy this address and configure it in your application with the `/32` CIDR block. Network requests from workflows running in the VPC will originate from this address.

![]()

## Managing a VPC

To rename or delete a VPC, navigate to the [Virtual Private Cloud settings](https://pipedream.com/settings/networks) for your workspace and select the option from the menu at the the right of the VPC you want to manage.

## Advanced Setup

If you are interested in running Pipedream workflows in your own AWS account via VPC peering or running Pipedream as a platform on your own infrastructure, please reach out to our [Enterprise Sales team](mailto:sales@pipedream.com).

## Limitations

- Only workflows can run in VPCs (other resources like sources or data stores are not currently supported)
- Creating a new network can take ~5 minutes, and deploying your first workflow into a new network / testing in the builder for the first time can take ~1 min. Subsequent operations should be as fast as normal.
- VPCs only provide static IPs for outbound networks requests. This feature does not provide a static IP for or otherwise restrict inbound requests.
- You can’t set a default network for all new workflows in a workspace or project (you must select the network every time you create a new workflow)
- Managing workflow-network relationships in bulk is not supported yet (e.g., move one or more workflows to a network). You must set the network per workflow.
- Workflows running in a Private Network will still route select requests routed through Pipedream’s standard network
    - `$.send.http()` requests
    - Async options requests (these are requests that are made to populate options in drop down menus for actions while a building a workflow — e.g., the option to “select a Google Sheet” when using the “add row to Google Sheets” action)

## Cost

There are no additional costs to use VPCs during the beta. There may be additional charges in the future.
