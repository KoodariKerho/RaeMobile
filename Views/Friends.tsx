import {
  View,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Friend } from '../models/types';
import { changeFriend } from '../features/friendSlice';
import Text from '../Components/CustomText';
import Clipboard from '@react-native-community/clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faQrcode, faShare } from '@fortawesome/free-solid-svg-icons';
import showToast from '../utils/toaster';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { changeUser } from '../features/userSlice';

export default ({ navigation }: any): JSX.Element => {
  const [friends, setFriends] = useState(
    useAppSelector(state => state.friends.value),
  );
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(state => state.user.value);
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let unmounted = false;

    const getAllFriends = async () => {
      console.log('getAllFriends');
      setLoading(true);
      if (!user.uid) {
        showToast("Unknown error, please sign-in again", 'error');
        navigation.navigate('Hello');
      }
      if (friends === null || friends === undefined) {
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
          setFriends(data.reverse());
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      }
      setLoading(false);
    };
    if (!unmounted) {
      getAllFriends();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid, friends, navigation]);

  const updateUserData = async () => {
    try {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/users/' +
        user.uid;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const userJson = {
        uid: data.attribute_values.id,
        username: data.attribute_values.username,
        email: data.attribute_values.email,
        photo: data.attribute_values.photo,
        posts: data.attribute_values.posts,
        friends: data.attribute_values.friends,
      };
      dispatch(changeUser(userJson));
      storeData(userJson);
      try {
        const url2 =
          'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/friends/' +
          user.uid;
        const response2 = await fetch(url2, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data2 = await response2.json();
        setFriends(data2.reverse());
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
      setRefreshing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const goToFriendDetails = friend => {
    dispatch(changeFriend(friend));
    navigation.navigate('Friend');
  };

  const copyFriendLink = () => {
    const urlToCopy = `https://opiskelija-appi.web.app/qr?uid=${user.uid}`;
    Clipboard.setString(urlToCopy);
    showToast('Linkki kopioitu leikepöydälle', 'success');
  };
  const width = Dimensions.get('window').width;

  const FriendListItem = ({ item }: { item: Friend }) => (
    <TouchableOpacity onPress={() => goToFriendDetails(item.attribute_values)}>
      <View style={{ alignItems: 'center', marginVertical: 5 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: colors.card,
            width: width - 30,
            padding: 20,
            alignItems: 'center',
          }}>
          <Image
            style={{ width: 50, height: 50, borderRadius: 25 }}
            source={{ uri: item.attribute_values.photo }}
          />
          <View>
            <Text>{item.attribute_values?.username}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const { colors } = useTheme();
  return (
    <SafeAreaView>
      <View>
        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 1,
                  padding: 20,
                }}>
                <TouchableOpacity onPress={() => navigation.navigate('QR')}>
                  <View style={{ width: 100, alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faQrcode} size={30} color="#FFF" />
                    <Text>Avaa sinun QR</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('QrReader')}>
                  <View style={{ width: 100, alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faCamera} size={30} color="#FFF" />
                    <Text>Skannaa QR</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => copyFriendLink()}>
                  <View style={{ width: 100, alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faShare} size={30} color="#FFF" />
                    <Text>Jaa kaverilinkki</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <FlatList
                data={friends}
                keyExtractor={item => item.attribute_values.id}
                renderItem={FriendListItem}
                ListEmptyComponent={() => (
                  <View
                    style={{
                      flex: 1,
                      marginTop: 20,
                    }}>
                    <Text style={styles.emptyText}>
                      Sinulla ei ole vielä yhtään kavereita 🥺
                    </Text>
                    <Text style={styles.emptyText}>
                      Lisää kaverisi klikkaamalla yläpuolelta olevaa painiketta
                    </Text>
                  </View>
                )}
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  updateUserData();
                }}
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 20,
    marginRight: 10,
  },
});
