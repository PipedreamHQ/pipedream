# Overview

The Conversion Tools API allows for seamless file conversions between various formats, including document, image, audio, and video transformation. In Pipedream, you can use the API to automate such conversions within workflows, and handle file manipulation tasks efficiently, integrating them with hundreds of other services to create a smooth data processing pipeline.

# Example Use Cases

- **Automated Image Format Conversion**: Convert uploaded images from PNG to JPEG automatically whenever a file is dropped into a Dropbox folder. Use Dropbox's trigger to start the workflow, and then pass the file through Conversion Tools before saving the converted image back to Dropbox or another storage service like Google Drive.

- **Document Translation Workflow**: Create a workflow where a PDF document is first converted to a Word file using Conversion Tools, then use a language translation API (like Google Translate) to convert the text to another language, and finally convert the translated Word document back to PDF.

- **Audio Transcription Pipeline**: Transcribe audio files uploaded to a service like Box by first converting them from various formats to a uniform format (e.g., WAV to MP3) with Conversion Tools. Then, send the converted audio file to a transcription service like Google Speech-to-Text for processing, and save the transcribed text to a database or send it via email.
