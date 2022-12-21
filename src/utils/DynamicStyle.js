import {Platform, ToastAndroid} from 'react-native';

export function dynamicWeight(ios, android) {
  return Platform.OS === 'android' ? android : ios;
}

export function showToast(message) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else if (Platform.OS === 'ios') {
  }
}
