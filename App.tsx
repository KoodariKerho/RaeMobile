import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from './Views/HomeScreen';
import Frontpage from './Views/Frontpage';
import Friends from './Views/Friends';
import Events from './Views/Events';
import GenerateQr from './Views/GenerateQr';
import Profile from './Views/Profile';
import Friend from './Views/Friend';
import QrReader from './Views/QrReader';
import {Provider} from 'react-redux';
import {store} from './store';
import EventDetails from './Views/EventDetails';

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Front">
          <Stack.Screen name="Front" component={Frontpage} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Friends" component={Friends} />
          <Stack.Screen name="Events" component={Events} />
          <Stack.Screen name="QR" component={GenerateQr} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Friend" component={Friend} />
          <Stack.Screen name="QrReader" component={QrReader} />
          <Stack.Screen name="Eventdetails" component={EventDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
