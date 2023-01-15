#ifndef SWIVELCONFIG_H
#define SWIVELCONFIG_H

// Defines constants used across the Swivel device firmware

// Network configuration for Telus CATM
#define NETWORK_APN "m2m.telus.iot"
// Pins for SIM7000 shield
#define FONA_PWRKEY 6
#define FONA_RST 7
#define FONA_TX 10 // Microcontroller RX
#define FONA_RX 11 // Microcontroller TX

#define DELAY_GPRS_CONN_ATTEMPT 3000

// I/O
#define PIN_SOLENOID 3
#define PIN_ACC_X A0
#define PIN_ACC_Y A1
#define PIN_ACC_Z A2

#endif
