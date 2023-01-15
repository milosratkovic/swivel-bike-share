import { Amplify } from 'aws-amplify';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView
} from 'react-native';
import awsconfig from './src/aws-exports';
import Navigation from './src/navigation'
Amplify.configure(awsconfig);

const App = () => {
  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  },
});

export default App;