import { Platform } from 'react-native';
import { check, request as requestPermission, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const requestPhotoLibraryPermission = async () => {
    console.log('request perms');
    if (Platform.OS === 'ios') {
        const result1 = await requestPermission(PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY);
        const result2 = await requestPermission(PERMISSIONS.IOS.PHOTO_LIBRARY);
        return result1 === RESULTS.GRANTED && result2 === RESULTS.GRANTED;
    } else if (Platform.OS === 'android') {
        const result = await requestPermission(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE); // For Android < 29
        return result === RESULTS.GRANTED;
    }
    return true; // No permission needed for other platforms or newer Android
};
