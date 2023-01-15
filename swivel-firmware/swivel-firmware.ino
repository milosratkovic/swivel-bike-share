#include "Adafruit_FONA.h"
#include "SwivelConfig.h"
#include "Connectivity.h"
#include <SoftwareSerial.h>
#include "ArduinoJson.h"
#include "Delegator.h"

#ifdef __arm__
// should use uinstd.h to define sbrk but Due causes a conflict
extern "C" char* sbrk(int incr);
#else  // __ARM__
extern char *__brkval;
#endif  // __arm__

int freeMemory() {
  char top;
#ifdef __arm__
  return &top - reinterpret_cast<char*>(sbrk(0));
#elif defined(CORE_TEENSY) || (ARDUINO > 103 && ARDUINO != 151)
  return &top - __brkval;
#else  // __arm__
  return __brkval ? &top - __brkval : &top - __malloc_heap_start;
#endif  // __arm__
}

void __panic__ (const char *str);

// Comm port for module (software serial)
// SoftwareSerial fonaSS = SoftwareSerial(FONA_TX, FONA_RX);
SoftwareSerial fonaSS = SoftwareSerial(FONA_TX, FONA_RX, false);
// Low-level library for interfacing with the module
Adafruit_FONA_LTE fona = Adafruit_FONA_LTE();
// An instance of the delegator being controlled
Delegator delegator;

StaticJsonDocument<200> doc;

uint8_t res;

void setup() {
  // Setup the I/O ports
  pinMode(PIN_SOLENOID, OUTPUT);
  
  // Connect to the modem using software-serial
  // TODO: We eventually want to move to hardware serial
  res = connectGPRSModuleSerial(&fona, &fonaSS, 5);
  if (res != CONN_OK) {
    __panic__("failed connecting to modem on boot");
  }

  // Initialize the module with the bare minimum settings for it to function. Any failures
  // in this step will cause a panic as we need these settings for operation.
  res = setupGPRSModule(&fona);
  if (res != CONN_OK) {
    __panic__("failed configuring modem on boot");
  }

  // Initialize the GPS module (best-effort) approach
  res = setupGPSModem(&fona);

  delegator.RSSI = getRSSI(&fona);
  delegator.networkStatus = getNetworkStatus(&fona);

  delegator.GPRSEN = false;
  delegator.GPSEN = getGPSStatus(&fona) != GPS_STATE_OFF;
  delegator.deviceID = 1;
  delegator.unlock = false;
}

