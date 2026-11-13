/** Transport-only types shared by the map client and our GTFS-backed API. */
export type Point = [number, number]; // [latitude, longitude], Leaflet order
export type MapRoute = {
  id: string; shortName: string; name: string; color: string; textColor: string;
  shape: Point[]; stopIds: string[]; shapeKind: 'published'|'unavailable';
};
export type MapStop = {
  id: string; name: string; lat: number; lon: number; wheelchair: 'yes'|'no'|'unknown';
  routeIds: string[];
};
export type NetworkResponse = {
  agency: 'Blacksburg Transit'; routes: MapRoute[]; stops: MapStop[];
  calendarStart: string|null; calendarEnd: string|null; feedUpdatedAt: string;
  sourceUrl: string; notice: string;
};
export type TripLeg = {
  routeId: string; routeName: string; color: string;
  fromStopId: string; toStopId: string; fromName: string; toName: string;
  departure: string; arrival: string;
  departureMinutes: number; arrivalMinutes: number;
  shape: Point[];
};
export type TripOption = {legs:TripLeg[]; transfers:number; departure:string; arrival:string; durationMin:number};
export type PlanResponse = {
  options:TripOption[]; date:string; requestedTime:string; dataStart:string|null; dataEnd:string|null;
  message:string; scheduledOnly:true;
};
