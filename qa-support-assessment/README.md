
### Mock Support Request:

A Connect developer has told us their customer is trying to use a couple Zendesk actions in their application via Connect but they are running into issues with two of them.

### Issue 1: Create Ticket action fails

I'm using the **Create Ticket** action to automatically create support tickets in our Zendesk instance when customers fill out a form on our website. When I test the action, I get back an error from the Zendesk API. I've double-checked my Zendesk connection and it seems to be authenticated correctly.

### Issue 2: Search Tickets returns no results

To troubleshoot, I tried using the **Search Tickets** action to see if maybe tickets were being created but with wrong data. I used the query `type:tickets` to search for all tickets, but the search returns an error even though I know we have hundreds of tickets in our Zendesk account.
