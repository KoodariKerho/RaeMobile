import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Button,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAppSelector} from '../hooks';
import {useAppDispatch} from '../hooks';
import {changeFriend} from '../features/friendSlice';
import {Friend} from '../models/types';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';
import {changeEvent} from '../features/eventSlice';

export default ({navigation}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.value);
  const [friendsEvents, setFriendsEvents] = useState([]);

  const {colors} = useTheme();
  useEffect(() => {
    let unmounted = false;
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

  const goToFriendProfile = (friend: Friend) => {
    dispatch(changeFriend(friend));
    navigation.navigate('Friend');
  };

  const goToEventDetails = event => {
    console.log('THIS EVENT');
    console.log(event);

    dispatch(changeEvent(event));
    navigation.navigate('Eventdetails');
  };

  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  const Item = ({post}) => {
    const url = `https://portalvhdsp62n0yt356llm.blob.core.windows.net/bailataan-mediaitems/${post.event.mediaFilename}`;
    console.log(url);
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          backgroundColor: colors.card,
          borderRadius: 10,
          width: width - 20,
          margin: 10,
          height: height * 0.2,
          shadowColor: '#FFFFFF',
          shadowOffset: {
            width: 1,
            height: 4,
          },
          shadowOpacity: 0.45,
          shadowRadius: 3.84,

          elevation: 5,
        }}>
        {/* author data */}
        <View
          style={{
            position: 'relative',
            left: 3,
            top: 8,
          }}>
          <TouchableOpacity
            onPress={() => goToFriendProfile(post.user.attribute_values)}>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                borderWidth: 1,
                borderColor: '#ccc',
              }}
              source={{uri: post.user.attribute_values.photo}}
            />
            <Text>{post.user.attribute_values.username}</Text>
          </TouchableOpacity>
        </View>
        {/* Event data */}
        <View>
          <Text>{post.event.name}</Text>
          <Text>{post.event.companyName}</Text>
          <Text>{post.event.place}</Text>
          <Image
            style={{
              width: 120,
              height: 120,
              borderRadius: 10,
            }}
            source={{
              uri: url,
            }}
          />
        </View>
        <Button
          onPress={() => goToEventDetails(post.event)}
          title="Lisätietoja"
        />
      </View>
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
            keyExtractor={item => item.id}
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
