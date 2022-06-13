import {View, Text} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

export default (text: {
  children:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal
    | null
    | undefined;
}): JSX.Element => {
  const {colors} = useTheme();

  return (
    <View>
      <Text style={{color: colors.text}}>{text.children}</Text>
    </View>
  );
};