void loop() {
  // Our device needs to be connected to the network to receieve instructions for how to operate.
  // Our primary goal is to make sure we're connected.
  if (delegator.GPRSEN) {
    Serial.println(F(""));
    Serial.println(F("updating telemetry (GPRS) ..."));
    
    // Update information about the device connection
    delegator.RSSI = getRSSI(&fona);
    delegator.networkStatus = getNetworkStatus(&fona);

    Serial.print(F("RSSI: ")); Serial.print(delegator.RSSI); Serial.println(" dBm");
    Serial.print(F("Network: ")); Serial.println(networkStatusFriendlyName(delegator.networkStatus));
    Serial.println("");

    // If we are not connected at this point, we need to re-adjust state.
    if(delegator.networkStatus != NET_REGISTERED_HOME) {
      delegator.GPRSEN = false;
      // We really don't want to be on roaming connections, this gets expensive.
      if (delegator.networkStatus == NET_ROAMING) {
        Serial.println(F("device was ROAMING, dropping NET"));
        res = disconnectGPRS(&fona);
        if (res != CONN_OK) {
          Serial.println(F("err: failed to drop ROAMING NET"));
        }
        return;
      }
    }
  } else {
    Serial.println(F("network offline, attempting to reconnect"));
    // Try to connect
    res = connectGPRS(&fona);

    // Update the RSSI on the device right away
    delegator.RSSI = getRSSI(&fona);
    
    if (res != CONN_OK) {
      Serial.println(F("failed connecting to network"));
      delay(DELAY_GPRS_CONN_ATTEMPT);
      return;
    }
    delegator.GPRSEN = true;
  }

  Serial.println(F(""));
  Serial.println(F("gathering accelerometer telemetry ..."));
  // Read and report the accelerometer readings
  int x = analogRead(PIN_ACC_X);
  int y = analogRead(PIN_ACC_Y);
  int z = analogRead(PIN_ACC_Z);
  Serial.print(F("x: ")); Serial.println(x);
  Serial.print(F("y: ")); Serial.println(y);
  Serial.print(F("z: ")); Serial.println(z);
  Serial.println(F(""));

  // Our device needs to send back geolocation data, we need to make sure GPS is enabled
  // This however is not as important as an internet connection, so we continue even
  // when failures are encountered.
  if (delegator.GPSEN) {
    Serial.println(F(""));
    Serial.println(F("updating telemetry (GPRS) ..."));

    if(fona.getGPS(
      &delegator.geo.latitude,
      &delegator.geo.longitude,
      &delegator.geo.speed_kmph,
      &delegator.geo.heading,
      &delegator.geo.altitude
    )) {
      Serial.print(F("Latitude: ")); Serial.println(delegator.geo.latitude, 6);
      Serial.print(F("Longitude: ")); Serial.println(delegator.geo.longitude, 6);
      Serial.print(F("Speed: ")); Serial.println(delegator.geo.speed_kmph);
      Serial.print(F("Heading: ")); Serial.println(delegator.geo.heading);
      Serial.print(F("Altitude: ")); Serial.println(delegator.geo.altitude);
    } else if (getGPSStatus(&fona) == GPS_STATE_OFF) {
      delegator.GPSEN = false;
    } else {
      Serial.println(F("telemetry not ready"));
    }
    
    Serial.println(F(""));
  } else {
    if (getGPSStatus(&fona) == GPS_STATE_OFF) {
      delegator.GPSEN = false;
      Serial.println(F("GPS offline, attempting to reconnect"));
      if (enableGPS(&fona)) {
        delegator.GPSEN = true;
      } else {
        Serial.println(F("failed enabling GPS"));
      }
    } else {
      delegator.GPSEN = true;
    }
  }

  // If data is available post telemetry
  if (delegator.GPRSEN) {
    Serial.println(F(""));
    Serial.println(F("sending telemetry to server ..."));

    Serial.print(F("freeMem: ")); Serial.println(freeMemory());
    uint16_t status, datalen;
    generateTelemetery(&delegator, doc);
    requestHTTPPOST(&fona, "iot.swivel.bike/telemetry/1\0", doc, measureJson(doc), &status, &datalen, 10000);
    Serial.print(F("freeMem: ")); Serial.println(freeMemory());
    
    Serial.println(F(""));
    // Extra delay here
    delay(5000);
  }

  // Get any actions we need to take
  if (delegator.GPRSEN) {
    Serial.println(F(""));
    Serial.println(F("reading instructions from server ..."));

    uint16_t status, datalen;
    requestHTTPGET(&fona, "iot.swivel.bike/control/1\0", doc, &status, &datalen, 10000);
    // Parse the response
    doc.clear();
    deserializeJson(doc, fona.replybuffer);
    char *action = doc["data"][0].as<const char*>();
    HTTPEnd(&fona);
    
    // Serial.print(F("message: "));
    //Serial.println();
    // serializeJson((JsonDocument&)doc, Serial);
    Serial.println(action);
    if (strcmp(action, "UNLOCK\0") == 0) {
      Serial.println(F("action: unlock the device "));
      // We need to unlock the delegator
      if (!delegator.unlock) {
         // Set that we don't need to unlock it anymore until later
         delegator.unlock = true;

         // Enter low power mode to provide more current to the solenoid

         // Actuate the solenoid
         digitalWrite(PIN_SOLENOID, HIGH);
         Serial.println(F("unlocked. "));
         delay(5000);
         digitalWrite(PIN_SOLENOID, LOW);
         Serial.println(F("locked. "));

         // Now update that server that we completed this action
         doc.clear();
         JsonArray actions = doc.createNestedArray("actions");
         actions.add("UNLOCK");

         requestHTTPPOST(&fona, "iot.swivel.bike/control/complete/1\0", doc, measureJson(doc), &status, &datalen, 10000);
         Serial.println(F("updating server with completion status "));

         // Try to unlock it
         delegator.unlock = false;
      }
    }

    Serial.println(F(""));
    delay(5000);
  }

  // Sleep between succesfully attempts of processing data
  delay(10000);
}

// TODO: Handle recovering from serious failures. For now we endlessly loop.
void __panic__(const char *str) {
   Serial.println(F("__panic__, caused by:"));
   Serial.println(*str);
   while (1);
}
