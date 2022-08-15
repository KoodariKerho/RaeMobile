import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useAppSelector} from '../hooks';
import Modal from 'react-native-modal';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const user = useAppSelector(state => state.user.value);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [friendData, setFriend] = useState({
    photo: '',
    username: '',
    email: null,
  });
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [alreadyFriend, setIsAlreadyFriend] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const getUserData = async (friendId: string) => {
    const url =
      'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/users/' +
      friendId;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setFriend(data.attribute_values);
    return data;
  };

  const addFriend = async (friendId: string) => {
    const url =
      'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/add-friend/' +
      user.uid +
      '/' +
      friendId;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    //This status code is harcoded in the backend :D for luls
    if (data.status_code === 418) {
      return true;
    }
    return false;
    //Show toast if succes and if error
  };

  const onSuccess = async (e: {data: any}) => {
    try {
      const friendId = e.data;
      const isAlreadyFriend = await addFriend(friendId);
      if (isAlreadyFriend) {
        setIsAlreadyFriend(true);
        setErrorVisible(true);
        return;
      }
      setErrorVisible(false);
      getUserData(friendId);

      //Show modal with friend data and navigation button to home
      toggleModal();
    } catch {
      //Show toast when error
    }
  };
  return (
    <SafeAreaView>
      <View>
        <View>
          {errorVisible ? (
            <Text>ALREADY A FRIEND</Text>
          ) : (
            <View>
              <QRCodeScanner
                onRead={onSuccess}
                topContent={
                  <Text style={styles.centerText}>
                    Go to{' '}
                    <Text style={styles.textBold}>
                      wikipedia.org/wiki/QR_code
                    </Text>{' '}
                    on your computer and scan the QR code.
                  </Text>
                }
                bottomContent={
                  <TouchableOpacity style={styles.buttonTouchable}>
                    <Text style={styles.buttonText}>OK. Got it!</Text>
                  </TouchableOpacity>
                }
              />
            </View>
          )}
        </View>
        <View>
          <Modal
            isVisible={modalVisible}
            backdropOpacity={0.8}
            hasBackdrop={true}
            backdropColor={'black'}
            onBackButtonPress={toggleModal}>
            {alreadyFriend ? (
              <Text>Already friend</Text>
            ) : (
              <View>
                <Text>Kaveri lisätty!</Text>
                <Image
                  source={{uri: friendData?.photo}}
                  style={{width: 50, height: 50, borderRadius: 100}}
                />
                <Text>{friendData.username}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Text>Takaisin kotiin</Text>
                </TouchableOpacity>
              </View>
            )}
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});
