# Overview

The Screvi API gives you access to your reading library: the highlights you have saved from books, articles, newsletters, podcasts and PDFs, along with the articles in your reading list and the tags you organise them with. Search runs on meaning as well as keywords, so a workflow can ask for "passages about deliberate practice" and get back highlights that never use those words. With Pipedream you can pipe new highlights into the tools where you actually think, save links from anywhere into your reading list, and triage what you have read without opening the app.

# Example Use Cases

- **Publish New Highlights to a Notion Reading Log**: Watch for new highlights in Screvi and append each one to a Notion database, grouped by book or article. Every entry keeps the source, your note and a link back to the highlight, so the log stays browsable months later.

- **Save Links from Slack to Your Reading List**: Trigger on a Slack message containing a URL and save it to Screvi with the channel name as a tag. Screvi fetches and parses the page in the background, so the full text is waiting in your inbox rather than a bare bookmark.

- **Weekly Digest of What You Highlighted**: On a schedule, search your Screvi highlights from the last seven days, pass them to an LLM to draft a short summary, and email it to yourself. A recap of what you read beats a folder you never reopen.

- **Auto-Archive Articles Once You Have Read Them**: List the articles sitting in your inbox, check them against a source of truth such as a spreadsheet or a calendar of reading sessions, and use Update Article to move the finished ones into the archive and tag the ones worth revisiting.
