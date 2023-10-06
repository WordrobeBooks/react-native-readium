import React, { useCallback, useState, useRef, useEffect } from 'react';
import { View, Platform, findNodeHandle, StyleSheet } from 'react-native';

import type { BaseReadiumViewProps, Dimensions } from '../interfaces';
import { Settings } from '../interfaces';
import { createFragment, getWidthOrHeightValue as dimension } from '../utils';
import { BaseReadiumView } from './BaseReadiumView';

export type ReadiumProps = BaseReadiumViewProps;

export const ReadiumView: React.FC<ReadiumProps> = ({
  onLocationChange: wrappedOnLocationChange,
  onTableOfContents: wrappedOnTableOfContents,
  onNewHighlightCreation: wrappedonNewHighlightCreation,
  settings: unmappedSettings,
  ...props
}) => {
  const ref = useRef(null);
  const [{ height, width }, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  // set the view dimensions on layout
  const onLayout = useCallback(({ nativeEvent: { layout: { width, height } }}: any) => {
    setDimensions({
      width: dimension(width),
      height: dimension(height),
    });
  }, []);
  // wrap the native onLocationChange and extract the raw event value
  const onLocationChange = useCallback((event: any) => {
    if (wrappedOnLocationChange) {
      wrappedOnLocationChange(event.nativeEvent);
    }
  }, [wrappedOnLocationChange]);

  const onTableOfContents = useCallback((event: any) => {
    if (wrappedOnTableOfContents) {
      const toc = event.nativeEvent.toc || null;
      wrappedOnTableOfContents(toc);
    }
  }, [wrappedOnTableOfContents]);

  const onNewHighlightCreation = useCallback((event: any) => {
    console.warn(event.nativeEvent.highlight);
    if (wrappedonNewHighlightCreation) {
       wrappedonNewHighlightCreation(event.nativeEvent.highlight);
    }
  }, [wrappedonNewHighlightCreation]);


  useEffect(() => {
    if (Platform.OS === 'android') {
      const viewId = findNodeHandle(ref.current);
      createFragment(viewId);
    }
  }, [])

  return (
    <View
      style={styles.container}
      onLayout={onLayout}
    >
      <BaseReadiumView
        height={height}
        width={width}
        {...props}
        onLocationChange={onLocationChange}
        onTableOfContents={onTableOfContents}
        onNewHighlightCreation={onNewHighlightCreation}
        settings={unmappedSettings ? Settings.map(unmappedSettings) : undefined}
        ref={ref}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', height: '100%' },
});
