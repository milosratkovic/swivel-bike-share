#ifndef CONNECTIVITY_H
#define CONNECTIVITY_H

#include "Connectivity.h"

// Establishes software serial with the SIM7000
uint8_t connectGPRSModuleSerial(Adafruit_FONA_LTE *fona, SoftwareSerial *serial, uint8_t retries) {
  pinMode(FONA_RST, OUTPUT);
  digitalWrite(FONA_RST, HIGH); // Default state (device reset)
  pinMode(FONA_PWRKEY, OUTPUT);
  // Turn on the module by pulsing PWRKEY low for a little bit
  // This amount of time depends on the specific module that's used
  fona->powerOn(FONA_PWRKEY); // Power on the module

  Serial.begin(9600);
  Serial.println(F("SIM7000A FONA basic test"));
  Serial.println(F("initializing....(May take several seconds)"));
  
  serial->begin(115200); // Default SIM7000 shield baud rate

  Serial.println(F("configuring to 9600 baud"));
  serial->println("AT+IPR=9600"); // Set baud rate
  delay(100); // Short pause to let the command run
  serial->begin(9600);
  
  uint8_t attempt = 1;
  if (!fona->begin(*serial)) {
    if (attempt >= retries) {
      return CONN_NO_MODEM;
    }
    Serial.println(F("could not find modem"));
    attempt++;
  }

  return CONN_OK;
}

// Configure the GRPS module for initial use
uint8_t setupGPRSModule(Adafruit_FONA_LTE *fona) {
  // Make the modem fully functional
  if (!fona->setFunctionality(1)) {
    return CONN_INVALID_MODEM_MODE;
  }

  fona->setNetworkSettings(F(NETWORK_APN));

  return CONN_OK;
}

// Configure the GPS module for initial use
uint8_t setupGPSModem(Adafruit_FONA_LTE *fona) {
  // We're interested in enabling hot start (best-effort approach)
  fona->sendCheckReply(F("AT+CGNSHOT"), AT_OK);

  return CONN_OK;
}

// Connect to the network
uint8_t connectGPRS(Adafruit_FONA_LTE *fona) {
  fona->enableGPRS(true);
  if (!fona->wirelessConnStatus()) {
    while (!fona->openWirelessConnection(true)) {
      delay(2000);
    }
  }

  // Let the connection establish itself
  delay(100);
  
  if (!fona->wirelessConnStatus()) {
    return CONN_GPRS_CONN_FAILURE;
  }
  return CONN_OK;
}

// Disconnect from the network
uint8_t disconnectGPRS(Adafruit_FONA_LTE *fona) {
  if (!fona->enableGPRS(false)) {
    return CONN_GPRS_CONN_FAILURE;
  }
  return CONN_OK;
}

// Start a GPS connection
uint8_t connectGPS(Adafruit_FONA_LTE *fona) {
  if (!fona->enableGPS(true)) {
    return CONN_GPS_CONN_FAILURE;
  }
  return CONN_OK;
}

// Get the signal strength
int8_t getRSSI(Adafruit_FONA_LTE *fona) {
  uint8_t n = fona->getRSSI();
  int8_t r;
  if (n == 0) r = -115;
  if (n == 1) r = -111;
  if (n == 31) r = -52;
  if ((n >= 2) && (n <= 30)) {
    r = map(n, 2, 30, -110, -54);
  }
  return r;
}

// Get the network/cellular status
int8_t getNetworkStatus(Adafruit_FONA_LTE *fona) {
   uint8_t n = fona->getNetworkStatus();
   return n;
}

// Get the friendly name for the network status
FONAFlashStringPtr networkStatusFriendlyName(int8_t s) {
  switch(s) {
    case NET_NOT_REGISTERED:
      return F("Not registered");
    case NET_REGISTERED_HOME:
      return F("Registered (home)");
    case NET_SEARCHING:
      return F("Not registered (searching)");
    case NET_DENIED:
      return F("Denied");
    case NET_ROAMING:
      return F("Registered roaming");
    default:
      return F("Unknown");
  }
}

// Enable GPS
uint8_t enableGPS(Adafruit_FONA_LTE *fona) {
  if (!fona->enableGPS(true)) {
    return CONN_GPRS_CONN_FAILURE;
  }
  return CONN_OK;
}

// Disable GPS
uint8_t disableGPS(Adafruit_FONA_LTE *fona) {
  if (!fona->enableGPS(false)) {
    return CONN_GPRS_CONN_FAILURE;
  }
  return CONN_OK;
}

// Get the status of the GPS connection
int8_t getGPSStatus(Adafruit_FONA_LTE *fona) {
  int8_t stat = fona->GPSstatus();
  return stat;
}

