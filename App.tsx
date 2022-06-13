import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
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
import {useColorScheme} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faExclamationCircle,
  faHome,
  faCalendar,
  faUserFriends,
  faPerson,
  faQrcode,
  faCamera,
} from '@fortawesome/free-solid-svg-icons';
const DarkTheme = {
  dark: true,
  colors: {
    primary: '#8a0099',
    background: '#121212',
    card: '#1F1F1F',
    text: '#FFFFFF',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
const DefaultTheme = {
  dark: true,
  colors: {
    primary: '#8a0099',
    background: '#121212',
    card: '#1F1F1F',
    text: '#FFFFFF',
    border: 'rgb(199, 199, 204)',
    notification: 'rgb(255, 69, 58)',
  },
};
const App = () => {
  const Tab = createBottomTabNavigator();
  const scheme = useColorScheme();
  const Stack = createNativeStackNavigator();
  function AppTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <FontAwesomeIcon
                color={scheme === 'dark' ? '#000000' : '#FFFFFF'}
                icon={faHome}
                style={{width: 20, height: 20}}
              />
            ),
          }}
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <FontAwesomeIcon
                color={scheme === 'dark' ? '#000000' : '#FFFFFF'}
                icon={faCalendar}
                style={{width: 20, height: 20}}
              />
            ),
          }}
          name="Events"
          component={Events}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <FontAwesomeIcon
                color={scheme === 'dark' ? '#000000' : '#FFFFFF'}
                icon={faUserFriends}
                style={{width: 20, height: 20}}
              />
            ),
          }}
          name="Friends"
          component={Friends}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <FontAwesomeIcon
                color={scheme === 'dark' ? '#000000' : '#FFFFFF'}
                icon={faPerson}
                style={{width: 20, height: 20}}
              />
            ),
          }}
          name="Profile"
          component={Profile}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <FontAwesomeIcon
                color={scheme === 'dark' ? '#000000' : '#FFFFFF'}
                icon={faQrcode}
                style={{width: 20, height: 20}}
              />
            ),
          }}
          name="QR"
          component={GenerateQr}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarIcon: () => (
              <FontAwesomeIcon
                icon={faCamera}
                color={scheme === 'dark' ? '#000000' : '#FFFFFF'}
                style={{width: 20, height: 20}}
              />
            ),
          }}
          name="QrReader"
          component={QrReader}
        />
      </Tab.Navigator>
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator initialRouteName="Front">
          <Stack.Screen name="Hello" component={Frontpage} />
          <Stack.Screen name="Friend" component={Friend} />
          <Stack.Screen name="Eventdetails" component={EventDetails} />
          <Stack.Screen
            options={{headerShown: false}}
            name="AppTabs"
            component={AppTabs}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
