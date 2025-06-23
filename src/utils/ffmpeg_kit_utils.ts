import { FFmpegKit, FFmpegKitConfig, ReturnCode, FFprobeKit, MediaInformation } from 'ffmpeg-kit-react-native';
import { saveVideoToGallery, isMtsFile } from '@utils/file_utils';
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
        const session = await FFmpegKit.executeAsync(command);
        const returnCode = await session.getReturnCode();

        if (ReturnCode.isSuccess(returnCode)) {
            console.log('successfully generated thumb!');
            return thumbnailOutputPath;
        } else if (ReturnCode.isCancel(returnCode)) {
            console.log('cancelled? how');
        } else {
            const error = await session.getFailStackTrace();
            console.log('Conversion failed:', error);
        }
    } catch (e) {
        console.log('Error executing FFmpeg command:', e);
    }
}

export const convertMtsToMov = async (inputFilePath: string, outputFilePath: string) => {
    if (!isMtsFile(inputFilePath)) {
        return;
    }
    const command = `-y -i ${inputFilePath} -c copy ${outputFilePath}`;
    try {
        const session = await FFmpegKit.execute(command);
        return await session.getReturnCode();
    } catch (e) {
        console.error('Error executing FFmpeg command:', e);
    }
};

export const probeVideoData = async (filePath: string): Promise<MediaInformation | null> => {
    try {
        const session = await FFprobeKit.getMediaInformation(filePath);
        const information = session.getMediaInformation();

        if (information) {
            return information;
        } else {
            console.error("Failed to get media information.");
            const logs = await session.getLogsAsString();
            console.error("FFprobe logs:", logs);
            return null;
        }
    } catch (e) {
        console.error('Error executing FFprobe command:', e);
        return null;
    }
};