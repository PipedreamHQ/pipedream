# Overview

The Tutor LMS API provides hooks into the Tutor LMS ecosystem, enabling you to automate actions and manage data around courses, lessons, quizzes, and results within the learning management system. With Pipedream, you can build workflows that react to events in Tutor LMS, such as new course enrollments, or that push data to Tutor LMS to create or update resources. Utilizing Pipedream's ability to connect to multiple services, you can synchronize Tutor LMS data with other apps, trigger notifications, and streamline administrative tasks.

# Example Use Cases

- **Course Enrollment Notifications**: Trigger a workflow whenever a new student enrolls in a course. This workflow could send an email via SendGrid to the course instructor with the student's information and enrollment details.

- **Synchronize Course Data with Google Sheets**: Keep a Google Sheets spreadsheet updated with the latest course information. Whenever a course is added or updated in Tutor LMS, a Pipedream workflow can automatically push the changes to a dedicated Google Sheets document, ensuring easy access to up-to-date course listings.

- **Automated Certificate Generation**: When a student completes a course, trigger a workflow to generate a certificate using a service like DocuSign or Adobe Sign. The signed certificate can then be emailed directly to the student or uploaded to their profile in Tutor LMS.
