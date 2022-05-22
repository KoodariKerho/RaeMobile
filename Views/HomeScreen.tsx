import {View, Text, Button} from 'react-native';
import React from 'react';

export default ({navigation}: any): JSX.Element => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Friends')}
      />
    </View>
  );
};
