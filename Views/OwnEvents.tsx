import React, {useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../hooks';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const user = useAppSelector(state => state.user.value);

  useEffect(() => {
    let unmounted = false;
    const getUserEvents = async () => {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/user-events/' +
        user.uid;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
    };
    if (!unmounted) {
      getUserEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid]);

  return (
    <View>
      <Text style={{color: 'white'}}>Hei!</Text>
    </View>
  );
};
