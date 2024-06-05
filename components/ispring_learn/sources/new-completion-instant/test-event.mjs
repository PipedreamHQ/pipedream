export default {
	type: "COURSE_COMPLETED_SUCCESSFULLY",
	payloads: [
    {
      courseId: "<string uuid>",
      learnerId: "string uuid>",
      enrollmentIds: [
        "<string uuid>",
        "<string uuid>"
      ],
      completionDate: "<int nanoseconds>"
    },
    {
      courseId: "<string uuid>",
      learnerId: "string uuid>",
      enrollmentIds: [
        "<string uuid>",
        "<string uuid>"
      ],
      completionDate: "<int nanoseconds>"
    }
  ]
}