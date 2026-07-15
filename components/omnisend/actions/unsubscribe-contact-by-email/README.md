# Overview

Use this action to unsubscribe an existing Omnisend contact from the email channel by their full email address. The action looks up the contact before updating it and does not create a new contact when the email address is not found.

# Getting Started

Connect your Omnisend account and enter the contact's full email address. The action finds the matching contact and changes that contact's email-channel status to `unsubscribed`.

# Troubleshooting

## Contact not found

Confirm that the email address already belongs to a contact in the connected Omnisend account. This action intentionally returns an error instead of creating a new contact.
