import { FFmpegKit, FFmpegKitConfig, ReturnCode } from 'ffmpeg-kit-react-native';
import { saveVideoToGallery, isMtsFile } from '@utils/file-utils';
import RNFS from 'react-native-fs';

export const generateThumbnail = async (videoFilePath: string, customName?: string) => {
    const fileName = customName ?? videoFilePath.split('/').pop()?.split('.')[0] ?? 'random_video';
    const thumbnailOutputPath = `${RNFS.CachesDirectoryPath}/${fileName}_thumb.png`
    if (await RNFS.exists(thumbnailOutputPath)) {
        return thumbnailOutputPath;
    }
    const command = `-y -i ${videoFilePath} -ss 00:00:01.000 -frames:v 1 ${thumbnailOutputPath}`
    try {
        FFmpegKitConfig.disableLogs();
        const session = await FFmpegKit.execute(command);
        const returnCode = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCode)) {
            console.log('successfully generated thumb!');
            return thumbnailOutputPath;
        } else if (ReturnCode.isCancel(returnCode)) {
            console.log('cancelled? how');
        } else {
            const error = await session.getFailStackTrace();
            console.error('Conversion failed:', error);
        }
    } catch (e) {
        console.error('Error executing FFmpeg command:', e);
    }
}

export const convertMtsToMov = async (inputFilePath: string, outputFilePath: string) => {
    if (!isMtsFile(inputFilePath)) {
        return;
    }
    const command = `-y -i ${inputFilePath} -c copy ${outputFilePath}`;

    try {
        const session = await FFmpegKit.execute(command);
        const returnCode = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCode)) {
            // Handle success, e.g., update UI or proceed with the converted file
            await saveVideoToGallery(outputFilePath);
        } else if (ReturnCode.isCancel(returnCode)) {
            // Handle cancellation
        } else {
            const error = await session.getFailStackTrace();
            console.error('Conversion failed:', error);
        }
    } catch (e) {
        console.error('Error executing FFmpeg command:', e);
    }
};