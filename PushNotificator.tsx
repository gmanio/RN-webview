import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Alert, Linking } from 'react-native';
import { Subscription } from '@unimodules/core';
import WebView from 'react-native-webview';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  })
});

type Props = {
  webviewRef: React.RefObject<WebView>;
};

export default (props: Props) => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token: string | undefined) => {
      token && setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification: Notifications.Notification) => {
      debugger;
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      const url = response.notification.request.content.data.url;
      Alert.alert(String(url));
      console.log(url);
      const redirectTo = 'window.location = "' + url + '"';
      props?.webviewRef?.current?.injectJavaScript(redirectTo);
    });

    return () => {
      notificationListener && notificationListener.current && notificationListener.current.remove();
      responseListener && responseListener.current && responseListener.current.remove();
    };
  }, []);

  return (
    <View
      style={{
        maxHeight: 0,
        flex: 1,
        alignItems: 'center'
      }}>
      <Button
        title='Press to schedule a notification'
        onPress={async () => {
          Notifications.scheduleNotificationAsync({
            content: {
              title: '배민상회에서 보내는 메시지 📬',
              body: '지금 바로 상품을 확인해보세요!!',
              data: { url: 'goes here' },
            },
            trigger: {
              seconds: 60 * 30,
              repeats: true
            }
          });
        }}
      />
    </View>
  );
}

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
