import React, {useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useAppSelector} from '../hooks';
<<<<<<< Updated upstream
=======
import {Event} from '../models/types';
import {useAppDispatch} from '../hooks';
import {changeEvent} from '../features/eventSlice';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons/faTrash';
import showToast from '../utils/toaster';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
>>>>>>> Stashed changes

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const user = useAppSelector(state => state.user.value);

  useEffect(() => {
    let unmounted = false;
    const getUserEvents = async () => {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/user-events/' +
        user.uid;
<<<<<<< Updated upstream
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
=======
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        showToast('Error fetching events', 'error');
        setLoading(false);
      }
>>>>>>> Stashed changes
    };
    if (!unmounted) {
      getUserEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid]);

<<<<<<< Updated upstream
=======
  const goToEventDetails = event => {
    dispatch(changeEvent(event));
    navigation.navigate('Eventdetails');
  };
  const deleteEvent = async event => {
    const url =
      'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/delete-user-post/' +
      user.uid +
      '/' +
      event;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.log(e);
      showToast('Error deleting event', 'error');
    }
    //delete event from events array
    const newEvents = events.filter(e => e.id !== event);
    setEvents(newEvents);
  };

  const EventListItem = ({item}: {item: Event}) => {
    const url = `https://portalvhdsp62n0yt356llm.blob.core.windows.net/bailataan-mediaitems/${item.mediaFilename}`;
    return (
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
        <TouchableOpacity onPress={() => deleteEvent(item.id)}>
          <FontAwesomeIcon
            color={'red'}
            icon={faTrash}
            style={{alignSelf: 'flex-end', marginRight: 10, marginTop: 10}}
          />
        </TouchableOpacity>
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
        <TouchableOpacity onPress={() => goToEventDetails(item)}>
          <Text
            style={{
              color: 'white',
              fontSize: 22,
              textDecorationLine: 'underline',
              alignSelf: 'center',
            }}>
            Lisätietoja
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

>>>>>>> Stashed changes
  return (
    <View>
      <Text style={{color: 'white'}}>Hei!</Text>
    </View>
  );
};
