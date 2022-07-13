import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Dimensions,
  Text,
  TextInput,
  Button,
  Pressable,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useAppSelector} from '../hooks';
import {useAppDispatch} from '../hooks';
import {changeFriend} from '../features/friendSlice';
import {Friend} from '../models/types';
import {changeEvent} from '../features/eventSlice';
import {changeUser} from '../features/userSlice';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default ({navigation}: any): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.value);
  const [friendsEvents, setFriendsEvents] = useState([]);

  useEffect(() => {
    let unmounted = false;
    const getFriendEvents = async () => {
      const url =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/friends-events/' +
        user.uid;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setFriendsEvents(data.reverse());
    };
    if (!unmounted) {
      getFriendEvents();
    }
    return () => {
      unmounted = true;
    };
  }, [user.uid, user]);

  const goToFriendProfile = (friend: Friend) => {
    dispatch(changeFriend(friend));
    navigation.navigate('Friend');
  };

  const goToEventDetails = event => {
    dispatch(changeEvent(event));
    navigation.navigate('Eventdetails');
  };

  const postComment = async (post, comment) => {
    try {
      const url2 =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/users/' +
        user.uid;
      const responseUser = await fetch(url2, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const dataUser = await responseUser.json();

      const awsPostUrl =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/post-comment/' +
        post.user.attribute_values.id +
        '/' +
        post.event.id;

      await fetch(awsPostUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: comment,
          username: dataUser.attribute_values.username,
          photo: dataUser.attribute_values.photo,
          userId: user.uid,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const Item = ({post}: any) => {
    const url = `https://portalvhdsp62n0yt356llm.blob.core.windows.net/bailataan-mediaitems/${post.event.mediaFilename}`;
    const [comments, setComments] = useState<object[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [toggleText, setToggleText] = useState('Näytä kaikki kommentit');
    const [commentersText, setCommentersText] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [sendCount, setSendCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);

    const getComments = async post => {
      const awsUrl =
        'https://hlw2l5zrpk.execute-api.eu-north-1.amazonaws.com/dev/get-comments/' +
        post.user.attribute_values.id +
        '/' +
        post.event.id;
      try {
        const response = await fetch(awsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setComments(data);
        setCommentCount(data.length);
        setCommentersText(data.length + ' kommenttia');
      } catch (e) {
        console.log(e);
        setComments([]);
        setCommentCount(0);
      }
    };

    useEffect(() => {
      let unmounted = false;
      if (!unmounted) {
        getComments(post);
      }
      return () => {
        unmounted = true;
      };
    }, [post]);

    const onRefresh = async () => {
      setIsFetching(true);
      await getComments(post);
      setIsFetching(false);
    };

    return (
      <View>
        <View style={styles.mainContainer}>
          <TouchableOpacity onPress={() => goToEventDetails(post.event)}>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => goToFriendProfile(post.user.attribute_values)}>
                  <View style={styles.flexrow}>
                    <Image
                      style={styles.profilepic}
                      source={{uri: post.user.attribute_values.photo}}
                    />
                    <View style={styles.justifycenter}>
                      <Text style={styles.userText}>
                        {post.user.attribute_values.username}
                      </Text>
                      <Text style={styles.timestampText}>18.05.22</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{display: 'flex', flexDirection: 'column'}}>
                <Text style={styles.eventName}>{post.event.name}</Text>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                  <Text style={styles.descText}>{post.event.companyName}</Text>
                  <Text style={styles.descText}> @ {post.event.place}</Text>
                </View>
              </View>
            </View>

            <View style={{alignItems: 'center'}}>
              <Image
                style={styles.eventpic}
                source={{
                  uri: url,
                }}
              />
            </View>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setShowComments(!showComments);
                  setToggleText('Piilota kommentit');
                }}>
                <Text style={{color: 'white', marginTop: 20}}>
                  {commentersText}
                </Text>
                <Text style={{color: 'white'}}>{toggleText}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setShowComments(!showComments)}
              style={{position: 'absolute', bottom: 10, right: 15}}>
              <Text style={{color: 'white'}}>Kommentoi</Text>
            </TouchableOpacity>
          </View>
          <View>
            {showComments && (
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 60,
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    style={styles.comment}
                    onChangeText={e => {
                      setComment(e);
                      console.log(e);
                    }}
                    placeholder="Kommentoi"
                    placeholderTextColor="white"
                    returnKeyType="send"
                    onSubmitEditing={() => postComment(post, comment)}
                    value={comment}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      postComment(post, comment);
                      setComment('');
                      setSendCount(sendCount + 1);
                      var newArray = [
                        ...comments,
                        {
                          comment: comment,
                          username: user.username,
                          photo: user.photo,
                          userId: user.uid,
                        },
                      ];
                      setComments(newArray);
                    }}
                    style={styles.sendButton}>
                    <Text style={{color: 'white'}}>Lähetä</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={comments}
                  extraData={comments}
                  onRefresh={onRefresh}
                  refreshing={isFetching}
                  renderItem={({item}: any) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderColor: '#4a4949',
                        borderWidth: 1,
                        margin: 3,
                        padding: 7,
                      }}>
                      <View
                        style={{
                          alignContent: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          style={styles.profilepic}
                          source={{uri: item.photo}}
                        />
                        <Text style={{color: 'white', alignSelf: 'center'}}>
                          {item.username}
                        </Text>
                      </View>
                      <View style={styles.justifycenter}>
                        <Text style={styles.userText}>{item.comment}</Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={item => item.comment}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({item}: any) => <Item post={item} />;

  return (
    <View style={styles.container}>
      <View>
        <SafeAreaView style={styles.container}>
          <FlatList
            data={friendsEvents}
            renderItem={renderItem}
            keyExtractor={item => item.user.attribute_values.id + item.event.id}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                }}>
                <Text style={styles.emptyText}>
                  Kavereilla ei ole vielä yhtään tapahtumaa. 🥺
                </Text>
                <Text style={styles.emptyText}>
                  Lisää kavereita "Kaverit" välilehdellä
                </Text>
              </View>
            )}
            ListHeaderComponent={() => (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <Text style={styles.headerText}>Kavereiden tapahtumat</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  flexrow: {
    display: 'flex',
    flexDirection: 'row',
  },
  mainContainer: {
    borderWidth: 1,
    borderColor: '#4a4949',
    backgroundColor: '#202020',
    borderRadius: 10,
    width: width - 20,
    margin: 10,
    shadowColor: '#4a4949',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  emptyText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    color: '#FFF',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#FFF',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginRight: 10,
    fontSize: 20,
  },
  descText: {
    fontSize: 10,
    color: '#FFF',
    marginVertical: 4,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    color: '#FFF',
  },
  userText: {
    fontSize: 14,
    color: '#FFF',
    width: width * 0.7,
    marginLeft: 5,
    marginRight: 5,
  },
  timestampText: {
    fontSize: 13,
    color: '#595959',
    fontWeight: 'bold',
  },
  eventName: {
    fontWeight: 'bold',
    color: '#FFF',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 10,
    marginRight: 10,
    width: width - 40,
    fontSize: 16,
  },
  justifycenter: {justifyContent: 'center', alignSelf: 'center'},
  profilepic: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    margin: 5,
  },
  eventpic: {
    width: width - 40,
    borderRadius: 10,
    aspectRatio: 16 / 9,
  },
  comment: {
    width: width - 110,
    borderRadius: 10,
    backgroundColor: '#202020',
    color: '#fff',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a4949',
  },
  sendButton: {
    width: 80,
    borderRadius: 10,
    backgroundColor: '#202020',
    color: '#fff',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a4949',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
