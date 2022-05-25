import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
} from 'react-native';
import React, {useState} from 'react';
import auth, {firebase, FirebaseAuthTypes} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Modal from 'react-native-modal';
import {useAppSelector, useAppDispatch} from '../hooks';
import {changeUser} from '../features/userSlice';

export default ({navigation}: any): JSX.Element => {
  const dispatch = useAppDispatch();

  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

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
        navigation.navigate('Home');
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
        navigation.navigate('Home');
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
    console.log('signInWithGoogle');
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
    navigation.navigate('Home');
  };

  return (
    <View>
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
        backdropOpacity={0.8}
        onBackdropPress={() => setModalVisible(false)}
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Sign up" onPress={toggleModal} />
      <TouchableOpacity onPress={() => signInWithGoogle()}>
        <Text>This will be goolge button </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
