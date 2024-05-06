import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar } from 'react-native';
import { Audio, Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';

export default function Monkey() {
  const navigation = useNavigation();

  const [musicPlaying, setMusicPlaying] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  useEffect(() => {
    const loadSound = async () => {
      const sound = new Audio.Sound();
      try {
        await sound.loadAsync(require('./assets/MonkeyMusic.mp3'));
        setSoundObject(sound);
        if (musicPlaying) {
          await sound.playAsync();
        }
      } catch (error) {
        console.log('Error al cargar o reproducir el audio:', error);
      }
    };

    loadSound();

    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, [musicPlaying]);

  useEffect(() => {
    const unsuscribe = navigation.addListener('beforeRemove',() =>{
      if (soundObject) {
        soundObject.stopAsync();
      }
    });
    return unsuscribe
  }, [navigation, soundObject]);


  const handlePlayVideo = () => {
    setVideoPlaying(true);
    setMusicPlaying(false);
    if (soundObject) {
      soundObject.stopAsync();
    }
  };

  const handleVideoPlaybackStatusUpdate = (status) => {
    if (!status.isPlaying && status.didJustFinish) {
      setVideoPlaying(false);
      setMusicPlaying(true); 
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  if (videoPlaying) {
    return (
      <View style={styles.container}>
        <Video
          source={require('./assets/bills.mp4')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          onPlaybackStatusUpdate={handleVideoPlaybackStatusUpdate}
          shouldPlay={true}
        />
      </View>
    );
  }

  return (
    <ImageBackground source={require('./assets/lol.jpg')} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Goku, eta vaina e seria</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, {width: moderateScale(200)}]} onPress={handlePlayVideo}>
            <Text style={styles.buttonText}>Reproducir Video</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: moderateScale(40),
  },
  text: {
    fontSize: moderateScale(40), 
    fontWeight: '400',
    fontStyle: 'normal',
    marginBottom: moderateScale(20), 
    color: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: moderateScale(30), 
    opacity: 0
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingVertical: moderateScale(10), 
    paddingHorizontal: moderateScale(20), 
    borderRadius: moderateScale(5), 
    marginVertical: moderateScale(10), 
  },
  buttonText: {
    fontSize: moderateScale(16),
    color: 'black',
  },
});