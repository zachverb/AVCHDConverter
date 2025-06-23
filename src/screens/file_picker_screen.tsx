import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import { isMtsFile, pickFile, pickMtsDirectory } from '@utils/file_utils';
import { generateThumbnail } from '@utils/ffmpeg_kit_utils';
import { VideoListContainer } from '@components/video_list_container';
import { ReadDirItem } from 'react-native-fs';
import { VideoFileData } from 'src/constants/types';

function getCustomFileName(item: ReadDirItem) {
    return `${item.ctime?.getTime()}_${item.name}`;
}

const FilePickerScreen = () => {
    const [videoData, setVideoData] = useState<VideoFileData[]>([]);

    const directoryPicker = async () => {
        const directoryResult = await pickMtsDirectory() ?? [];
        setVideoData([]);
        // const uris = directoryResult?.map(r => r.path).filter(r => !!r);
        directoryResult.map(async (item) => {
            const uri = item.path;
            if (!uri || !isMtsFile(uri)) {
                return;
            }
            const customFileName = getCustomFileName(item);
            const thumbnailUri = await generateThumbnail(uri, customFileName);
            if (thumbnailUri) {
                const videoDatum: VideoFileData = {
                    title: item.name,
                    thumbnailUri,
                    mtsUri: uri,
                };
                setVideoData(prev => [...prev, videoDatum]);
            }
        });

    }

    return (
        <View style={styles.container}>
            <Button title="Select Directory from SD Card/Files App" onPress={directoryPicker} />
            <VideoListContainer videoData={videoData} />
            <KeepAwake />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
});

export default FilePickerScreen;