import React from 'react';
import {View, Text} from 'react-native';
import {useAppSelector} from '../hooks';

export default ({navigation}: any): JSX.Element => {
  const friend = useAppSelector(state => state.friend.value);
  console.log(friend);
  return (
    <View>
      <Text>kaveri</Text>
    </View>
  );
};

