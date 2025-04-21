# 🚀 Google Indexing API – URL Submission Action

This action submits a specific URL to the **Google Indexing API** to notify Google that the content has been **updated** and should be re-crawled.

---

## ✅ Use Case

Use this action when:
- You’ve updated content on a page
- You want to request Google to reindex that URL as soon as possible

---

## 🧠 Internals

- Validates and trims the input URL  
- Uses the `URL_UPDATED` type to inform Google of a content change  
- Returns the raw API response  
- Displays a user-friendly summary  
- Accumulates and returns non-blocking warnings (e.g. unusual characters in the URL)

---

## 🔐 Auth

Requires OAuth 2.0 with this scope: https://www.googleapis.com/auth/indexing

## 🔗 Endpoint

https://indexing.googleapis.com/v3/urlNotifications:publish