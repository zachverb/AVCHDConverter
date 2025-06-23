import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import { isMtsFile, pickFile, pickMtsDirectory } from '@utils/file-utils';
import { generateThumbnail } from '@utils/ffmpeg-kit-utils';
import { ThumbnailImage } from '@components/thumbnail_image';
import { ImageListContainer } from '@components/image_list_container';
import { ReadDirItem } from 'react-native-fs';

function getCustomFileName(item: ReadDirItem) {
    return `${item.ctime?.getTime()}_${item.name}`;
}

const FilePickerScreen = () => {
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [imageUri, setImageUri] = useState('');
    const [thumbnailUris, setThumbnailUris] = useState<string[]>([]);

    const filePicker = async () => {
        const fileUri = await pickFile();
        if (!fileUri) {
            return;
        }
        const thumbnailOutputPath = await generateThumbnail(fileUri);
        if (!thumbnailOutputPath) {
            return;
        }
        setImageUri(thumbnailOutputPath);
    }

    const directoryPicker = async () => {
        const directoryResult = await pickMtsDirectory() ?? [];
        // const uris = directoryResult?.map(r => r.path).filter(r => !!r);
        for (let item of directoryResult) {
            const uri = item.path;
            if (!uri || !isMtsFile(uri)) {
                continue;
            }
            const customFileName = getCustomFileName(item);
            const thumbnailUri = await generateThumbnail(uri, customFileName);
            if (thumbnailUri) {
                setThumbnailUris(prev => [...prev, thumbnailUri]);
            }
        }
        // const generatedPaths = await Promise.all(thumbnailPromises);
        // const validThumbnailUris = generatedPaths.filter(path => !!path);
        // console.log('paths!', generatedPaths);
        // console.log('valid!', validThumbnailUris);
        // setThumbnailUris(validThumbnailUris);
    }

    return (
        <View style={styles.container}>
            <ThumbnailImage source={imageUri} />
            {/* <Button title="Select File from SD Card/Files App" onPress={filePicker} /> */}
            <Button title="Select Directory from SD Card/Files App" onPress={directoryPicker} />
            <ImageListContainer uris={thumbnailUris} />
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