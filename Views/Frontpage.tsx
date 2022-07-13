import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  Text,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import React, {useState} from 'react';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';
import {useAppDispatch} from '../hooks';
import {changeUser} from '../features/userSlice';
import {useTheme} from '@react-navigation/native';
import showToast from '../utils/toaster';
import Toast from 'react-native-toast-message';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const dispatch = useAppDispatch();

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }
    const data = await auth().signInWithEmailAndPassword(email, password);
    const url =
      'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/users/' +
      data.user.uid;
    const responseUser = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const dataUser = await responseUser.json();
    dispatch(
      changeUser({
        uid: data.user.uid,
        username: dataUser.attribute_values.username,
        email: data.user.email,
        photo: dataUser.attribute_values.photo,
        friends: [],
        posts: [],
      }),
    );
    navigation.navigate('AppTabs');
  };

  const signInWithEmailAndPassword = async () => {
    if (email.length === 0 || password.length === 0 || username.length === 0) {
      showToast('Please enter email, username and password', 'error');
      return;
    }
    toggleModal();
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        const url =
          'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/create-user/' +
          data.user.uid;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: data.user.uid,
            username: username,
            email: data.user.email,
            photo:
              'https://firebasestorage.googleapis.com/v0/b/opiskelija-appi.appspot.com/o/logoteal.png?alt=media&token=a32ea342-c941-4e69-ab19-bcf02b3d4000',
            friends: [],
            posts: [],
          }),
        });
        dispatch(
          changeUser({
            uid: data.user.uid,
            username: username,
            email: data.user.email,
            photo:
              'https://firebasestorage.googleapis.com/v0/b/opiskelija-appi.appspot.com/o/logoteal.png?alt=media&token=a32ea342-c941-4e69-ab19-bcf02b3d4000',
            friends: [],
            posts: [],
          }),
        );
        showToast('Registration successful', 'success');
        navigation.navigate('AppTabs');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          showToast('That email address is already in use!', 'error');
        }

        if (error.code === 'auth/invalid-email') {
          showToast('That email address is invalid!', 'error');
        }
      });
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.configure({
        webClientId:
          '401983017906-35srab4is73n47u6vq9vjkjofd5au1cl.apps.googleusercontent.com',
      });

      const data = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );
      const firebaseUserCredential = await auth().signInWithCredential(
        credential,
      );
      setUser(firebaseUserCredential.user);
      dispatch(
        changeUser({
          uid: firebaseUserCredential.user.uid,
          username: firebaseUserCredential.user.displayName,
          email: firebaseUserCredential.user.email,
          photo: firebaseUserCredential.user.photoURL,
          friends: [],
          posts: [],
        }),
      );
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/create-user/' +
        firebaseUserCredential.user.uid;
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: firebaseUserCredential.user.uid,
          username: firebaseUserCredential.user.displayName,
          email: firebaseUserCredential.user.email,
          photo: firebaseUserCredential.user.photoURL,
          friends: [],
          posts: [],
        }),
      });
      setLoading(false);
      navigation.navigate('AppTabs');
    } catch (error) {
      showToast('Unexpected error in Google login', 'error');
      setLoading(false);
    }
  };

  const Button = children => {
    return (
      <TouchableOpacity onPress={children.onPress}>
        <Text style={{color: 'white'}}>{children.title}</Text>
      </TouchableOpacity>
    );
  };

  const height = Dimensions.get('window').height;

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          {loading ? (
            <View>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <View style={{height: height}}>
              <Image
                source={{
                  uri: 'https://firebasestorage.googleapis.com/v0/b/opiskelija-appi.appspot.com/o/logoteal.png?alt=media&token=a32ea342-c941-4e69-ab19-bcf02b3d4000',
                }}
                style={styles.image}
              />
              <View style={styles.fields}>
                <TextInput
                  style={styles.input}
                  onChangeText={e => setEmail(e)}
                  value={email}
                  placeholder="Email"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={e => setPassword(e)}
                  value={password}
                  placeholder="Password"
                  textContentType="password"
                  secureTextEntry={true}
                />
                <TouchableOpacity onPress={handleLogin}>
                  <Text
                    style={{
                      color: '#14B8A6',
                      fontSize: 18,
                      textDecorationLine: 'underline',
                    }}>
                    Kirjaudu sisään
                  </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: 'white',
                      marginLeft: 20,
                    }}
                  />
                  <View>
                    <Text
                      style={{
                        color: 'white',
                        marginVertical: 30,
                        width: 50,
                        textAlign: 'center',
                      }}>
                      Tai
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: 'white',
                      marginRight: 20,
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={() => signInWithGoogle()}>
                  <Image source={require('../pics/google_signin_light.png')} />
                </TouchableOpacity>

                <Modal
                  isVisible={modalVisible}
                  backdropOpacity={0.9}
                  onBackdropPress={() => setModalVisible(false)}
                  hasBackdrop={true}
                  backdropColor={colors.card}
                  onBackButtonPress={toggleModal}>
                  <Toast />
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      style={styles.input}
                      onChangeText={e => setUserName(e)}
                      value={username}
                      placeholder="Username"
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={e => setEmail(e)}
                      value={email}
                      placeholder="Email"
                      textContentType="emailAddress"
                      keyboardType="email-address"
                    />
                    <TextInput
                      style={styles.input}
                      onChangeText={e => setPassword(e)}
                      value={password}
                      placeholder="Password"
                      textContentType="password"
                      secureTextEntry={true}
                    />

                    <Button
                      title="Register"
                      onPress={signInWithEmailAndPassword}
                    />
                  </View>
                </Modal>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 20,
                  }}>
                  <Text
                    style={{
                      color: colors.text,
                      marginRight: 10,
                      fontSize: 18,
                    }}>
                    Ei vielä tiliä?
                  </Text>
                  <TouchableOpacity onPress={toggleModal}>
                    <Text
                      style={{
                        color: '#14B8A6',
                        fontSize: 18,
                        textDecorationLine: 'underline',
                      }}>
                      Rekisteröidy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#a0a1a3',
    borderRadius: 20,
    width: '80%',
  },
  fields: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
  },
  image: {
    width: '25%',
    height: '25%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  googleButton: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
