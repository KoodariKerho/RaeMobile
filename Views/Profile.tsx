import {
  View,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';
import {useAppSelector} from '../hooks';
import showToast from '../utils/toaster';

export default (): JSX.Element => {
  const user = useAppSelector(state => state.user.value);
  const [username, setUsername] = useState(user.username);

  const {colors} = useTheme();

  const updateUserData = async () => {
    try {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/update-user/' +
        user.uid;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.uid,
          username: username,
          email: user.email,
          photo: user.photo,
        }),
      });
      const data = await response.json();
      console.log('DATA');
      console.log(data);
      if (data.status_code !== 200) {
        showToast('Cannot update username', 'error');
      } else {
        showToast('Username updated!', 'success');
      }
    } catch (error) {
      console.log(error);
      showToast('Something went wrong', 'error');
    }
  };
  return (
    <View>
      <View style={styles.container}>
        <Image
          source={{uri: user.photo}}
          style={{width: 120, height: 120, borderRadius: 180, marginBottom: 50}}
        />
        <Text>Vaihda käyttäjänimi</Text>
        <TextInput
          style={styles.input}
          onChangeText={e => setUsername(e)}
          value={username}
          placeholder="Username"
          selectTextOnFocus={true}
          autoComplete={'username'}
          maxLength={20}
          onKeyPress={() => updateUserData()}
        />
      </View>
      <TouchableOpacity
        style={{
          alignSelf: 'flex-end',
          marginRight: 40,
          marginTop: 5,
          backgroundColor: colors.primary,
          padding: 10,
          borderRadius: 10,
        }}
        onPress={() => updateUserData()}>
        <Text>Vaihda</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
