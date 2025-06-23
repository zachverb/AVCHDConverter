import { Alert } from 'react-native';
import RNFS from 'react-native-fs';
import { pick, pickDirectory, errorCodes, keepLocalCopy } from '@react-native-documents/picker'
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { requestPhotoLibraryPermission } from '@utils/permissions_utils';

export const saveVideoToGallery = async (filePath: string) => {
    try {
        const hasPermission = await requestPhotoLibraryPermission();

        if (!hasPermission) {
            Alert.alert(
                'Permission Denied',
                'Please grant photo library access in settings to save the video.'
            );
            return;
        }
        console.log('saving', filePath);
        const savedUri = await CameraRoll.saveAsset(filePath, { type: 'video' });
        Alert.alert('Success', `Video saved to gallery: ${savedUri.node.image.filename}`);
        return savedUri;
    } catch (error) {
        Alert.alert('Error Saving', `Failed to save video to gallery: ${error.message}`);
        console.error('Error saving video to gallery:', error);
    }
};

export const pickFile = async () => {
    try {
        const inputFiles = await pick({
            mode: 'open',
        });
        const { uri } = inputFiles[0];
        return uri;
    } catch (err) {
        if (err.code == errorCodes.OPERATION_CANCELED) {
            console.log('Canceled');
        } else {
            // Other errors
            console.error('DocumentPicker Error:', err);
            Alert.alert('Error', 'Failed to pick a document.');
        }
    }
};

export const pickMtsDirectory = async () => {
    try {
        const { uri } = await pickDirectory({
            requestLongTermAccess: false,
        });
        const files = await RNFS.readDir(uri);
        return files;
    } catch (err) {
        if (err.code == errorCodes.OPERATION_CANCELED) {
            console.log('Canceled');
        } else {
            // Other errors
            console.error('DocumentPicker Error:', err);
            Alert.alert('Error', 'Failed to pick a document.');
        }
    }
};

export function getFileExtension(uri: string): string {
    return uri.split("/").pop()?.split(".").pop() ?? "";
}

export function isMtsFile(uri: string): boolean {
    return getFileExtension(uri).toLowerCase() === 'mts';
}

export function getConvertedMtsTargetLocation(inputUri: string): string {
    return `${RNFS.CachesDirectoryPath}/${inputUri.split("/").pop()?.split(".").slice(0, -1).join(".")}.mp4`
}