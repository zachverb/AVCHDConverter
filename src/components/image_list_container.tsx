import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ThumbnailImage } from './thumbnail_image';

interface ImageListContainerProps {
    uris: string[];
}

export const ImageListContainer = ({ uris }: ImageListContainerProps) => {
    if (!uris || uris.length === 0) {
        return null;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {uris.map((uri) => (
                <View key={uri} style={styles.imageWrapper}>
                    <ThumbnailImage source={uri} />
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