import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';
import {useAppDispatch} from '../hooks';
import {changeUser} from '../features/userSlice';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const dispatch = useAppDispatch();

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleLogin = async () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(data => {
        console.log('success');
        dispatch(
          changeUser({
            uid: data.user.uid,
            username: data.user.displayName,
            email: data.user.email,
            photo: data.user.photoURL,
            friends: [],
            posts: [],
          }),
        );
        navigation.navigate('AppTabs');
      })
      .catch(error => {
        console.log(error);
      });
  };

  const signInWithEmailAndPassword = async () => {
    console.log('signInWithEmailAndPassword');
    toggleModal();
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(data => {
        console.log(data);
        const url =
          'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/create-user/' +
          data.user.uid;
        console.log(url);
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
            username: data.user.displayName,
            email: data.user.email,
            photo:
              'https://firebasestorage.googleapis.com/v0/b/opiskelija-appi.appspot.com/o/logoteal.png?alt=media&token=a32ea342-c941-4e69-ab19-bcf02b3d4000',
            friends: [],
            posts: [],
          }),
        );
        navigation.navigate('AppTabs');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
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
      console.log(data);
      const credential = firebase.auth.GoogleAuthProvider.credential(
        data.idToken,
        data.accessToken,
      );
      console.log(credential);
      const firebaseUserCredential = await auth().signInWithCredential(
        credential,
      );
      console.log(firebaseUserCredential.user);
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
      console.log(url);
      const response = await fetch(url, {
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
      console.log(response);
      setLoading(false);
      navigation.navigate('AppTabs');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const Button = children => {
    return (
      <TouchableOpacity onPress={children.onPress}>
        <Text>{children.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View style={styles.fields}>
            <Image
              source={{
                uri: 'https://firebasestorage.googleapis.com/v0/b/opiskelija-appi.appspot.com/o/logoteal.png?alt=media&token=a32ea342-c941-4e69-ab19-bcf02b3d4000',
              }}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => signInWithGoogle()}>
              <Image source={require('../pics/google_signin_light.png')} />
            </TouchableOpacity>

            <Text>Tai</Text>
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
            <Modal
              isVisible={modalVisible}
              backdropOpacity={0.9}
              onBackdropPress={() => setModalVisible(false)}
              hasBackdrop={true}
              backdropColor={colors.card}
              onBackButtonPress={toggleModal}>
              <View style={{flex: 1}}>
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

                <Button title="Register" onPress={signInWithEmailAndPassword} />
              </View>
            </Modal>
            <Button title="Kirjaudu sisään" onPress={handleLogin} />
            <Text>Ei vielä tiliä?</Text>
            <Button title="Rekisteröidy" onPress={toggleModal} />
          </View>
        )}
      </View>
    </View>
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
  },
  image: {
    width: '20%',
    height: '20%',
    resizeMode: 'contain',
  },
  googleButton: {
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
