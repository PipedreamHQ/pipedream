# Getting Started

## Github Triggers: Webhooks vs. Polling
The Github triggers are built in way that configures the trigger as a webhook if you are the admin of a repo, and falls back to polling if you are not the admin of a repo.

**Example: New or Updated Issue (Admin)**
The user is an administrator of the repo, and this trigger will be configured as a webhook - so any time there is a new or updated issue in the repo, an event will automatically be emitted.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1710954167/Screenshot_2024-03-20_at_9.58.01_AM_s1yych.png" width=600> 

**Example: New or Updated Issue (Non-Admin)**
The user is not an administator of the repo, and has an option to the cadence by which to poll for new or updated issues.
<img src="https://res.cloudinary.com/dpenc2lit/image/upload/v1710954167/Screenshot_2024-03-20_at_9.58.39_AM_xu5r2t.png" width=600>