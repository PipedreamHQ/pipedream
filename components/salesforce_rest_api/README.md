# Getting Started

You can install the Pipedream Salesforce app in the [Accounts](https://pipedream.com/accounts) section of your Pipedream account, or directly in a workflow.

## Prerequisite: Salesforce Edition with API Access

In order to use this application, you must be on a Salesforce Edition that has API Access, and API Access must be enabled. See [here](https://help.salesforce.com/s/articleView?id=000385436&type=1) for more details. 

**Salesforce Editions with API Access**
* Enterprise Edition
* Unlimited Edition
* Developer Edition
* Performance Edition
* Professional Edition (API access available as an add-on) 

### Enabling API Access on Salesforce

Your Salesforce user needs a **System Administrator** profile in order to enable API access. If you don't have this on your Salesforce Profile, ask your System Administrator to enable API Access for your user.

The most straightforward way to add these permissions is to create a new Permission Set in Salesforce, and to add it to the user once created.

Here is a step-by-step on how to do this:

**Create New Permission Set**

1. Navigate to your Salesforce instance, and click the Setup wheel in the top-right corner.
2. Under the Administration tab on the lefthand sidebar, click Users --> Permission Sets.
3. On the Permissions Set page, click New.
4. Create a new permission set, give it a label, API name, and description. Example: <br>
**Label**: Pipedream API Access
**API Name**: Pipedream
**Description**: Adds a set of permissions required for Pipedream. 

 <img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1702598220/Screenshot_2023-12-14_at_2.57.21_PM_dfgsrw.png" width=500>

**Add Permissions**

5. Now that the permission set is created, navigate to System Permissions.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1702598358/Screenshot_2023-12-14_at_3.00.49_PM_axtws5.png" width=500>

6. From System Permissions, click Edit.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1702598417/Screenshot_2023-12-14_at_3.01.38_PM_pvbopv.png" width=500>

7. Select the following permission, and click Save.
- API Enabled

If you'd like to utilize Pipedream's webhook triggers, you will need to add the following permissions to the permissions set as well:
- Apex REST Services
- Author Apex
- View Roles and Role Hierarchy
- Modify Metadata Through Metadata API Functions
- View Setup and Configuration
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1702598514/Screenshot_2023-12-14_at_3.48.50_PM_pcychy.png" width=500>

8. The list of added permissions (6) should look like this, and click save again.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1702598417/Screenshot_2023-12-14_at_3.10.17_PM_urgge8.png" width=500>

**Add Permission Set to User**

9. From the newly created Permission Set, click Manage Assignments, then Add Assignment.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1702598514/Screenshot_2023-12-14_at_3.21.59_PM_rqedtd.png" width=500>

10. Select the user you'd like to assign this permission set to, and click Assign. The user should now show up under Current Assignments.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1702598514/Screenshot_2023-12-14_at_3.52.42_PM_w4ge4p.png" width=500>

11. You should now be able to use the Salesforce integration along with the webhook triggers if you configured the required permissions above.


# Troubleshooting

## Unable to connect your account
If you're having issues connecting your Salesforce account on Pipedream, please ensure that IP Restrictions are not enabled for Pipedream. To learn more about what this means, please see the Salesforce documentation [here](https://help.salesforce.com/s/articleView?language=en_US&id=sf.connected_app_continuous_ip.htm&type=5).

To modify these settings: 
1. Navigate to Salesforce Setup.
2. Under **Apps**, click **Connected Apps**, then **Connected Apps OAuth Usage**.

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1705623649/Screenshot_2024-01-18_at_4.17.23_PM_mnwcdu.png" width=300>

3. If Pipedream is not yet installed, click **Install**, otherwise click **Manage App Policies**.
4. Click **Edit Policies**.
5. Under OAuth Policies, you should see the setting **IP Relaxation**. Set this to **Relax IP Restrictions**.

<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1705623651/Screenshot_2024-01-18_at_4.18.15_PM_kfzxnz.png">

## Instant trigger is not working
If you happen to stumble on the error: `UNKNOWN_EXCEPTION: admin operation already in progress` when creating an **Instant** trigger, you can follow the steps below to use the Salesforce Flow Builder to be able to use webhooks with Pipedream. This is a known error in Salesforce.

1. Create a New Workflow on [Pipedream](https://pipedream.com) and [add a HTTP trigger](https://pipedream.com/docs/workflows/steps/triggers/#http).
2. Login and go to your [Salesforce Setup Menu Page](https://help.salesforce.com/s/articleView?id=sf.basics_nav_setup.htm&type=5).
3. On the left hand Quick Find Bar, search for **Outbound Messages** in **Process Automation -> Workflow Actions**.
4. Click on the **New Outbound Message** button in the middle of the page.
5. Select the **Object Type** and click **Next**.
6. Fill in the **Name, Unique Name, and Available Fields to Send** fields in the form. On the **Endpoint URL** field, paste the **URL endpoint** generated by the HTTP trigger created earlier and then click **Save**.
7. Back to the left hand Quick Find Bar, search for **Flows** in **Process Automation**.
8. Click on **New Flow** button on the upper right hand corner and then select on **Record-Trigged Flow** and click on Create.
9. Select the same **Object Type** as before and select the appropriate flow trigger.
10. Optionally set **Entry Conditions**, keep **Actions and Related Records** selected, and click on **Done**.
11. Click on the plus sign below the newly created trigger and click on **Action**.
12. Search for **Outbound Message** and on the search bar select the trigger that was created previously.
13. Insert a **Label** and an **API Name** and then click on **Done**.
14. Save the flow by clicking on the **Save** button, insert a **Flow Label** and a **Flow API Name** and then click on **Activate** next to the Save button.
15. Back to the Pipedream Workflow, create a new step with the **Salesforce Convert SOAP Object** action.
16. In the **XML Soap Object** field, select the path from the trigger or type in `{{steps.trigger.event.body}}`.
17. That's it! You can now deploy the workflow and you will receive instant updates from Salesforce.
