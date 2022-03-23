import React from 'react';
import {
  Alert, SafeAreaView, StatusBar,
} from 'react-native';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import CustomVideo from './videoComponent';

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
 return (
   <SafeAreaView style={{flex:1}}>
     <StatusBar hidden />
     <CustomVideo
       subArray={subArray}
       momentArray={momentArray}
       video="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
     />
     {/* passing dummy subtitles as array , video link , moments as array
        any video url or file can be sent 
        online subtitles can be handled by default by react native video , using dummy subtitle array here
   */}
   </SafeAreaView>
 );
}


export default App;

