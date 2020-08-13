import * as React from 'react';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { StyleSheet, SafeAreaView, View, Text, BackHandler, Modal, Button } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import PushNotificator from './PushNotificator';

const App = (props: any) => {
  const [isShowExitModal, setIsShowExitModal] = React.useState(false);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState('');
  const webviewRef: React.RefObject<WebView> = React.useRef(null);

  const handleBackPress = () => {

    if (currentUrl === 'https://mart.baemin.com' || currentUrl === 'https://mart.baemin.com/') {
      setIsShowExitModal(true);
      // BackHandler.exitApp();
    }

    webviewRef.current!.goBack();
    return true;
  }

  const handleWebViewNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setCurrentUrl(navState.url);
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{ uri: 'https://mart.baemin.com' }}
        ref={webviewRef}
        onNavigationStateChange={handleWebViewNavigationStateChange}
      />
      <Modal
        transparent={true}
        visible={isShowExitModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>앱을 종료하시겠습니까?</Text>
            <View style={styles.modalButtonWrapper}>
              <Button
                title='취소'
                color='#f194ff'
                onPress={() => setIsShowExitModal(false)}/>
              <Button
                title='종료'
                color='#f194ff'
                onPress={() => BackHandler.exitApp()}/>
            </View>
          </View>
        </View>
      </Modal>
      <PushNotificator webviewRef={webviewRef}/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: getStatusBarHeight()
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: 300,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 2,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
  modalButtonWrapper: {
    width: 300,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 2,
    flex: 1,
    justifyContent: 'space-between'
  },
  modalButton: {

  }
});

export default App;
