import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
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
  videoLoader: {
    zIndex: 10,
    alignItems: 'center',
    position: 'absolute',
  },
});

export default styles;