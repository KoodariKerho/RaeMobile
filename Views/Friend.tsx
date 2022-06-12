import React from 'react';
import {View, Text, Image} from 'react-native';
import {useAppSelector} from '../hooks';
import {useTheme} from '@react-navigation/native';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const friend = useAppSelector(state => state.friend.value);
  console.log(friend);
  return (
    <View>
      <Text>{friend.username}</Text>
      <Image source={{uri: friend.photo}} style={{width: 50, height: 50}} />
      <Text style={{color: 'red'}}>{friend.email}</Text>
    </View>
  );
};
