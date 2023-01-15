import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ImageBackground,
  ImageStore,
} from 'react-native';

import { headerFooterStyles, generateHeader, generateFooter } from '../Header_Footer/HeaderFooter';

const defaultHeight = 125;
const defaultWidth = 125;

const CurrentBikeScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={currentBikeStyles.container}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../../assets/swivel_login_background.jpg')}
      >
        <View style={headerFooterStyles.header}>{generateHeader()}</View>

        <View style={headerFooterStyles.body}>
          <View style={currentBikeStyles.top}>
            <Image
              style={{ resizeMode: 'cover', height: '100%', width: '100%' }}
              source={require('../../../assets/bikeSelection/bike4.jpg')}
            />
          </View>

          <View style={currentBikeStyles.middle}>
            <View style={currentBikeStyles.textBoxColumn}>
              <Text style={currentBikeStyles.defaultText}> Theft </Text>
              <Text style={currentBikeStyles.defaultText}> Use </Text>
              <Text style={currentBikeStyles.defaultText}> Battery Percentage </Text>
            </View>
            <View style={currentBikeStyles.textBoxColumn}>
              <Text style={currentBikeStyles.defaultText}> Not detected </Text>
              <Text style={currentBikeStyles.defaultText}> Available </Text>
              <Text style={currentBikeStyles.defaultText}> 38% </Text>
            </View>
          </View>

          <View style={currentBikeStyles.bottom}>
            <TouchableOpacity
              style={currentBikeStyles.buttonUnlockDelegator}
              onPress={() => navigation.navigate('Visa')}
            >
              <View style={currentBikeStyles.buttonUnlockDelegator}>
                <Text style={currentBikeStyles.buttonUnlockDelegatorText}>Unlock Delegator</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={headerFooterStyles.footer}>{generateFooter()}</View>
      </ImageBackground>
    </View>
  );
};

const currentBikeStyles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'space-between',
    backgroundColor: '#eff',
  },
  //Image
  top: {
    flex: 0.4,
    backgroundColor: '#dff',
  },
  // Text
  middle: {
    flex: 0.48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  // Button
  bottom: {
    flex: 0.12,
    backgroundColor: '#eff',
  },

  defaultText: {
    flex: 1,
    borderWidth: 1,
    // flexGrow: 1,
    // // paddingVertical: 10,

    // alignContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    // fontWeight: 'bold',
    // color: '#000',
    // fontSize: 16,
    // paddingVertical: '3%',
    // paddingHorizontal: '15%',
    alignItems: 'stretch',
  },
  textBoxRow: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    // flexGrow: 1,
    // // paddingVertical: 10,

    // alignContent: 'center',

    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    // fontWeight: 'bold',
    // color: '#000',
    // fontSize: 16,
    // paddingVertical: '3%',
    // paddingHorizontal: '15%',
    alignItems: 'stretch',
  },
  textBoxColumn: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    // flexGrow: 1,
    // // paddingVertical: 10,

    // alignContent: 'center',

    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    // fontWeight: 'bold',
    // color: '#000',
    // fontSize: 16,
    // paddingVertical: '3%',
    // paddingHorizontal: '15%',
    alignItems: 'stretch',
  },

  buttonUnlockDelegator: {
    flex: 1,
    justifyContent: 'center',
    top: '0%',
    // borderWidth: 1,
    backgroundColor: '#B4FF39',
  },

  buttonUnlockDelegatorText: {
    fontWeight: 'bold',
    color: '#000',
    // color: '#B4FF39',
    fontSize: 22,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
    opacity: 1,
    // backgroundColor: 'green',
  },
});
export default CurrentBikeScreen;
