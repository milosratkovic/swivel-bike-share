import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Image, ImageBackground } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import CustomButton from '../../components/CustomButton';
import { headerFooterStyles, generateHeader, generateFooter } from '../Header_Footer/HeaderFooter';


// Page to unlock delegator
const MapScreen = () => {
  const [telemetry, setTelemetry] = React.useState(undefined);
  const [tasks, setTasks] = React.useState(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const navigation = useNavigation();

  const onCheckoutPressed = () => {
    navigation.navigate('BikeSelection');
  };

  useEffect(() => {
    const updateInterval = setInterval(() => {
      fetch('http://iot.swivel.bike/telemetry/1')
        // .then((resp) => resp.json()) // PLEASE UNCOMMENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        .then((resp) => {
          setTelemetry(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });

      fetch('http://iot.swivel.bike/control/1')
        // .then((resp) => resp.json()) // PLEASE UNCOMMENT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        .then((resp) => {
          setTasks(resp.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 2000);
    return () => {
      window.clearInterval(updateInterval);
    };
  }, []);

  const addTask = (task) => {
    setIsLoading(true);
    fetch('http://iot.swivel.bike/control/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actions: [task],
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setTasks(resp.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const removeTask = (task) => {
    fetch('http://iot.swivel.bike/control/complete/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actions: [task],
      }),
    })
      .then((resp) => resp.json())
      .then((resp) => {
        setTasks(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFriendlyNetworkStatus = () => {
    if (!telemetry) {
      return 'Unknown';
    }
    const { grps } = telemetry;
    const { network_status } = grps;
    if (network_status === 0 || network_status === 2) {
      return 'Searching (Operator)';
    } else if (network_status === 1) {
      return 'Registered (Home)';
    } else if (network_status === 3) {
      return 'Registration Denied';
    } else if (network_status === 5) {
      return 'Registered (Roaming)';
    }
    return 'Unknown';
  };

  const isUnlockable = () => {
    if (isLoading) {
      return false;
    }
    if (!telemetry) {
      return false;
    }
    if (!tasks) {
      return false;
    }
    if (tasks && tasks.includes('UNLOCK')) {
      return false;
    }
    return true;
  };

  const signOut = () => {
    Auth.signOut();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../../assets/swivel_login_background.jpg')}
      >
        <View style={headerFooterStyles.header}>{generateHeader()}</View>
        <View style={headerFooterStyles.body}>
          <CustomButton text="Checkout" onPress={onCheckoutPressed} alignItems="right" />
          <View style={styles.container}>
            {telemetry && (
              <>
                <MapView
                  provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                  style={styles.map}
                  region={{
                    latitude: telemetry ? telemetry.gps.latitude : 49.277748,
                    longitude: telemetry ? telemetry.gps.longitude : -122.90905,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: telemetry.gps.latitude,
                      longitude: telemetry.gps.longitude,
                    }}
                    pinColor="black"
                  />
                </MapView>
              </>
            )}
          </View>
          <View style={styles.dataContainer}>
            <View style={styles.dataContainerRow}>
              <View>
                <Text style={styles.dataHeader}>Signal (RSSI)</Text>
                <Text style={styles.dataValue}>{telemetry ? telemetry.grps.rssi : '0'} dBm</Text>
              </View>
              <View>
                <Text style={styles.dataHeader}>Network</Text>
                <Text style={styles.dataValue}>{getFriendlyNetworkStatus()}</Text>
              </View>
            </View>
            <View style={styles.dataContainerRow}>
              <View>
                <Text style={styles.dataHeader}>Long</Text>
                <Text style={styles.dataValue}>{telemetry ? telemetry.gps.longitude : '0'}</Text>
              </View>
              <View>
                <Text style={styles.dataHeader}>Lat</Text>
                <Text style={styles.dataValue}>{telemetry ? telemetry.gps.latitude : '0'}</Text>
              </View>
              <View>
                <Text style={styles.dataHeader}>Alt</Text>
                <Text style={styles.dataValue}>{telemetry ? telemetry.gps.altitude : '0'}</Text>
              </View>
            </View>
            <View>
              <TouchableOpacity
                style={isUnlockable() ? styles.unlockButton : styles.unlockButtonDisabled}
                onPress={() => {
                  if (isUnlockable()) {
                    addTask('UNLOCK');
                  } else {
                    Alert.alert(
                      'Reset Delegator State?',
                      'Would you like to reset the list of tasks for the delegator?',
                      [
                        {
                          text: 'Cancel',
                          style: 'cancel',
                          onPress: () => {},
                        },
                        {
                          text: 'Okay',
                          style: 'destructive',
                          onPress: () => {
                            removeTask('UNLOCK');
                          },
                        },
                      ]
                    );
                  }
                }}
              >
                <Text style={styles.unlockButtonText}>Unlock Bike</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={headerFooterStyles.footer}>{generateFooter()}</View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    display: 'flex',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 100,
    paddingTop: 10,
  },

  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#e2e8f0',
    // alignItems: 'center',
    // justifyContent: 'flex-end',
    // width: '100%',
    flexDirection: 'column',
  },

  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    width: '100%',
    minHeight: '25%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 25,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
  },

  dataContainerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  dataHeader: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#474343',
    marginBottom: 5,
  },

  dataValue: {
    fontSize: 14,
    color: '#000000',
  },

  unlockButton: {
    backgroundColor: '#B4FF39',
    color: '#000',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 25,
    marginBottom: 20,
  },

  unlockButtonDisabled: {
    backgroundColor: '#BFC0BD',
    color: '#000',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 25,
    marginBottom: 20,
  },

  unlockButtonText: {
    fontWeight: 'bold',
  },

  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  modalBackground: {
    minHeight: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 100,
    height: 100,
  },
});

export default MapScreen;
