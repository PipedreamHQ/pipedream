const SHARED_CART = "the integration user's cart (one cart shared by every session of this integration user, so concurrent sessions can add, remove, or submit each other's items)";

export const DESCRIPTION_REWRITES = [
  [
    "the current user's ServiceNow cart",
    SHARED_CART,
  ],
  [
    "the current user's cart",
    SHARED_CART,
  ],
  [
    "added to the user's default cart",
    `added to ${SHARED_CART}`,
  ],
  [
    "already filtered by ServiceNow for the signed-in user",
    "already filtered by ServiceNow for the integration user, which can differ from what the person you act for would see",
  ],
  [
    "Script defaults such as the current user are resolved into `value`",
    "Script defaults are resolved into `value` as the integration user, so a current-user default is the integration user, not the person you act for (replace it with their `sys_id` from **Find Users**)",
  ],
  [
    "usually requires a catalog admin role, so most signed-in employees get a 403 here",
    "requires the integration user's roles and ACLs to grant read access to `question_choice` (a ServiceNow admin must configure this), otherwise it returns 403",
  ],
];

export const DOCUMENTATION_LINK = " [See the documentation";
