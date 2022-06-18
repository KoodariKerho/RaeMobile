import React from 'react';
import {View, Image, Text} from 'react-native';
import {useAppSelector} from '../hooks';
import {useTheme} from '@react-navigation/native';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const friend = useAppSelector(state => state.friend.value);
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}>
      <Image
        source={{uri: friend.photo}}
        style={{width: 100, height: 100, borderRadius: 270, marginBottom: 30}}
      />
      <Text style={{color: 'white', fontSize: 35}}>{friend.username}</Text>
    </View>
  );
};
