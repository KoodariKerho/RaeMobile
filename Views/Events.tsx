import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Event} from '../models/types';
import {useAppDispatch, useAppSelector} from '../hooks';
import {changeEvent} from '../features/eventSlice';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const [events, setEvents] = useState(
    useAppSelector(state => state.events.value),
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let unmounted = false;
    const getAllEvents = async () => {
      setLoading(true);
      if (events === null || events === undefined) {
        console.log('Getting all events from server');
        try {
          const url =
            'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/events/';
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log(data);
          setEvents(data);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      }
      setLoading(false);
    };
    if (!unmounted) {
      getAllEvents();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  const goToEventDetails = event => {
    console.log('THIS EVENT');
    console.log(event);

    dispatch(changeEvent(event));
    navigation.navigate('Eventdetails');
  };

  const EventListItem = ({item}: {item: Event}) => (
    <TouchableOpacity onPress={() => goToEventDetails(item)}>
      <View>
        <Text>{item.name}</Text>
        <Text>{item.companyName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text>Events</Text>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <View>
            <FlatList
              data={events}
              keyExtractor={item => item.event_id}
              renderItem={EventListItem}
            />
          </View>
        )}
      </View>
    </View>
  );
};
