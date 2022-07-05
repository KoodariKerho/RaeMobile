import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAppSelector} from '../hooks';
import {useAppDispatch} from '../hooks';
import {changeFriend} from '../features/friendSlice';
import {Friend} from '../models/types';
import {useTheme} from '@react-navigation/native';
import {changeEvent} from '../features/eventSlice';
import showToast from '../utils/toaster';

export default ({navigation}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.value);
  const [friendsEvents, setFriendsEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  const {colors} = useTheme();
  useEffect(() => {
    let unmounted = false;
    const getFriendEvents = async () => {
      setRefreshing(true);
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/friends-events/' +
        user.uid;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setFriendsEvents(data.reverse());
        setRefreshing(false);
      } catch (e) {
        console.log(e);
        showToast('Error fetching events', 'error');
        setRefreshing(false);
      }
    };
    if (!unmounted) {
      getFriendEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid]);

  const goToFriendProfile = (friend: Friend) => {
    dispatch(changeFriend(friend));
    navigation.navigate('Friend');
  };

  const goToEventDetails = event => {
    dispatch(changeEvent(event));
    navigation.navigate('Eventdetails');
  };

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const Item = ({post}) => {
    const url = `https://portalvhdsp62n0yt356llm.blob.core.windows.net/bailataan-mediaitems/${post.event.mediaFilename}`;
    return (
      <TouchableOpacity onPress={() => goToEventDetails(post.event)}>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#4a4949',
            backgroundColor: colors.card,
            borderRadius: 10,
            width: width - 20,
            margin: 10,
            height: height * 0.45,
            shadowColor: '#4a4949',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}>
          <View>
            <View style={{}}>
              <TouchableOpacity
                onPress={() => goToFriendProfile(post.user.attribute_values)}>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}>
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      marginRight: 10,
                      borderRadius: 25,
                      margin: 5,
                    }}
                    source={{uri: post.user.attribute_values.photo}}
                  />
                  <View style={{justifyContent: 'center'}}>
                    <Text style={styles.userText}>
                      {post.user.attribute_values.username}
                    </Text>
                    <Text style={styles.timestampText}>18.05.22</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{display: 'flex', flexDirection: 'column'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: '#FFF',
                  alignItems: 'center',
                  textAlign: 'center',
                  marginTop: 10,
                  marginRight: 10,
                  width: width - 40,
                  fontSize: 16,
                }}>
                {post.event.name}
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.descText}>{post.event.companyName}</Text>
                <Text style={styles.descText}> @ {post.event.place}</Text>
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

  const renderItem = ({item}) => <Item post={item} />;

  return (
    <View style={styles.container}>
      <View>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={friendsEvents}
            renderItem={renderItem}
            keyExtractor={item => item.user.attribute_values.id + item.event.id}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                }}>
                <Text style={styles.emptyText}>
                  Kavereilla ei ole vielä yhtään tapahtumaa. 🥺
                </Text>
                <Text style={styles.emptyText}>
                  Lisää kavereita "Kaverit" välilehdellä
                </Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.headerText}>Kavereiden tapahtumat</Text>
              </View>
            )}
          />
        </SafeAreaView>
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
    fontWeight: 'bold',
    color: '#FFF',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginRight: 10,
    fontSize: 20,
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
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 13,
    color: '#595959',
    fontWeight: 'bold',
  },
});

/* {"event": {"availability": 100, "companyMediaFilename": null, "companyName": "Luxonia Events", 
"dateActualFrom": "2022-08-13T21:00:00+03:00", "dateActualUntil": "2022-08-14T03:00:00+03:00", 
"dateCreated": "2022-06-02T14:10:21Z", "datePublishFrom": "2022-06-08T08:00:00+03:00", "dateSalesFrom":
 "2022-06-08T09:00:00+03:00", "dateSalesUntil": "2022-08-14T02:00:00+03:00", "favoritedTimes": 2, 
 "hasFreeInventoryItems": false, "hasInventoryItems": true, "id": "6b65ef5e-d102-44ee-9769-ff734e5f119b", 
 "isActual": false, "isFavorited": false, "isLong": false, "maxPrice": {"eur": 860}, "mediaFilename": "xl_51a940b692c59aacf3461d6eea73769ce39245e8bf03c7437fa7b432.jpeg",
  "minPrice": {"eur": 860}, "name": "Club Luxonia 13.8.2022 K18", "place": "Pikku-Finlandia", "pricingInformation": null, 
  "productType": 1, "salesEnded": false, "salesOngoing": true, "salesPaused": false, "salesStarted": true, "timeUntilActual": 5185874, 
  '"timeUntilSalesStart": 0}, "user": {"attribute_values": {"email": "testiemail@gmail.xdlsd", "friends": [Array], "id": "MIFgceykluOyvTcVvGhKFTMIjMX2",
   "photo": "https://firebasestorage.googleapis.com/v0/b/opiskelija-appi.appspot.com/o/logoteal.png?alt=media&token=a32ea342-c941-4e69-ab19-bcf02b3d4000", 
   "posts": [Array], "username": "Huikka"}}} */
