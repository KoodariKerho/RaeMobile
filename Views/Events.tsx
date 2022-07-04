import {
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Event} from '../models/types';
import {useAppDispatch, useAppSelector} from '../hooks';
import {changeEvent} from '../features/eventSlice';
import {useTheme} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const width = Dimensions.get('window').width;

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const [search, setSearch] = useState('');
  const [searchEvents, setSearchEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('helsinki');
  const [items, setItems] = useState([
    {label: 'Helsinki', value: 'helsinki'},
    {label: 'Tampere', value: 'tampere'},
    {label: 'Turku', value: 'turku'},
    {label: 'Oulu', value: 'oulu'},
  ]);
  const [events, setEvents] = useState(
    useAppSelector(state => state.events.value),
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const filterEvents = () => {
    /*     Keyboard.dismiss(); */
    if (search === '') {
      setSearchEvents(events);
    } else {
      const newEvents = events.filter(event => {
        return (
          event.name.toLowerCase().includes(search.toLowerCase()) ||
          event.companyName.toLowerCase().includes(search.toLowerCase()) ||
          event.place.toLowerCase().includes(search.toLowerCase())
        );
      });
      setSearchEvents(newEvents);
    }
  };

  useEffect(() => {
    let unmounted = false;
    console.log('useEffect');
    const getAllEvents = async () => {
      console.log('getAllEvents');
      setLoading(true);
      try {
        const url =
          'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/events/' +
          value;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setEvents(data);
        setSearchEvents(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }

      setLoading(false);
    };
    if (!unmounted) {
      getAllEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [value]);

  const goToEventDetails = event => {
    dispatch(changeEvent(event));
    navigation.navigate('Eventdetails');
  };

  const height = Dimensions.get('window').height;

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
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Valitse kaupunki"
        placeholderStyle={{
          color: 'black',
          fontWeight: 'bold',
        }}
        style={{width: width * 0.8, margin: 10, alignSelf: 'center'}}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <TextInput
          style={styles.input}
          onChangeText={e => {
            setSearch(e);
            filterEvents();
          }}
          value={search}
          placeholder="Haku"
          selectTextOnFocus={true}
          maxLength={20}
        />
      </View>
      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#00ff00" />
        ) : (
          <View>
            <FlatList
              data={searchEvents}
              keyExtractor={item => item.event_id}
              renderItem={EventListItem}
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
