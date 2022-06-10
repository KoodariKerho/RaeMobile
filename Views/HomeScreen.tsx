import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAppSelector} from '../hooks';
import {useAppDispatch} from '../hooks';
import {changeFriend} from '../features/friendSlice';
import {Friend} from '../models/types';


export default ({navigation}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.value);
  const [friendsEvents, setFriendsEvents] = useState([]);

  //TODO: Make user login if not logged in
  console.log(user);

  useEffect(() => {
    //unmount function
    let unmounted = false;
    //get friendlist
    const getFriendEvents = async () => {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/friends-events/' +
        user.uid;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setFriendsEvents(data);
    };
    if (!unmounted) {
      getFriendEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid]);

  const addToOwnPosts = async (eventId: string) => {
    const url =
      'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/add-post-to-user/' +
      user.uid +
      '/' +
      eventId;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(data);
    //TODO: Show toast error or success
  };

  const goToFriendProfile = (friend: Friend) => {
    dispatch(changeFriend(friend));
    navigation.navigate('Friend');
  };

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('QrReader')}>
        <Text>HEERERRE</Text>
      </TouchableOpacity>
      <View>
        {friendsEvents?.map((post: any) => {
          console.log(post);
          return (
            <View>
              <Text>Event id</Text>
              <Text>{post.event.id}</Text>
              <Text>User id</Text>
              <Text style={{color: 'red'}}>
                {post.user.attribute_values.id}
              </Text>
              <TouchableOpacity
                onPress={() => goToFriendProfile(post.user.attribute_values)}>
                {/* Add also friend data to profile */}
                <Image
                  style={{width: 50, height: 50}}
                  source={{uri: post.user.attribute_values.photo}}
                />
              </TouchableOpacity>
              <Text>ojfsoijoseifj</Text>
              <TouchableOpacity onPress={() => addToOwnPosts(post.event.id)}>
                <Text>Add to own</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
};

