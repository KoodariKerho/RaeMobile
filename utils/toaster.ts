import Toast from 'react-native-toast-message';

const showToast = (message: string, type: string) => {
  Toast.show({
    type: type,
    text1: message,
  });
};

export default showToast;
