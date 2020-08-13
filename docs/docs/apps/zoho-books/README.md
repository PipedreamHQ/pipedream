# Zoho Books

Pipedream allows you to connect to the [Zoho Books API](https://www.zoho.com/books/api/v3/) from any workflow.

## Connecting to the Zoho Books API from Pipedream

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com).
2. [Create a new workflow](https://pipedream.com/new).
3. Select a [trigger](/workflows/steps/triggers/) for your workflow (for example, HTTP or Cron).
4. [Add a new step](/workflows/steps/) and search for "Zoho Books". This will display [actions](/workflows/steps/actions/) associated with the Zoho Books app. You can choose to either "Run Node.js code with Zoho Books" or select one of the pre-built actions for performing common API operations.
5. Once you've added a step, press the **Connect Account** button near the top. If this is your first time authorizing Pipedream's access to your Zoho Books account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the API. If you've already linked an Zoho Books account via Pipedream, pressing **Connect Account** will list any existing accounts you've linked.

Once you've connected your account, you can run your workflow and fetch data from the API. You can change any of the code associated with this step, changing the API endpoint you'd like to retrieve data from, or modifying the results in any way.

<Footer />
