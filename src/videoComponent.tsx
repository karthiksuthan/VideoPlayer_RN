import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import Video from 'react-native-video';
import Images from '../Assets/Image';
import Slider from 'react-native-slider';
import styles from './styles'

function App(props: any) {
  const {subArray, momentArray, video} = props;
  const videoRef = useRef<any>(null);
  const timer = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0.1);
  const [overlay, setOverlay] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [subSelected, setSubtitle] = useState<number>(0);
  const [listFlag, setListFlag] = useState<boolean>(false);
  const [selectedMoment, selectMoment] = useState<number | null>(null);
  const [momentTextVisible, setMomentTextVisible] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(true);

  const onVideoPress = () => {
    clearTimeout(timer.current);
    if (overlay && paused) {
      setOverlay(true);
    } else if (overlay) {
      setOverlay(false);
      setListFlag(false);
      setMomentTextVisible(false);
      selectMoment(null);
    } else {
      setOverlay(true);
      onShow();
    }
  };

  const handleProgress = ({currentTime}: {currentTime: number}) => {
    setCurrentTime(currentTime);
  };
  const handleLoad = (payload: any) => {
    const {duration, textTracks} = payload;
    setDuration(duration);
    setOverlay(true);
    onShow();
  };

  const onSeek = (slide: number) => {
    if (slide * duration < currentTime) videoRef.current.seek(slide * duration);
  };
  const onSlidingStart = () => {
    clearTimeout(timer.current);
    setOverlay(true);
  };
  const onSlidingComplete = () => {
    onShow();
  };

  const onShow = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOverlay(false);
      setListFlag(false);
      setMomentTextVisible(false);
      selectMoment(null);
    }, 5000);
    return () => clearTimeout(timer.current);
  };

  const onPlayPause = () => {
    clearTimeout(timer.current);
    paused && onShow();
    setPaused(!paused);
    setOverlay(true);
  };

  const onSubSelect = (index: number) => {
    setSubtitle(index);
    clearTimeout(timer.current);
    paused || onShow();
    // console.log('fire',index);
  };

  const onMomentPress = (index: number, time: number) => {
    if (currentTime > time && index == selectedMoment) {
      videoRef.current.seek(time);
    } else {
      selectMoment(index);
      setMomentTextVisible(true);
      clearTimeout(timer.current);
      paused || onShow();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onVideoPress}
        activeOpacity={1}
        style={{alignItems: 'center', justifyContent: 'center'}}>
        {videoLoading ? (
          <View style={styles.videoLoader}>
            <ActivityIndicator
              size="large"
              color={'violet'}></ActivityIndicator>
          </View>
        ) : null}
        {overlay ? (
          <TouchableOpacity style={styles.play} onPress={onPlayPause}>
            <Image
              source={paused ? Images.play : Images.pause}
              style={{height: 50, aspectRatio: 1, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        ) : null}
        {overlay && (
          <View style={styles.topOverlay}>
            {listFlag && (
              <View style={styles.subListWrap}>
                {subArray.map((item, index) => (
                  <Text
                    key={index}
                    onPress={() => onSubSelect(index)}
                    style={[
                      styles.subtitleText,
                      subSelected == index && {fontWeight: 'bold'},
                    ]}>
                    {item.language}
                  </Text>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={styles.subtitleWrap}
              onPress={() => setListFlag(!listFlag)}>
              <Image source={Images.subtitle} style={styles.speaker} />
            </TouchableOpacity>
          </View>
        )}
        <Video
          source={{
            uri: video,
          }} // Can be a URL or a local file.
          ref={videoRef}
          paused={paused}
          muted={muted}
          style={{width: '100%', aspectRatio: 16 / 9}}
          resizeMode="contain"
          fullscreenAutorotate
          fullscreenOrientation="landscape"
          onReadyForDisplay={() => setVideoLoading(false)}
          onProgress={handleProgress}
          onLoad={handleLoad}
          poster={
            'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'
          }
          posterResizeMode={'cover'}
        />
        {subSelected > 0 && ( // online subtitles can be added directly to video component , for demo purpose only
          <Text style={[styles.subtitle, overlay ? {top: 10} : {bottom: 10}]}>
            {subArray[subSelected].text}
          </Text>
        )}
        {momentTextVisible && (
          <Text
            style={[
              styles.momentText,
              {left: (momentArray[selectedMoment].time / duration) * 100 + '%'},
            ]}>
            {momentArray[selectedMoment].text}
          </Text>
        )}
        {overlay && (
          <View style={styles.sliderContainer}>
            <Text style={styles.time}>{getTime(currentTime)}</Text>
            <View style={styles.slider}>
              {momentArray.map((i, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.moment,
                    {left: `${(i.time / duration) * 100}%`},
                    selectedMoment === index && {backgroundColor: 'red'},
                  ]}
                  onPress={() => onMomentPress(index, i.time)}>
                  <View
                    style={[
                      styles.momentDot,
                      {
                        backgroundColor:
                          currentTime < i.time ? 'rgba(0,0,0,0.3)' : 'black',
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
              <Slider
                style={styles.slide}
                thumbTintColor={'white'}
                minimumValue={0}
                maximumValue={1}
                useNativeDriver={true}
                //   onSlidingComplete={}
                //   onSlidingStart={}
                value={currentTime / duration}
                onValueChange={onSeek}
                minimumTrackTintColor={'white'}
                maximumTrackTintColor={'rgba(255,255,255,.6)'}
              />
            </View>
            <Text style={styles.time}>{getTime(duration)}</Text>
            <TouchableOpacity style={{}} onPress={() => setMuted(!muted)}>
              <Image
                source={muted ? Images.mute : Images.sound}
                style={styles.speaker}
              />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const getTime = (t: number) => {
  const digit = (n: Number) => (n < 10 ? `0${n}` : `${n}`);
  const sec = digit(Math.floor(t % 60));
  const min = digit(Math.floor((t / 60) % 60));
  const hr = digit(Math.floor((t / 3600) % 60));
  return `${hr != '00' ? hr + ':' : ''}${min}:${sec}`;
};

export default App;

