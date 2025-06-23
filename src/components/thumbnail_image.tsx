import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface ThumbnailImageProps {
  source: string;
}

export const ThumbnailImage = ({ source }: ThumbnailImageProps) => {
  if (!source) {
    return null;
  }

  return (
    <Image source={{ uri: source }} style={styles.image} />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});
