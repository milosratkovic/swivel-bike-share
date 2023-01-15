#ifndef DELEGATOR_H
#define DELEGATOR_H

#include "Arduino.h"
#include "ArduinoJson.h"

// Holds data about a device's position
struct GeoTelemetry {
  // Positioning
  float latitude;
  float longitude;
  float speed_kmph;
  float heading;
  float altitude;
};

// Holds the state for the delegator
struct Delegator {
  int8_t       deviceID;      // An id that represents this device
  char         firmware[24];
  char         IMEI[16];
  GeoTelemetry geo;
  bool         GPRSEN;        // Is there an internet connection?
  bool         GPSEN;         // Is there a GPS connection?
  int8_t       RSSI;          // How strong is the internet connection?
  uint8_t      networkStatus; // Network/cellular status.
  bool         unlock;        // Whether we should be unlocking or not?
};

// Generate telemetry information for the server as JSON
void generateTelemetery(Delegator *d, StaticJsonDocument<200>& doc);

#endif
