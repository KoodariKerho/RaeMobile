import {View} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';
import Text from '../Components/CustomText';

export default (): JSX.Element => {
  const {colors} = useTheme();
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
};
