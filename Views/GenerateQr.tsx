import {View, Dimensions, Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../hooks';
import QRCode from 'react-native-qrcode-svg';

export default (): JSX.Element => {
  const {colors} = useTheme();

  const user = useAppSelector(state => state.user.value);
  console.log(user);

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  return (
    <View>
      <Text
        style={{
          color: 'white',
          fontSize: 20,
          margin: 30,
          fontWeight: 'bold',
        }}>
        Skannaa tämä QR-koodi Rae-sovelluksen QR lukijalla tai jaa kaverilinkki
        edellieltä sivulta!
      </Text>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          width: width,
          height: height - 200,
        }}>
        <QRCode value={user.uid} size={320} />
      </View>
    </View>
  );
};
