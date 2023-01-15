import { useNavigation } from '@react-navigation/native';
import { Auth } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';

import { headerFooterStyles, generateHeader, generateFooter } from '../Header_Footer/HeaderFooter';

const signOut = () => {
  Auth.signOut();
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={profileStyles.container}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../../assets/swivel_login_background.jpg')}
      >
        <View style={headerFooterStyles.header}>{generateHeader()}</View>

        <View style={headerFooterStyles.body}>
          <View style={profileStyles.top}>
            <Image
              style={{
                resizeMode: 'cover',
                height: '100%',
                width: '50%',
                borderRadius: 200,
                alignSelf: 'center',
              }}
              source={require('../../../assets/p_user_selfie.png')}
            />
          </View>

          <View style={profileStyles.lowerTop}>
            <Text style={profileStyles.topText}> John Smith </Text>
          </View>

          <View style={profileStyles.middle}>
            <View style={profileStyles.horizontalView}>
              <View style={profileStyles.middleLeft}>
                <Image
                  style={profileStyles.defaultIconStyle}
                  source={require('../../../assets/p_profile.png')}
                />
              </View>
              <View style={profileStyles.middleRight}>
                <TouchableOpacity
                  style={profileStyles.baseButton}
                  onPress={() => navigation.navigate('Visa')}
                >
                  <View style={profileStyles.baseButton}>
                    <Text style={profileStyles.baseButtonText}> Profile </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={profileStyles.horizontalView}>
              <View style={profileStyles.middleLeft}>
                <Image
                  style={profileStyles.defaultIconStyle}
                  source={require('../../../assets/p_notifications.png')}
                />
              </View>
              <View style={profileStyles.middleRight}>
                <TouchableOpacity
                  style={profileStyles.baseButton}
                  onPress={() => navigation.navigate('Visa')}
                >
                  <View style={profileStyles.baseButton}>
                    <Text style={profileStyles.baseButtonText}> Notifications </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={profileStyles.horizontalView}>
              <View style={profileStyles.middleLeft}>
                <Image
                  style={profileStyles.defaultIconStyle}
                  source={require('../../../assets/p_settings.png')}
                />
              </View>
              <View style={profileStyles.middleRight}>
                <TouchableOpacity
                  style={profileStyles.baseButton}
                  onPress={() => navigation.navigate('Visa')}
                >
                  <View style={profileStyles.baseButton}>
                    <Text style={profileStyles.baseButtonText}> Settings </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={profileStyles.horizontalView}>
              <View style={profileStyles.middleLeft}>
                <Image
                  style={profileStyles.defaultIconStyle}
                  source={require('../../../assets/p_support.png')}
                />
              </View>
              <View style={profileStyles.middleRight}>
                <TouchableOpacity
                  style={profileStyles.baseButton}
                  onPress={() => navigation.navigate('Visa')}
                >
                  <View style={profileStyles.baseButton}>
                    <Text style={profileStyles.baseButtonText}> Support </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={profileStyles.horizontalView}>
              <View style={profileStyles.middleLeft}>
                <Image
                  style={profileStyles.defaultIconStyle}
                  source={require('../../../assets/p_logout.png')}
                />
              </View>
              <View style={profileStyles.middleRight}>
                <TouchableOpacity style={profileStyles.baseButton} onPress={signOut}>
                  <View style={profileStyles.baseButton}>
                    <Text style={profileStyles.baseButtonText}> Logout </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={headerFooterStyles.footer}>{generateFooter()}</View>
      </ImageBackground>
    </View>
  );
};

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // backgroundColor: '#000',
  },
  top: {
    flex: 0.3,
    // backgroundColor: '#5dc00',
    borderWidth: 1,
    paddingVertical: '1%',
  },
  lowerTop: {
    flex: 0.1,
    // backgroundColor: '#2a4944',
    // borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middle: {
    flex: 0.6,
    backgroundColor: 'yellow',
    borderWidth: 1,
  },
  // bottom: {
  //   flex: 0.15,
  //   backgroundColor: 'red',
  //   borderWidth: 1,
  // },

  topText: {
    fontWeight: 'bold',
    color: '#B4FF39',
    // color: 'white',
    fontSize: 32,
    textAlign: 'center',
    justifyContent: 'center',
    // bottom: '10%',
  },

  horizontalView: {
    flex: 1,
    backgroundColor: 'orange',
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  middleLeft: {
    flex: 0.4,
    backgroundColor: 'white',
    // borderWidth: 1,
    alignItems: 'center',
  },
  middleRight: {
    flex: 0.6,
    backgroundColor: 'teal',
    // borderWidth: 1,
    justifyContent: 'center',
  },

  middleText: {
    fontWeight: 'bold',
    color: '#af9',
    fontSize: 22,
    textAlign: 'middle',
  },
  baseButton: {
    flex: 1,
    backgroundColor: '#fff',
    color: '#000',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  baseButtonText: {
    fontWeight: 'bold',
    color: '#BFC0BD',
    fontSize: 26,
    textAlign: 'left',
  },
  defaultIconStyle: {
    resizeMode: 'cover',
    height: '80%',
    width: '45%',
    top: '10%',
    bottom: '1%',
  },
});

export default ProfileScreen;
