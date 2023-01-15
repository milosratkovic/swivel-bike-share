import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ImageBackground, TextInput, TouchableOpacity } from 'react-native';

import { headerFooterStyles, generateHeader, generateFooter } from '../Header_Footer/HeaderFooter';
const defaultHeight = 125;
const defaultWidth = 125;

const GarageForm = () => {
  const navigation = useNavigation();

  return (
    <View style={GarageFormStyles.container}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../../assets/swivel_login_background.jpg')}
      >
        {/* <View style={headerFooterStyles.header}>{generateHeader()}</View> */}

        {/* <View style={headerFooterStyles.body}> */}
        {/* <View style={GarageFormStyles.top}>
            <Text>test</Text>
          </View> */}

        <View style={GarageFormStyles.middle}>
          <View>
            <TextInput style={GarageFormStyles.textBox} placeholder="Enter Bike Name" />
            <TextInput style={GarageFormStyles.textBox} placeholder="Enter Price" />
            <TextInput style={GarageFormStyles.textBox} placeholder="Add Image" />
          </View>
        </View>

        {/* <View style={GarageFormStyles.bottom}>
            <TouchableOpacity
              style={GarageFormStyles.buttonAddBike}
              onPress={() => navigation.navigate('Garage')}
            >
              <View style={GarageFormStyles.buttonAddBike}>
                <Text style={GarageFormStyles.buttonAddBikeText}> Add Bike </Text>
              </View>
            </TouchableOpacity>
          </View> */}
        {/* </View> */}

        {/* <View style={headerFooterStyles.footer}>{generateFooter()}</View> */}
      </ImageBackground>
    </View>
  );
};

const GarageFormStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    // backgroundColor: 'cyan',
    margin: 0,
  },
  top: {
    flex: 0.15,
    // backgroundColor: 'cyan',
    // opacity: 0.3,
    borderWidth: 1,
  },
  middle: {
    flex: 1,
    // backgroundColor: 'white',
    // opacity: 0.3,
    borderWidth: 1,
  },
  bottom: {
    flex: 0.15,
    // backgroundColor: 'red',
    // opacity: 0.3,
    borderWidth: 1,
  },
  textBox: {
    borderWidth: 1,
    paddingVertical: 10,
    // marginHorizontal: 60,
    // alignContent: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    fontSize: 20,
  },
  buttonAddBike: {
    flex: 1,
    justifyContent: 'center',
    // borderWidth: 1,
    backgroundColor: '#B4FF39',
  },

  buttonAddBikeText: {
    fontWeight: 'bold',
    color: '#000',
    // color: '#B4FF39',
    fontSize: 22,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    // backgroundColor: 'green',
  },
});
export default GarageForm;
