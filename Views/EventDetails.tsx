import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  useColorScheme,
  Text,
  Linking,
} from 'react-native';
import {useAppSelector} from '../hooks';
import {useTheme} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCalendar,
  faCalendarAlt,
  faCheck,
  faLocationDot,
  faStar,
  faTicket,
} from '@fortawesome/free-solid-svg-icons';
import showToast from '../utils/toaster';

export default ({navigation}: any): JSX.Element => {
  const {colors} = useTheme();
  const event = useAppSelector(state => state.event.value);
  const user = useAppSelector(state => state.user.value);

  const [timeUntilSalesStart, setTimeuntilSalesStart] = useState(0);
  const [timeUntilActual, setTimeuntilActual] = useState(0);
  const [dateActualFrom, setDateActualFrom] = useState('');
  const [dateActualUntil, setDateActualUntil] = useState('');
  const [interested, setIntrested] = useState(0);
  const [going, setGoing] = useState(0);

  const formatDate = (paramDate: string) => {
    const date = new Date(paramDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return day + '.' + month + '.' + year;
  };

  useEffect(() => {
    setTimeuntilSalesStart(Math.round(event.timeUntilSalesStart / 86400));
    setTimeuntilActual(Math.round(event.timeUntilActual / 86400));
    setDateActualFrom(formatDate(event.dateActualFrom));
    setDateActualUntil(formatDate(event.dateActualUntil));
  }, [
    event.timeUntilSalesStart,
    event.timeUntilActual,
    event.dateActualFrom,
    event.dateActualUntil,
  ]);
  useEffect(() => {
    let unmounted = false;
    const getIntrestedAndGoing = async () => {
      const getUrl = `https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/event_attendees_and_interested/${event.id}`;
      const response = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setIntrested(data.total_intrested);
      setGoing(data.total_attendees);
    };
    if (!unmounted) {
      getIntrestedAndGoing();
    }
    return () => {
      unmounted = true;
    };
  }, [event.id]);

  const attendToEvent = async () => {
    try {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/add-post-to-user/' +
        user.uid +
        '/' +
        event.id;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          username: user.username,
          photo: user.photo,
        }),
      });
      const data = await response.json();
      if (data.status_code !== 200) {
        showToast('You are already attending this event', 'error');
      } else {
        showToast('You are now attending this event', 'success');
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    }
  };

  const intrestedInEvent = async () => {
    const body = JSON.stringify({
      userId: user.uid,
      username: user.username,
      photo: user.photo,
    });
    try {
      const intrestedUrl =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/event_interested/' +
        event.id;
      const response = await fetch(intrestedUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      });
      const data = await response.json();
      if (data.status_code !== 200) {
        showToast('You are already interested in this event', 'error');
      } else {
        showToast('You are now intrested in this event', 'success');
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    }
  };

  const scheme = useColorScheme();
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const url = `https://portalvhdsp62n0yt356llm.blob.core.windows.net/bailataan-mediaitems/${event.mediaFilename}`;
  const ticketUrl = 'https://kide.app/events/' + event.id;

  return (
    <View style={{}}>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image
          style={{
            width: width - 40,
            height: height * 0.3 - 20,
            borderRadius: 10,
            marginTop: 10,
          }}
          source={{
            uri: url,
          }}
        />
      </View>
      <View style={{alignItems: 'center', marginTop: 15}}>
        <Text style={{color: colors.text, fontSize: 20}}>{event.name}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 30,
          borderTopColor: '#ccc',
          borderTopWidth: 1,
          paddingTop: 10,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>
        <TouchableOpacity onPress={() => intrestedInEvent()}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <FontAwesomeIcon icon={faStar} color={'white'} size={32} />
            <Text style={{color: colors.text}}>Intrested</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => attendToEvent()}>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <FontAwesomeIcon icon={faCheck} color={'white'} size={32} />
            <Text style={{color: colors.text}}>Going</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginLeft: 10,
        }}>
        <FontAwesomeIcon icon={faCalendar} color={colors.text} size={32} />
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            marginLeft: 10,
            alignSelf: 'flex-end',
          }}>
          {dateActualFrom}-{dateActualUntil}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 20,
          marginLeft: 10,
        }}>
        <FontAwesomeIcon icon={faLocationDot} color={colors.text} size={32} />
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            marginLeft: 10,
            alignSelf: 'flex-end',
          }}>
          {event.place}
        </Text>
      </View>
      <TouchableOpacity onPress={() => Linking.openURL(ticketUrl)}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 20,
            marginLeft: 10,
          }}>
          <FontAwesomeIcon icon={faTicket} color={colors.text} size={32} />
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              marginLeft: 10,
              alignSelf: 'flex-end',
              borderBottomColor: '#ccc',
              borderBottomWidth: 1,
            }}>
            Liput
          </Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 30,
          marginHorizontal: 10,
          borderTopColor: '#ccc',
          borderTopWidth: 1,
          padding: 10,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}>
        <View style={{width: 90}}>
          <Text style={{color: colors.text, fontSize: 15}}>
            Myynti käynnissä?
          </Text>
          <View>
            {event.salesOnGoing ? (
              <Text style={{color: colors.text, fontSize: 18}}>Kyllä</Text>
            ) : (
              <Text
                style={{
                  color: colors.text,
                  fontSize: 22,
                  fontWeight: 'bold',
                }}>
                Ei
              </Text>
            )}
          </View>
        </View>
        <View style={{width: 90}}>
          <Text style={{color: colors.text, fontSize: 15}}>
            Päiviä tapahtumaan
          </Text>
          <Text style={{color: colors.text, fontSize: 18, fontWeight: 'bold'}}>
            {timeUntilActual}
          </Text>
        </View>
        <View style={{width: 90}}>
          <Text style={{color: colors.text, fontSize: 15}}>
            Päiviä myynnin aloitukseen
          </Text>
          <Text style={{color: colors.text, fontSize: 18, fontWeight: 'bold'}}>
            {timeUntilSalesStart}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 10,
        }}>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: colors.text, fontSize: 18}}>Menossa</Text>
          <Text style={{color: colors.text, fontSize: 18}}>{going}</Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: colors.text, fontSize: 18}}>Kiinnostunut</Text>
          <Text style={{color: colors.text, fontSize: 18}}>{interested}</Text>
        </View>
      </View>
    </View>
  );
};
