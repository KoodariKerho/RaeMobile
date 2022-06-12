import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../hooks';
import QRCode from 'react-native-qrcode-svg';

export default (): JSX.Element => {
  const {colors} = useTheme();

  const user = useAppSelector(state => state.user.value);
  console.log(user);

  return (
    <View>
      <QRCode value={user.uid} />
    </View>
  );
};
