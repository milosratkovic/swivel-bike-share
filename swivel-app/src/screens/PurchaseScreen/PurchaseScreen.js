import { useNavigation, useRoute } from '@react-navigation/native';
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

const PurchaseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { image, name, location, rating, price, time } = route.params;
  let totalHourly = 0,
    numHours = 3,
    tax = 0,
    totalPrice = 0;
  totalHourly = numHours * price;
  tax = totalHourly * 0.12;
  totalPrice = totalHourly + tax;
  return (
    <View style={purchaseStyles.container}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../../../assets/swivel_login_background.jpg')}
      >
        <View style={headerFooterStyles.header}>{generateHeader()}</View>

        <View style={headerFooterStyles.body}>
          <View style={purchaseStyles.backgroundColor}>
            <View style={purchaseStyles.top}>
              <Image
                style={{ resizeMode: 'cover', height: '100%', width: '100%' }}
                source={image}
              />
            </View>

            <View style={purchaseStyles.middle}>
              <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 26 }}>{name}</Text>
              <Text style={purchaseStyles.priceText}> {'$ '}
                {price}
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: '#BFC0BD',
                    fontSize: 14,
                    textAlign: 'center',
                  }}
                >
                  {' '}
                  /Hour
                </Text>
              </Text>
            </View>

            <View style={purchaseStyles.middle2}>
              <Image
                style={{
                  resizeMode: 'cover',
                  height: '76%',
                  width: '20%',
                  aspectRatio: 0.75,
                  left: '4%',
                  bottom: '5%',
                }}
                source={require('../../../assets/gps_icon.jpg')}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#BFC0BD',
                  fontSize: 22,
                  textAlign: 'center',
                  position: 'absolute',
                  left: '20%',
                  right: '5%',
                  flexShrink: 1,
                }}
              >
                {location}
              </Text>
            </View>
            <View style={purchaseStyles.middle2}>
              <Image
                style={{ resizeMode: 'cover', height: '80%', width: '20%', bottom: '5%' }}
                source={require('../../../assets/clock_icon.jpg')}
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#BFC0BD',
                  fontSize: 22,
                  textAlign: 'center',
                  position: 'absolute',
                  left: '20%',
                  right: '5%',
                  flexShrink: 1,
                  flexWrap: 'wrap',
                }}
              >
                Sept 20th, 8:00 AM to Sept 20th, 11:00 AM{' '}
              </Text>
            </View>

            <View style={purchaseStyles.bottom}>
              <ScrollView>
                <View style={purchaseStyles.bottom_text}>
                  <Text style={purchaseStyles.blackTextStyleLeft}> Payment Summary</Text>
                  <Text style={purchaseStyles.blackTextStyleRight}> $ {totalPrice.toFixed(2)}</Text>
                </View>
                <View style={purchaseStyles.bottom_text}>
                  <Text style={purchaseStyles.greyTextStyleLeft}> Hourly Cost</Text>
                  <Text style={purchaseStyles.greyTextStyleRight}> $ {totalHourly.toFixed(2)}</Text>
                </View>
                <View style={purchaseStyles.bottom_text}>
                  <Text style={purchaseStyles.greyTextStyleLeft}> GST + PST</Text>
                  <Text style={purchaseStyles.greyTextStyleRight}> $ {tax.toFixed(2)}</Text>
                </View>
              </ScrollView>
            </View>

            <View style={purchaseStyles.bottom2}>
              <TouchableOpacity
                style={purchaseStyles.confirmButton}
                onPress={() => navigation.navigate('Visa')}
              >
                <View style={purchaseStyles.confirmButton}>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: '#300000',
                      fontSize: 26,
                      textAlign: 'left',
                      // fontWeight: 'bold',
                    }}
                  >
                    {' '}
                    Pay Now{' '}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={headerFooterStyles.footer}>{generateFooter()}</View>
      </ImageBackground>
    </View>
  );
};

const purchaseStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#000',
  },
  top: {
    flex: 0.4,
    backgroundColor: 'grey',
    // borderWidth: 1,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  middle: {
    flex: 0.1,
    marginBottom: '2%',
    // backgroundColor: "beige",
    // borderWidth: 1,
  },

  middle2: {
    flex: 0.1, // *2 since there are 2 using this
    // backgroundColor: "beige",
    // borderWidth: 1,
  },
  bottom: {
    flex: 0.2,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // backgroundColor: "pink",
    // borderWidth: 1,
    marginHorizontal: '3%',
    // marginTop: '10%',
  },
  bottom_text: {
    // flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: "pink",
    // borderWidth: 1,
  },

  bottom2: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: "pink",
    // borderWidth: 1,
  },

  confirmButton: {
    flex: 1,
    backgroundColor: '#B4FF39',
    color: '#000',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 25,
    // marginBottom: 15,
  },

  baseText: {
    // fontSize: 14,
    textAlign: 'center',
    justifyContent: 'flex-end',
  },

  priceText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'flex-end',
    color: '#B4FF39',
  },
  greyTextStyleLeft: {
    fontWeight: 'bold',
    color: '#BFC0BD',
    fontSize: 22,
    textAlign: 'left',
  },
  greyTextStyleRight: {
    fontWeight: 'bold',
    color: '#BFC0BD',
    fontSize: 22,
    textAlign: 'left',
  },
  blackTextStyleLeft: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 22,
    textAlign: 'left',
  },
  blackTextStyleRight: {
    fontWeight: 'bold',
    color: '#000000',
    fontSize: 22,
    textAlign: 'left',
  },
  backgroundColor: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default PurchaseScreen;
