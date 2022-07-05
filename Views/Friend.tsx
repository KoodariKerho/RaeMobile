import React from 'react';
import {View, Image, Text} from 'react-native';
import {useAppSelector} from '../hooks';
import {useTheme} from '@react-navigation/native';
<<<<<<< Updated upstream
=======
import {useAppDispatch} from '../hooks';
import {changeEvent} from '../features/eventSlice';
import {Event} from '../models/types';
import showToast from '../utils/toaster';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
>>>>>>> Stashed changes

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const friend = useAppSelector(state => state.friend.value);
<<<<<<< Updated upstream
=======
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let unmounted = false;
    const getUserEvents = async () => {
      setLoading(true);
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/user-events/' +
        friend.id;
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
    };
    if (!unmounted) {
      getUserEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [friend.id]);

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

>>>>>>> Stashed changes
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
      }}>
      <Image
        source={{uri: friend.photo}}
        style={{width: 100, height: 100, borderRadius: 270, marginBottom: 30}}
      />
      <Text style={{color: 'white', fontSize: 35}}>{friend.username}</Text>
    </View>
  );
};
