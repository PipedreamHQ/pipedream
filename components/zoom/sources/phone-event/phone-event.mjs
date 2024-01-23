// Importing common functionality and constants
import common from "../common/common.mjs";
import constants from "../common/constants.mjs";

// Exporting the Zoom Phone Events source module
export default {
  // Spread common properties
  ...common,
  
  // Unique identifier for the source
  key: "zoom-phone-event",
  
  // Human-readable name for the source
  name: "Zoom Phone Events (Instant)",
  
  // Description of the source's functionality
  description: "Emits new Zoom Phone events tied to your Zoom user or resources you own",
  
  // Version number of the source
  version: "0.1.0",
  
  // Type of source (in this case, a "source")
  type: "source",
  
  // Properties for the source
  props: {
    // Spread common properties
    ...common.props,
    
    // Options for selecting Zoom events to listen for
    eventNameOptions: {
      type: "string[]",
     
