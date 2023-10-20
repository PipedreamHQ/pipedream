export const clearObj = (obj) => {
  return Object.entries(obj)
    .filter(([
      _,
      v,
    ]) => (v != null && v != ""))
    .reduce((acc, [
      k,
      v,
    ]) => ({
      ...acc,
      [k]: (!Array.isArray(v) && v === Object(v))
        ? clearObj(v)
        : v,
    }), {});
};

export const prepareData = ({
  recipientName,
  recipientPhone,
  recipientNotes,
  street,
  apartment,
  city,
  state,
  postalCode,
  country,
  latitude,
  longitude,
  signatureRequirement,
  photoRequirement,
  notesRequirement,
  minimumAgeRequirement,
  autoAssign,
  team,
  worker,
  ...data
}) => {
  data.destination = {
    address: {
      unparsed: `${street} ${apartment} ${city} ${state} ${country} ${postalCode}`,
    },
  };
  if (latitude && longitude) {
    data.destination.location = [
      latitude,
      longitude,
    ];
  }

  data.recipients = [
    {
      name: recipientName,
      phone: recipientPhone,
      notes: recipientNotes,
    },
  ];

  data.requirements = {
    signature: signatureRequirement,
    photo: photoRequirement,
    notes: notesRequirement,
    minimumAge: minimumAgeRequirement,
  };

  if (autoAssign === "driver") {
    data.container = {
      type: "WORKER",
      worker,
    };
  }
  if (autoAssign === "team") {
    data.container = {
      type: "TEAM",
      team,
    };
  }
  return data;
};
