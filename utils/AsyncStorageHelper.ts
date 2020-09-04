import AsyncStorage from '@react-native-community/async-storage';

const SESSION_KEY = '_ceo_v2_gk_sid';

export default class AsyncStorageHelper {
  public static storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem(SESSION_KEY, value)
    } catch (e) {
      // saving error
    }
  };

  public static getData = async () => {
    try {
      const value = await AsyncStorage.getItem(SESSION_KEY);
      if (value !== null) {
        return value;
      }
      return '';
    } catch (e) {
      // error reading value
      return '';
    }
  };
}
