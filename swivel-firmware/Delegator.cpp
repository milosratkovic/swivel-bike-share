#include "Delegator.h"

// Generate telemetry information for the server as JSON
void generateTelemetery(Delegator *d, StaticJsonDocument<200>& doc) {
  // Prevent memory leaks from creating nested objects
  doc.clear();
  // Add the device status
  JsonObject device = doc.createNestedObject("device");
  device["id"] = d->deviceID;
  device["firmware"] = d->firmware;
  device["imei"] = d->IMEI;
  // Add the geo telemetry data
  JsonObject gps = doc.createNestedObject("gps");
  gps["longitude"] = d->geo.longitude;
  gps["latitude"] = d->geo.latitude;
  gps["speed"] = d->geo.speed_kmph;
  gps["heading"] = d->geo.heading;
  gps["altitude"] = d->geo.altitude;
  gps["enabled"] = true;
  // Add the network telemetry data
  JsonObject grps = doc.createNestedObject("grps");
  grps["rssi"] = d->RSSI;
  grps["network_status"] = d->networkStatus;
  grps["enabled"] = d->GPRSEN;

  serializeJson(doc, Serial);
  Serial.print("doc memory usage: "); Serial.println(doc.memoryUsage());
  if (doc.overflowed())  {
    Serial.println(F("error: json doc overflow"));
  }
  
  return doc;
}
