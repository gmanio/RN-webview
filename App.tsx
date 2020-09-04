import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, BackHandler, SafeAreaView, StyleSheet } from 'react-native';
import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import AsyncStorageHelper from './utils/AsyncStorageHelper';
import PushNotificator from './PushNotificator';

const App = () => {
  const [uri, setUri] = React.useState('https://mart.baemin.com');
  const [pathName, setPathName] = React.useState('/');
  const [canGoBack, setCanGoBack] = React.useState(false);
  const canGoBackRef = React.useRef(canGoBack);
  const webviewRef: React.RefObject<WebView> = React.useRef(null);
  const jsCode = `
    var title = document.querySelector("title");
    var observer = new MutationObserver(function(mutations) {
      window.ReactNativeWebView.postMessage(window.location.pathname);
    });
    var config = {
       childList: true,
       subtree: true
    };

   observer.observe(title, config);
  `;

  const handleClickBackButton = () => {
    if (canGoBackRef.current) {
      webviewRef.current && webviewRef.current.goBack();
    }

    if (canGoBackRef.current == false && pathName === '/') {
      Alert.alert(
        '알림',
        '앱을 종료하시겠습니까?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed')
          },
          { text: 'OK', onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: false }
      );
    }
    return true;
  };

  const handleWebViewNavigationStateChange = (navState: WebViewNavigation) => {
  };

  const handleReceivePostMessage = async (event: WebViewMessageEvent) => {
    const { data, canGoBack } = event.nativeEvent;
    setPathName(data);
    setCanGoBack(canGoBack);
  };

  React.useEffect(() => {
    console.log('[App]: DidComponentMounted!!!');
    // this is for android.
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleClickBackButton);

    if (AsyncStorageHelper.getData()) {
      Alert.alert(`saved Session : ${AsyncStorageHelper.getData()}`)
    } else {
      AsyncStorageHelper.storeData(`sessionIDDDDDDDDDDD`);
    }

    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    canGoBackRef.current = canGoBack;
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto'/>
      <PushNotificator setUri={setUri}/>
      <WebView
        ref={webviewRef}
        source={{ uri }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        sharedCookiesEnabled={true}
        injectedJavaScript={jsCode}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onMessage={handleReceivePostMessage}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: getStatusBarHeight()
  }
});
