import {
  View,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../hooks';
import {Friend} from '../models/types';
import {changeFriend} from '../features/friendSlice';
import Text from '../Components/CustomText';
import Clipboard from '@react-native-community/clipboard';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faQrcode, faShare} from '@fortawesome/free-solid-svg-icons';
import showToast from '../utils/toaster';

export default ({navigation}: any): JSX.Element => {
  const [friends, setFriends] = useState(
    useAppSelector(state => state.friends.value),
  );
  const [loading, setLoading] = useState(false);
  const user = useAppSelector(state => state.user.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let unmounted = false;

    const getAllFriends = async () => {
      setLoading(true);
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
          console.log(data);
        } catch (error) {
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
  }, [user.uid, friends]);

  const goToFriendDetails = friend => {
    dispatch(changeFriend(friend));
    navigation.navigate('Friend');
  };

  const copyFriendLink = () => {
    const urlToCopy = `https://opiskelija-appi.web.app/qr?uid=${user.uid}`;
    Clipboard.setString(urlToCopy);
    showToast('Linkki kopioitu leikep??yd??lle', 'success');
  };
  const width = Dimensions.get('window').width;

  const FriendListItem = ({item}: {item: Friend}) => (
    <TouchableOpacity onPress={() => goToFriendDetails(item.attribute_values)}>
      <View style={{alignItems: 'center', marginVertical: 5}}>
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
            style={{width: 50, height: 50, borderRadius: 25}}
            source={{uri: item.attribute_values.photo}}
          />
          <View>
            <Text>{item.attribute_values?.username}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const {colors} = useTheme();
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
                  <View style={{width: 100, alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faQrcode} size={30} color="#FFF" />
                    <Text>Avaa sinun QR</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('QrReader')}>
                  <View style={{width: 100, alignItems: 'center'}}>
                    <FontAwesomeIcon icon={faCamera} size={30} color="#FFF" />
                    <Text>Skannaa QR</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => copyFriendLink()}>
                  <View style={{width: 100, alignItems: 'center'}}>
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
                      Sinulla ei ole viel?? yht????n kavereita ????
                    </Text>
                    <Text style={styles.emptyText}>
                      Lis???? kaverisi klikkaamalla yl??puolelta olevaa painiketta
                    </Text>
                  </View>
                )}
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
