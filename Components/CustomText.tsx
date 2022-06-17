import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

export default (props): JSX.Element => {
  const {colors} = useTheme();
  return (
    <View>
      <Text style={{color: colors.text}}>{props.children}</Text>
    </View>
  );
};
