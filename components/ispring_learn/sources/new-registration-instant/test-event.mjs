export default {
	type: "USER_REGISTERED",
	payloads: [
    {
      userId: "<string uuid>",
      departmentId: "<string uuid>",
      login: "<string>"|null,
      email: "<string>"|null
    },
    {
      userId: "<string uuid>",
      departmentId: "<string uuid>",
      login: "<string>"|null,
      email: "<string>"|null
    }
  ]
}