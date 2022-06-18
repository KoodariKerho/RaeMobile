import React from 'react';
import {View, Image} from 'react-native';
import {useAppSelector} from '../hooks';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const friend = useAppSelector(state => state.friend.value);
  return (
    <View>
      <Text>{friend.username}</Text>
      <Image source={{uri: friend.photo}} style={{width: 50, height: 50}} />
      <Text style={{color: 'red'}}>{friend.email}</Text>
    </View>
  );
};
