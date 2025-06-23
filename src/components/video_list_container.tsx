import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { VideoFilePreview } from './video_file_preview';
import { VideoFileData } from 'src/constants/types';

interface VideoListContainerProps {
    videoData: VideoFileData[];
}

export const VideoListContainer = ({ videoData }: VideoListContainerProps) => {
    if (!videoData || videoData.length === 0) {
        return null;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {videoData.map((data) => (
                <View key={data.thumbnailUri} style={styles.imageWrapper}>
                    <VideoFilePreview data={data} />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    imageWrapper: {
        margin: 5,
    },
});