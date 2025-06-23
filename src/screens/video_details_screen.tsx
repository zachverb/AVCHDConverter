import { StaticScreenProps } from '@react-navigation/native';
import { convertMtsToMov, probeVideoData } from '@utils/ffmpeg_kit_utils';
import { getConvertedMtsTargetLocation, saveVideoToGallery } from '@utils/file_utils';
import { requestPhotoLibraryPermission } from '@utils/permissions_utils';
import { MediaInformation, ReturnCode } from 'ffmpeg-kit-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import VideoPlayer from 'react-native-video-player';
import { VideoFileData } from 'src/constants/types';

export type VideoDetailsScreenProps = StaticScreenProps<{
    data: VideoFileData;
}>;

const VideoDetailsScreen = ({ route }: VideoDetailsScreenProps) => {
    const { data } = route.params;

    const [mediaInformation, setMediaInformation] = useState<MediaInformation | null>(null);
    const [videoUri, setVideoUri] = useState<string | undefined>(data.convertedUri);
    const [savedUri, setSavedUri] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const getVideoInfo = async () => {
            const info = await probeVideoData(data.mtsUri);
            setMediaInformation(info);
        }
        const convertMtsFile = async () => {
            const inputPath = data.mtsUri;
            const outputPath = getConvertedMtsTargetLocation(inputPath);
            const returnCode = await convertMtsToMov(inputPath, outputPath);
            if (returnCode && ReturnCode.isSuccess(returnCode)) {
                data.convertedUri = outputPath;
                setVideoUri(outputPath);
                console.log("success");
            } else {
                console.error('Error converting MTS file to MOV');
            }
        }
        if (data.mtsUri) {
            getVideoInfo();
            convertMtsFile();
        }
    }, [])
    const videoStream = mediaInformation?.getStreams()?.at(0);
    const onPress = async () => {
        if (videoUri && !isLoading) {
            setIsLoading(true)
            const hasPermissions = await requestPhotoLibraryPermission();
            if (!hasPermissions) {
                return;
            }
            const uri = await saveVideoToGallery(videoUri);
            if (uri) {
                setSavedUri(savedUri);
            }
            setIsLoading(false);
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.playerContainer}>
                {videoUri ? <VideoPlayer
                    source={{ uri: videoUri }}
                    showDuration={true}
                    onError={(e) => console.log(e)}
                    thumbnail={{ uri: data.thumbnailUri }} />
                    : <Image source={{ uri: data.thumbnailUri }} style={styles.image} />}
            </View>
            <Text>Video Details for {data.title}</Text>
            {mediaInformation && (<>
                <Text>Format: {mediaInformation?.getFormat()}</Text>
                <Text>Duration: {mediaInformation?.getDuration()}</Text>
                <Text>Bitrate: {mediaInformation?.getBitrate()}</Text>
                <Text>Frame rate: {videoStream?.getRealFrameRate()}</Text>
                <Text>Resolution: {videoStream?.getWidth()}x{videoStream?.getHeight()}</Text>
            </>)}
            {savedUri && <Text>Video saved to {savedUri}</Text>}
            {videoUri && !savedUri &&
                <Button onPress={() => onPress()} title="Save to Gallery" disabled={isLoading} />}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
    playerContainer: {
        justifyContent: 'center',
        height: 200,
    },
});

export default VideoDetailsScreen;