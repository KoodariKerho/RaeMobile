import {View, Text, Button} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAppSelector, useAppDispatch} from '../hooks';

export default ({navigation}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.value);
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);

  //TODO: Make user login if not logged in
  console.log(user)

  useEffect(() => {
    //unmount function
    let unmounted = false;
    //get friendlist
    const getFriends = async () => {
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
    };
    if (!unmounted) {
      getFriends();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid]);

  return (
    <View>
      <Text>HomeScreen</Text>
    </View>
  );
};
