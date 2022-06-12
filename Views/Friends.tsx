import {View, Text, Image, ActivityIndicator, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../hooks';
import {Friend} from '../models/types';
import {changeFriend} from '../features/friendSlice';

export default ({navigation}: any): JSX.Element => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(state => state.user.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let unmounted = false;
    const getAllFriends = async () => {
      setLoading(true);
      try {
        const url =
          'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/friends/' +
          user.uid;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        setFriends(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
      setLoading(false);
    };
    if (!unmounted) {
      getAllFriends();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid]);

  const goToFriendDetails = friend => {
    dispatch(changeFriend(friend));
    navigation.navigate('Friend');
  };

  const FriendListItem = ({item}: {item: Friend}) => (
    <TouchableOpacity onPress={() => goToFriendDetails(item.attribute_values)}>
      <View>
        <Text>{item.attribute_values.email}</Text>
        <Text>{item.attribute_values?.username}</Text>
        <Image
          style={{width: 50, height: 50}}
          source={{uri: item.attribute_values.photo}}
        />
      </View>
    </TouchableOpacity>
  );

  const {colors} = useTheme();
  return (
    <View>
      <Text>Friends</Text>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <View>
            <FlatList
              data={friends}
              keyExtractor={item => item.attribute_values.id}
              renderItem={FriendListItem}
            />
          </View>
        )}
      </View>
    </View>
  );
};
