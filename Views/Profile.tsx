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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default (): JSX.Element => {
  const user = useAppSelector(state => state.user.value);
  const [username, setUsername] = useState(user.username);
  const [photo, setPhoto] = useState({});
  console.log(user);

  const handleUploadPhoto = () => {
    fetch(
      'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/uploadfile',
      {
        method: 'POST',
        body: createFormData({userId: '123'}),
      },
    )
      .then(response => response.json())
      .then(response => {
        console.log('response', response);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const createFormData = (body = {}) => {
    const data = new FormData();

    data.append('photo', {
      name: photo.fileName,
      type: photo.type,
      uri: photo.uri,
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });

    return data;
  };

  const options = {
    mediaType: 'photo',
    quality: 1,
    cameraType: 'back',
    includeBase64: true,
  };
  const takePhoto = async () => {
    const result = await launchCamera(options);
    setPhoto(result);
    handleUploadPhoto();
    console.log(result);
  };
  const pickImage = async () => {
    const result1 = await launchImageLibrary(options);
    console.log(result1);
  };

  const {colors} = useTheme();
  return (
    <View>
      <Text>Profile</Text>
      <Image
        source={{uri: user.photo}}
        style={{width: 120, height: 120, borderRadius: 180}}
      />
      <TextInput
        style={styles.input}
        onChangeText={e => setUsername(e)}
        value={username}
        placeholder="Username"
        selectTextOnFocus={true}
      />
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