// Get the friendly name for the GPS status
FONAFlashStringPtr GPSStatusFriendlyName(int8_t s) {
  switch(s) {
    case GPS_STATE_OFF:
      return F("GPS off");
    case GPS_STATE_FIX_NONE:
      return F("No fix");
    case GPS_STATE_FIX_2D:
      return F("2D");
    case GPS_STATE_FIX_3D:
      return F("3D");
    default:
      return F("error");
  }
}

// Make a POST request
void requestHTTPPOST(Adafruit_FONA_LTE *fona, const char *URL, StaticJsonDocument<200>& doc, size_t bodySize, uint16_t *status, uint16_t *datalen, uint16_t timeout) {
  fona->flush();
  fona->readline(500);
  // Make sure HTTP service is terminated so initialization will run
  fona->sendCheckReply(F("AT+HTTPTERM"), AT_OK, 10000);
  if (!fona->sendCheckReply(F("AT+HTTPINIT"), AT_OK, 10000)) {
    Serial.println(F("error: cannot initialize HTTP request"));
    return;
  }
  if (!fona->sendCheckReply(F("AT+HTTPPARA=\"CID\",1"), AT_OK, 10000)) {
    Serial.println(F("error: setting HTTP parameters"));
    return;
  }

  // Setup the URL
  char urlBuff[strlen(URL) + 22];
  sprintf(urlBuff, "AT+HTTPPARA=\"URL\",\"%s\"", URL);
  if (!fona->sendCheckReply(urlBuff, AT_OK, 10000)) {
    Serial.println(F("error: failed setting URL"));
    return;
  }

  // Setup the content headers
  if (!fona->sendCheckReply(F("AT+HTTPPARA=\"CONTENT\",\"application/json\""), AT_OK, 10000))
    return;

  // Tell the module the size of the request we're about to stream
  size_t bsize = measureJson(doc);
  char dataBuff[sizeof(bsize) + 20];
  sprintf(dataBuff, "AT+HTTPDATA=%lu,9900", (long unsigned int)bsize);
  if (!fona->sendCheckReply(dataBuff, "DOWNLOAD", 10000))
      return;

  // For faster baudrates, let the module init
  delay(100);
  
  // Start streaming the body, and make the POST request
  serializeJson(doc, Serial);
  serializeJson(doc, *fona);
  if (!fona->expectReply(AT_OK, 10000))
      return;
  if (!fona->sendCheckReply(F("AT+HTTPACTION=1"), AT_OK, 10000))
      return;

  fona->readline(10000);
  // Read back the response meta-data
  if (!fona->parseReply(F("+HTTPACTION:"), status, ',', 1)) {
    Serial.println(F("error: failed parsing request status"));
    return;
  }
  if (!fona->parseReply(F("+HTTPACTION:"), datalen, ',', 2)) {
    Serial.println(F("error: failed parsing request data length"));
    return false;
  }

  fona->getReply(F("AT+HTTPREAD"));
  fona->readline(10000);
  // DEBUG_PRINTLN(fona->replybuffer);
  
  fona->sendCheckReply(F("AT+HTTPTERM"), AT_OK, 10000);
}

// Make a GET request
void requestHTTPGET(Adafruit_FONA_LTE *fona, const char *URL, StaticJsonDocument<200>& doc, uint16_t *status, uint16_t *datalen, uint16_t timeout) {
  // Make sure HTTP service is terminated so initialization will run
  fona->sendCheckReply(F("AT+HTTPTERM"), AT_OK, 10000);
  if (!fona->sendCheckReply(F("AT+HTTPINIT"), AT_OK, 10000)) {
    Serial.println(F("error: cannot initialize HTTP request"));
    return;
  }
  if (!fona->sendCheckReply(F("AT+HTTPPARA=\"CID\",1"), AT_OK, 10000)) {
    Serial.println(F("error: setting HTTP parameters"));
    return;
  }

  // Setup the URL
  char urlBuff[strlen(URL) + 22];
  sprintf(urlBuff, "AT+HTTPPARA=\"URL\",\"%s\"", URL);
  if (!fona->sendCheckReply(urlBuff, AT_OK, 10000)) {
    Serial.println(F("error: failed setting URL"));
    return;
  }

  if (!fona->sendCheckReply(F("AT+HTTPACTION=0"), AT_OK, 10000))
      return;
  fona->readline(10000);
  
  // Read back the response meta-data
  if (!fona->parseReply(F("+HTTPACTION:"), status, ',', 1)) {
    Serial.println(F("error: failed parsing request status"));
    return;
  }
  if (!fona->parseReply(F("+HTTPACTION:"), datalen, ',', 2)) {
    Serial.println(F("error: failed parsing request data length"));
    return false;
  }

  fona->getReply(F("AT+HTTPREAD"));
  fona->readline(10000);
  DEBUG_PRINTLN(fona->replybuffer);
  
  //Serial.println(doc["data"][0].as<const char*>());
}

void HTTPEnd(Adafruit_FONA_LTE *fona) {
   fona->sendCheckReply(F("AT+HTTPTERM"), AT_OK, 10000);
}

#endif
