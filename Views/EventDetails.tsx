import React from 'react';
import {View, Text} from 'react-native';
import {useAppSelector} from '../hooks';

export default ({navigation}: any): JSX.Element => {
  const event = useAppSelector(state => state.event.value);
  console.log(event);
  return (
    <View>
      <Text>{event?.name}</Text>
    </View>
  );
};
