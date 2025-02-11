const BOARD_KIND_OPTIONS = [
  {
    value: "public",
    label: "Public boards",
  },
  {
    value: "private",
    label: "Private boards",
  },
  {
    value: "share",
    label: "Shareable boards",
  },
];

const COLUMN_TYPE_OPTIONS = [
  {
    label: "auto_number - Number items according to their order in the group/board",
    value: "auto_number",
  },
  {
    label: "checkbox - Check off items and see what's done at a glance",
    value: "checkbox",
  },
  {
    label: "country - Choose a country",
    value: "country",
  },
  {
    label: "color_picker - Manage a design system using a color palette",
    value: "color_picker",
  },
  {
    label: "creation_log - Add the item's creator and creation date automatically",
    value: "creation_log",
  },
  {
    label: "date - Add dates like deadlines to ensure you never drop the ball",
    value: "date",
  },
  {
    label: "dependency - Set up dependencies between items in the board",
    value: "dependency",
  },
  {
    label: "dropdown - Create a dropdown list of options",
    value: "dropdown",
  },
  {
    label: "email - Email team members and clients directly from your board",
    value: "email",
  },
  {
    label: "file - Add files & docs to your item",
    value: "file",
  },
  {
    label: "hour - Add times to manage and schedule tasks, shifts and more",
    value: "hour",
  },
  {
    label: "item_id - Show a unique ID for each item",
    value: "item_id",
  },
  {
    label: "last_updated - Add the person that last updated the item and the date",
    value: "last_updated",
  },
  {
    label: "link - Simply hyperlink to any website",
    value: "link",
  },
  {
    label: "location - Place multiple locations on a geographic map",
    value: "location",
  },
  {
    label: "long_text - Add large amounts of text without changing column width",
    value: "long_text",
  },
  {
    label: "numbers - Add revenue, costs, time estimations and more",
    value: "numbers",
  },
  {
    label: "people - Assign people to improve team work",
    value: "people",
  },
  {
    label: "phone - Call your contacts directly from monday.com",
    value: "phone",
  },
  {
    label: "progress - Show progress by combining status columns in a battery",
    value: "progress",
  },
  {
    label: "rating - Rate or rank anything visually",
    value: "rating",
  },
  {
    label: "status - Get an instant overview of where things stand",
    value: "status",
  },
  {
    label: "team - Assign a full team to an item",
    value: "team",
  },
  {
    label: "tags - Add tags to categorize items across multiple boards",
    value: "tags",
  },
  {
    label: "text - Add textual information e.g. addresses, names or keywords",
    value: "text",
  },
  {
    label: "timeline - Visually see a breakdown of your team's workload by time",
    value: "timeline",
  },
  {
    label: "time_tracking - Easily track time spent on each item, group, and board",
    value: "time_tracking",
  },
  {
    label: "vote - Vote on an item e.g. pick a new feature or a favorite lunch place",
    value: "vote",
  },
  {
    label: "week - Select the week on which each item should be completed",
    value: "week",
  },
  {
    label: "world_clock - Keep track of the time anywhere in the world",
    value: "world_clock",
  },
];

const BOARD_TYPE = {
  BOARD: "board",
  SUB_ITEMS_BOARD: "sub_items_board",
};

const STATUS_OPTIONS = [
  {
    label: "Grey",
    value: "5",
  },
  {
    label: "Orange",
    value: "0",
  },
  {
    label: "Green Shadow",
    value: "1",
  },
  {
    label: "Red Shadow",
    value: "2",
  },
  {
    label: "Blue Links",
    value: "3",
  },
  {
    label: "Purple",
    value: "4",
  },
  {
    label: "Grass Green",
    value: "6",
  },
  {
    label: "Bright Blue",
    value: "7",
  },
  {
    label: "Mustered",
    value: "8",
  },
  {
    label: "Yellow",
    value: "9",
  },
  {
    label: "Soft Black",
    value: "10",
  },
  {
    label: "Dark Red",
    value: "11",
  },
  {
    label: "Dark Pink",
    value: "12",
  },
  {
    label: "Light Pink",
    value: "13",
  },
  {
    label: "Dark Purple",
    value: "14",
  },
  {
    label: "Lime Green",
    value: "15",
  },
  {
    label: "Turquoise",
    value: "16",
  },
  {
    label: "Trolley Grey",
    value: "17",
  },
  {
    label: "Brown",
    value: "18",
  },
  {
    label: "Dark Orange",
    value: "19",
  },
  {
    label: "Sunset",
    value: "101",
  },
  {
    label: "Bubble",
    value: "102",
  },
  {
    label: "Peach",
    value: "103",
  },
  {
    label: "Berry",
    value: "104",
  },
  {
    label: "Winter",
    value: "105",
  },
  {
    label: "River",
    value: "106",
  },
  {
    label: "Navy",
    value: "107",
  },
  {
    label: "Australia",
    value: "108",
  },
  {
    label: "Indigo",
    value: "109",
  },
  {
    label: "Dark Indigo",
    value: "110",
  },
  {
    label: "Pecan",
    value: "151",
  },
  {
    label: "Light Magic",
    value: "152",
  },
  {
    label: "Sky",
    value: "153",
  },
  {
    label: "Cold Blue",
    value: "154",
  },
  {
    label: "Kids",
    value: "155",
  },
  {
    label: "Purple Gray",
    value: "156",
  },
  {
    label: "Corona",
    value: "157",
  },
  {
    label: "Sail",
    value: "158",
  },
  {
    label: "Old Rose",
    value: "159",
  },
  {
    label: "Eden",
    value: "160",
  },
];

export default {
  BOARD_KIND_OPTIONS,
  COLUMN_TYPE_OPTIONS,
  BOARD_TYPE,
  STATUS_OPTIONS,
};
