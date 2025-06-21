import React, { useEffect, useState } from 'react';
import { Alert, Button, Platform, View } from 'react-native';
import RNFS from 'react-native-fs'; // Import react-native-fs
import { pick, errorCodes } from '@react-native-documents/picker'
import { FFmpegKit, ReturnCode } from 'ffmpeg-kit-react-native';
import KeepAwake from 'react-native-keep-awake';
import { CameraRoll } from '@react-native-camera-roll/camera-roll'; // Import CameraRoll

const saveVideoToGallery = async (filePath: string) => {
  try {
    const savedUri = await CameraRoll.saveAsset(filePath, { type: 'video' });
    Alert.alert('Success', `Video saved to gallery: ${savedUri.node.image.filename}`);
  } catch (error) {
    Alert.alert('Error Saving', `Failed to save video to gallery: ${error.message}`);
    console.error('Error saving video to gallery:', error);
  }
};


const convertMtsToMov = async (inputFilePath: string, outputFilePath: string) => {
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
      // Handle error
    }
  } catch (e) {
    console.error('Error executing FFmpeg command:', e);
  }
};


const FilePickerScreen = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const pickFile = async () => {
    try {
      const inputFiles = await pick();
      const { uri, name } = inputFiles[0];
      const [filePath] = uri?.split(name!);
      const outputName = name?.split('.')[0] + '_converted.mp4';

      convertMtsToMov(uri, `${filePath}${outputName}`);
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

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Select File from SD Card/Files App" onPress={pickFile} />
      <KeepAwake />
    </View>
  );
};

export default FilePickerScreen;