import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Text, View, Alert, Platform, StyleSheet } from 'react-native';
import * as React from 'react';
import { Subscription } from '@unimodules/react-native-adapter';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

const styles = StyleSheet.create({
  baseText: {
    fontSize: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
// https://docs.expo.io/versions/latest/sdk/notifications/
// https://expo.io/notifications
// https://docs.expo.io/push-notifications/sending-notifications/ push multiple guide

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  }),
});

type Props = {
  setUri: Dispatch<SetStateAction<string>>;
}

const PushNotificator = (props: Props) => {
  const [expoPushToken, setExpoPushToken] = React.useState<string>('');
  const [notification, setNotification] = React.useState<Notifications.Notification>();
  const notificationListener = React.useRef<Subscription>();
  const responseListener = React.useRef<Subscription>();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token: string | undefined) => {
      token && setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      const url = response.notification.request.content.data.link;
      Alert.alert(
        'Received Notification',
        String(url),
        [
          { text: 'Ask me later', onPress: () => console.log('Ask me later pressed') },
          { text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
          { text: '이동', onPress: () => props.setUri(String(url)) },
        ]);
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    }
  }, []);

  return (
    <View style={{
      maxHeight: 15,
      flex: 1,
      justifyContent: 'flex-start'
    }}>
      <Text style={styles.baseText}>{expoPushToken}</Text>
    </View>
  );
};

async function registerForPushNotificationsAsync () {
  let token;

  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export default PushNotificator;
