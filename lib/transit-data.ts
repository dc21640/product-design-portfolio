/**
 * TransitFlow design-demo route directory.
 * Corridors and route names are based on Blacksburg Transit's published 2026 service descriptions.
 * Waypoints are a simplified editorial schematic, NOT a sequence of verified individual bus-stop IDs.
 * This is intentionally not a GTFS itinerary engine or real-time arrival service.
 * Source: https://ridebt.org/schedules
 */
export type ServiceWindow = "weekday" | "later";
export type OriginId = "stroubles" | "talloaks" | "crc" | "oaklane" | "university" | "northmain";
export type JourneyRoute = {
  id: string;
  code: string;
  name: string;
  service: ServiceWindow[];
  origin: OriginId;
  to: string;
  loop: "Orange Loop" | "Maroon Loop";
  via: string[];
  journey: string[];
  note: string;
  color: string;
};
export const origins: { id: OriginId; label: string; subtitle: string }[] = [
  { id: "stroubles", label: "Stroubles Circle", subtitle: "Hethwood neighborhood" },
  { id: "talloaks", label: "Tall Oaks Drive", subtitle: "Hethwood neighborhood" },
  { id: "crc", label: "Corporate Research Center", subtitle: "Pratt Drive area" },
  { id: "oaklane", label: "Oak Lane", subtitle: "Virginia Tech campus" },
  { id: "university", label: "University City Boulevard", subtitle: "North Blacksburg" },
  { id: "northmain", label: "North Main Street", subtitle: "Red Maple Drive area" },
];
export const journeys: JourneyRoute[] = [
  { id:"hwa", code:"HWA", name:"Hethwood A", origin:"stroubles", service:["weekday"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["Stroubles Circle","Hethwood Boulevard","Prices Fork Road","Transit Center · Orange Loop"], journey:["Start in the Stroubles Circle area.","Board HWA toward the Virginia Tech Transit Center.","Ride along the Hethwood / Prices Fork corridor.","Alight at the Orange Loop at the Transit Center."], note:"BT lists HWA during full-service weekday mornings, until 12:15 p.m. Verify the current schedule before traveling.", color:"#e8a047" },
  { id:"hwc-stroubles", code:"HWC", name:"Hethwood Combined", origin:"stroubles", service:["later"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["Stroubles Circle","Hethwood Boulevard","Prices Fork Road","Transit Center · Orange Loop"], journey:["Start at Stroubles Circle.","Use the combined Hethwood route during its published service periods.","Continue along the Hethwood / Prices Fork corridor.","Exit at the Transit Center Orange Loop."], note:"BT lists HWC after 12:15 p.m. and on weekends; check which service pattern applies to your trip.", color:"#8157c4" },
  { id:"hwb", code:"HWB", name:"Hethwood B", origin:"talloaks", service:["weekday"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["Tall Oaks Drive","Hethwood Boulevard","Prices Fork Road","Transit Center · Orange Loop"], journey:["Start along Tall Oaks Drive.","Board HWB toward the Virginia Tech Transit Center.","Travel along the Hethwood / Prices Fork corridor.","Exit at the Transit Center Orange Loop."], note:"BT lists HWB as a daytime Hethwood service. Check the published timetable for the exact operating window.", color:"#e8a047" },
  { id:"hwc-talloaks", code:"HWC", name:"Hethwood Combined", origin:"talloaks", service:["later"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["Tall Oaks Drive","Hethwood Boulevard","Prices Fork Road","Transit Center · Orange Loop"], journey:["Start along Tall Oaks Drive.","Board HWC during its published afternoon, evening, or weekend service.","Continue along the Hethwood / Prices Fork corridor.","Exit at the Transit Center Orange Loop."], note:"HWC combines the Hethwood corridors during later service periods. Confirm service on the day of travel.", color:"#8157c4" },
  { id:"crc", code:"CRC", name:"Corporate Research Center", origin:"crc", service:["weekday"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["Pratt Drive","Kraft Drive / Research Center Drive","Industrial Park Road","Transit Center · Orange Loop"], journey:["Start at the Corporate Research Center near Pratt Drive.","Board a CRC shuttle headed toward campus when the route is operating.","Travel from the research park toward the Transit Center.","Exit at the Orange Loop."], note:"Corridor shown from BT's published CRC description. Service frequency and operating days vary; check the timetable.", color:"#177c79" },
  { id:"hxp", code:"HXP", name:"Hokie Express", origin:"oaklane", service:["weekday"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["Oak Lane","Duck Pond Drive","West Campus Drive","Transit Center · Orange Loop"], journey:["Start in the Oak Lane area.","Board HXP toward the Orange Loop when the route is operating.","Travel by Duck Pond Drive and West Campus Drive.","Exit at the Transit Center Orange Loop."], note:"HXP is a campus route; service availability varies by time and day.", color:"#398f87" },
  { id:"hxs", code:"HXS", name:"Hokie Express Stanger", origin:"oaklane", service:["later"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["Oak Lane","Duck Pond Drive","West Campus Drive / Stanger Street","Transit Center · Orange Loop"], journey:["Start in the Oak Lane area.","Use HXS during evening or weekend service when available.","Travel by Duck Pond Drive, West Campus Drive and Stanger Street.","Exit at the Transit Center."], note:"BT lists HXS beginning at 9:30 p.m. on weekdays and operating on weekends.", color:"#398f87" },
  { id:"ucb", code:"UCB", name:"University City Boulevard", origin:"university", service:["weekday"], to:"Virginia Tech Transit Center", loop:"Orange Loop", via:["University City Boulevard","Patrick Henry Drive","Progress Street","Transit Center · Orange Loop"], journey:["Start along University City Boulevard.","Board UCB toward the Virginia Tech Transit Center when in service.","Travel via Patrick Henry Drive and Progress Street.","Exit at the Orange Loop."], note:"Published UCB corridor; check BT for operating days, stop locations and departure times.", color:"#4f76c8" },
  { id:"nmg", code:"NMG", name:"North Main Givens", origin:"northmain", service:["weekday"], to:"Virginia Tech Transit Center", loop:"Maroon Loop", via:["Red Maple Drive area","Givens Lane / Whipple Drive","North Main Street","Transit Center · Maroon Loop"], journey:["Start near North Main Street / Red Maple Drive.","Use the North Main Givens service when operating.","Travel along North Main Street toward campus.","Exit at the Maroon Loop at the Transit Center."], note:"NMG serves the North Main corridor to the Maroon Loop. Check the service calendar and stop details.", color:"#ca6751" },
];
