# Overview

ConvertAPI is a powerhouse for online file conversion, enabling you to transform files from one format to another effortlessly. It supports a plethora of file types, from common ones like PDFs and DOCs to more obscure formats. With ConvertAPI on Pipedream, you can automate file conversion tasks, seamlessly integrating them into workflows that trigger on events from other apps or schedules. Imagine converting incoming email attachments, processing uploaded documents, or archiving files in a different format—all happening automatically, in the background.

# Example Use Cases

- **Automated Document Conversion for Email Attachments**: Whenever you receive an email with an attachment in Gmail, Pipedream can catch this event, send the file to ConvertAPI to change it to your preferred format (e.g., DOCX to PDF), and then save the converted file to Google Drive.

- **Batch Image Conversion for Cloud Storage**: Set up a Pipedream workflow that monitors a Dropbox folder for new images. When new images are detected, the workflow uses ConvertAPI to convert them to a different format (say, PNG to JPG) and then stores the converted images back in Dropbox or another storage service like AWS S3.

- **Website Screenshot to PDF Archival**: Trigger a Pipedream workflow with a cron schedule to take a screenshot of a webpage using ConvertAPI's 'Web to PDF' function. The PDF can then be timestamped and saved to a data store or cloud service for record-keeping or later reference.
