import { useNavigation } from '@react-navigation/native';
import { VideoDetailsScreenProps } from '@screens/video_details_screen';
import React from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { VideoFileData } from 'src/constants/types';

interface VideoFilePreviewProps {
  data: VideoFileData;
}

export const VideoFilePreview = ({ data }: VideoFilePreviewProps) => {
  const navigation = useNavigation<VideoDetailsScreenProps>();
  return (
    <Pressable onPress={() => navigation.navigate('Video details', { data })}>
      <Image source={{ uri: data.thumbnailUri }} style={styles.image} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});
