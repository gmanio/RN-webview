import * as React from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { StyleSheet, SafeAreaView, ActivityIndicator, BackHandler } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PushNotificator from './PushNotificator';

const App = (props: any) => {
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState('');
  const webviewRef: React.RefObject<WebView> = React.useRef(null);

  const handleBackPress = () => {
    webviewRef.current!.goBack();

    // if (!canGoBack) {
    //   alert('더이상 뒤로 갈수 없음 TODO: 종료하기');
    // }
    return true;
  }

  const handleWebViewNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
    debugger;
    console.dir(navState);
    

    // alert(navState.url);
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        originWhitelist={['*']}
        sharedCookiesEnabled={true}
        source={{ uri: 'https://mart.baemin.com' }}
        renderLoading={() => (
          <ActivityIndicator
            color='black'
            size='large'
            style={styles.container}
          />
        )}
        ref={webviewRef}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
      <PushNotificator webviewRef={webviewRef}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: getStatusBarHeight()
  }
});

export default App;
