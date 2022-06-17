import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

export default (data: {title: string}): JSX.Element => {
  const {colors} = useTheme();

  return (
    <View>
      <TouchableOpacity>
        <Text style={{color: colors.text}}>{data.title}</Text>
      </TouchableOpacity>
    </View>
  );
};
