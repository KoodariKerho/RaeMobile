import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useAppSelector} from '../hooks';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const event = useAppSelector(state => state.event.value);
  const user = useAppSelector(state => state.user.value);
  console.log(event);

  const attendToEvent = async () => {
    try {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/add-post-to-user/' +
        user.uid +
        '/' +
        event.id;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          username: user.username,
          photo: user.photo,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Text>{event?.name}</Text>
      <Text>{event.id}</Text>
      <TouchableOpacity onPress={() => attendToEvent()}>
        <Text style={{color: 'red'}}>Attend to event</Text>
      </TouchableOpacity>
    </View>
  );
};
