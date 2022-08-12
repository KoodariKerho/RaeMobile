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
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth, {firebase} from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';
import {useAppDispatch} from '../hooks';
import {changeUser} from '../features/userSlice';
import {useTheme} from '@react-navigation/native';
import showToast from '../utils/toaster';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppleButton} from '@invertase/react-native-apple-authentication';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const storeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let unmounted = false;
    const checkIfUserIsLoggedIn = async () => {
      const data = await getData();
      console.log(data);
      if (data) {
        dispatch(changeUser(data));
        navigation.navigate('AppTabs');
      }
    };
    if (!unmounted) {
      checkIfUserIsLoggedIn();
    }
    return () => {
      unmounted = true;
    };
  }, [dispatch, navigation]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }
    try {
      const data = await auth().signInWithEmailAndPassword(email, password);
      const response = await fetch(
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/users/' +
          data.user.uid,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const userData = await response.json();
      const user = {
        uid: data.user.uid,
        email: data.user.email,
        username: userData.attribute_values.username,
        photo: userData.attribute_values.photo,
        friends: userData.attribute_values.friends,
        posts: userData.attribute_values.posts,
      };
      storeData(user);
      dispatch(changeUser(user));
      navigation.navigate('AppTabs');
    } catch (error: unknown) {
      if (error.code === 'auth/user-not-found') {
        showToast('User not found', 'error');
      } else if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-email'
      ) {
        showToast('Wrong username or password', 'error');
      } else {
        showToast(error.message, 'error');
      }
    }
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
        const user = {
          uid: data.user.uid,
          username: username,
          email: data.user.email,
          photo:
            'https://firebasestorage.googleapis.com/v0/b/opiskelija-appi.appspot.com/o/logoteal.png?alt=media&token=a32ea342-c941-4e69-ab19-bcf02b3d4000',
          friends: [],
          posts: [],
        };
        storeData(user);
        dispatch(changeUser(user));
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
        console.error(error);
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
      console.log('data', data);
      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );
      console.log('credential', credential);
      const firebaseUserCredential = await auth().signInWithCredential(
        credential,
      );
      console.log('firebaseUserCredential', firebaseUserCredential.user);
      const urlAPI =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/users/' +
        firebaseUserCredential.user.uid;
      console.log('urlAPI', urlAPI);
      try {
        const response = await fetch(urlAPI, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const userData = await response.json();
        console.log('userData', userData);
        const user = {
          uid: firebaseUserCredential.user.uid,
          email: firebaseUserCredential.user.email,
          username: userData.attribute_values.username,
          photo: userData.attribute_values.photo,
          friends: userData.attribute_values.friends,
          posts: userData.attribute_values.posts,
        };
        console.log('user try', user);
        storeData(user);
        dispatch(changeUser(user));
        navigation.navigate('AppTabs');
      } catch (error) {
        console.log(error);
        const urlCreate =
          'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/create-user/' +
          firebaseUserCredential.user.uid;
        fetch(urlCreate, {
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
        const user = {
          uid: firebaseUserCredential.user.uid,
          username: firebaseUserCredential.user.displayName,
          email: firebaseUserCredential.user.email,
          photo: firebaseUserCredential.user.photoURL,
          friends: [],
          posts: [],
        };
        console.log('userCatch', user);
        storeData(user);
        dispatch(changeUser(user));
        navigation.navigate('AppTabs');
      }
      setLoading(false);

      navigation.navigate('AppTabs');
    } catch (error) {
      console.log(error);
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

  async function onAppleButtonPress() {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const {identityToken, nonce} = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // Sign the user in with the credential
      const signAut = auth().signInWithCredential(appleCredential);
      console.log('signAut', signAut);
    } catch (error) {
      console.log(error);
    }
  }

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
                <View>
                  {Platform.OS === 'ios' && (
                    <AppleButton
                      buttonStyle={AppleButton.Style.WHITE}
                      buttonType={AppleButton.Type.SIGN_IN}
                      style={{
                        width: 160,
                        height: 45,
                      }}
                      onPress={() =>
                        onAppleButtonPress().then(() =>
                          navigation.navigate('AppTabs'),
                        )
                      }
                    />
                  )}
                </View>

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
