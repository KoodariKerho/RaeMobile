import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../hooks';
import {Event} from '../models/types';
import {useAppDispatch} from '../hooks';
import {changeEvent} from '../features/eventSlice';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const user = useAppSelector(state => state.user.value);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let unmounted = false;
    const getUserEvents = async () => {
      setLoading(true);
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
      setEvents(data);
      setLoading(false);
    };
    if (!unmounted) {
      getUserEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid]);

  const goToEventDetails = event => {
    dispatch(changeEvent(event));
    navigation.navigate('Eventdetails');
  };

  const EventListItem = ({item}: {item: Event}) => {
    const url = `https://portalvhdsp62n0yt356llm.blob.core.windows.net/bailataan-mediaitems/${item.mediaFilename}`;
    return (
      <TouchableOpacity onPress={() => goToEventDetails(item)}>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: colors.card,
            borderRadius: 10,
            width: width - 20,
            margin: 10,
            height: height * 0.43,
            shadowColor: '#FFFFFF',
            shadowOffset: {
              width: 1,
              height: 4,
            },
            shadowOpacity: 0.45,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <View style={{}}>
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <Text style={styles.headerText}>{item.name}</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.descText}>{item.companyName}</Text>
                <Text style={styles.descText}> @ {item.place}</Text>
              </View>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Image
              style={{
                width: width - 40,
                borderRadius: 10,
                aspectRatio: 16 / 9,
              }}
              source={{
                uri: url,
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <View>
        {loading ? (
          <></>
        ) : (
          <View>
            <FlatList
              data={events}
              renderItem={({item}: any) => <EventListItem item={item} />}
              keyExtractor={(item: any) => item.id}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#FFF',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginRight: 10,
  },
  descText: {
    fontSize: 10,
    color: '#FFF',
    marginVertical: 4,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#FFF',
  },
  userText: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    maxWidth: 90,
  },
  timestampText: {
    fontSize: 10,
    color: '#474747',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#a0a1a3',
    borderRadius: 20,
    width: width - 40,
  },
});
