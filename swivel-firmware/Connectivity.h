#include "Adafruit_FONA.h"
#include <SoftwareSerial.h>
#include "SwivelConfig.h"
#include "ArduinoJson.h"

#define CONN_OK                      0
#define CONN_NO_MODEM                1
#define CONN_INVALID_NETWORK_SETTING 2
#define CONN_INVALID_MODEM_MODE      3
#define CONN_GPRS_CONN_FAILURE       4
#define CONN_GPS_CONN_FAILURE        5

#define NET_NOT_REGISTERED           0
#define NET_REGISTERED_HOME          1
#define NET_SEARCHING                2
#define NET_DENIED                   3
#define NET_UNKNOWN                  4
#define NET_ROAMING                  5

#define GPS_STATE_OFF                0
#define GPS_STATE_FIX_NONE           1
#define GPS_STATE_FIX_2D             2
#define GPS_STATE_FIX_3D             3

#define AT_OK F("OK")

// Establishes software serial with the SIM7000
uint8_t connectGPRSModuleSerial(Adafruit_FONA_LTE *fona, SoftwareSerial *serial, uint8_t retries);
// Configure the GRPS module for initial use
uint8_t setupGPRSModule(Adafruit_FONA_LTE *fona);
// Configure the GPS module for initial use
uint8_t setupGPSModem(Adafruit_FONA_LTE *fona);
// Connect to the network
uint8_t connectGPRS(Adafruit_FONA_LTE *fona);
// Disconnect from the network
uint8_t disconnectGPRS(Adafruit_FONA_LTE *fona);
// Start a GPS connection
uint8_t connectGPS(Adafruit_FONA_LTE *fona);
// Get the signal strength
int8_t getRSSI(Adafruit_FONA_LTE *fona);
// Get the network/cellular status
int8_t getNetworkStatus(Adafruit_FONA_LTE *fona);
// Enable GPS
uint8_t enableGPS(Adafruit_FONA_LTE *fona);
// Disable GPS
uint8_t disableGPS(Adafruit_FONA_LTE *fona);
// Get the status of the GPS connection
int8_t getGPSStatus(Adafruit_FONA_LTE *fona);

// Make a POST request
void requestHTTPPOST(Adafruit_FONA_LTE *fona, const char *URL, StaticJsonDocument<200>& doc, size_t bodySize, uint16_t *status, uint16_t *datalen, uint16_t timeout);
// Make a GET request
void requestHTTPGET(Adafruit_FONA_LTE *fona, const char *URL, StaticJsonDocument<200>& doc, uint16_t *status, uint16_t *datalen, uint16_t timeout);

void HTTPEnd(Adafruit_FONA_LTE *fona);

// Get the friendly name for the network status
FONAFlashStringPtr networkStatusFriendlyName(int8_t);
// Get the friendly name for the GPS status
FONAFlashStringPtr GPSStatusFriendlyName(int8_t s);
