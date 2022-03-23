import React, {useRef, useState} from 'react';
import {
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

const exceptionhandler = (exceptionString: string) => {
  if (exceptionString != undefined)
    __DEV__ && console.log('exceptionString : ', exceptionString);
  Alert.alert(
    'Unexpected error occurred',
    'We have reported this to our team ! Please close the app and start again!',
  );
};

setNativeExceptionHandler(exceptionhandler, false);

const errorHandler = (e: any, falselse: any) => {
  __DEV__ && console.log('error handler : ', e);
  if (e != undefined && e != 'the componentWillUnmount method')
    Alert.alert(
      'Unexpected error occurred',
      'We have reported this to our team ! Please close the app and start again!',
    );
};

setJSExceptionHandler(errorHandler, true);

const subArray = [
  {
    title: 'off',
    language: 'off',
    text: '',
  },
  {
    title: 'sub1',
    language: 'english',
    text: 'your sample subtitle appears here',
  },
  {
    title: 'sub2',
    language: 'hindi',
    text: 'आपका नमूना उपशीर्षक यहां दिखाई देता है',
  },
  {
    title: 'sub3',
    language: 'french',
    text: 'votre exemple de sous-titre apparaît ici',
  },
];
const momentArray = [
  {
    time: 150,
    text: 'text /Question on moment 2',
  },
  {
    time: 320,
    text: 'text /Question on moment 3',
  },
  {
    time: 10,
    text: 'text /Question on moment 1',
  },
];

function App() {
  const videoRef = useRef<any>(null);
  const timer = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0.1);
  const [overlay, setOverlay] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [subSelected, setSubtitle] = useState<number>(0);
  const [listFlag, setListFlag] = useState<boolean>(false);
  const [selectedMoment, selectMoment] = useState<number|null>(null);
  const [momentTextVisible, setMomentTextVisible] = useState<boolean>(false);

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
    console.log('subs', payload);
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
                    style={[styles.subtitleText,subSelected ==index && {fontWeight:'bold'}]}>
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
            uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          }} // Can be a URL or a local file.
          ref={videoRef}
          paused={paused}
          muted={muted}
          style={{width: '100%', aspectRatio: 16 / 9}}
          resizeMode="contain"
          fullscreenAutorotate
          fullscreenOrientation="landscape"
          onProgress={handleProgress}
          onLoad={handleLoad}
          poster={"https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg"}
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
                    selectedMoment === index && {backgroundColor:'red'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  play: {
    position: 'absolute',
    zIndex: 10,
    padding: 5,
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  time: {
    fontSize: 13,
    color: 'white',
    lineHeight: 15,
    paddingRight: 10,
  },
  slider: {
    flex: 1,
    paddingRight: 10,
  },
  slide: {
    width: '100%',
    height: 40,
  },
  speaker: {
    height: 22,
    width: 22,
    resizeMode: 'contain',
  },
  subtitleWrap: {
    padding: 15,
    paddingBottom: 5,
    // backgroundColor: 'pink',
  },
  topOverlay: {
    zIndex: 10,
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
  },
  subListWrap: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 3,
    marginTop: 3,
    paddingVertical: 3,
  },
  subtitleText: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    color: 'white',
  },
  subtitle: {
    position: 'absolute',
    textShadowColor: 'black',
    textShadowRadius: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  moment: {
    height: 15,
    width: 15,
    borderRadius: 10,
    // backgroundColor:'red',
    position: 'absolute',
    top: 12,
    zIndex: 1,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  momentDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'white',
  },
  momentText: {
    position: 'absolute',
    textShadowColor: 'black',
    textShadowRadius: 5,
    fontWeight: 'bold',
    bottom: 30,
    fontSize: 12,
    color: 'white',
  },
});
