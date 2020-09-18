import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { isEmptyObject, shuffle, findIndex, getSongUrl } from "../../api/utils";
import MiniPlayer from "./mini-player";
import {
  changeCurrentSong,
  changePlayingState,
  changeShowPlayList
} from "./store/actionCreators";

function Player (props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlayingLyric, setPlayingLyric] = useState("");

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
  console.log('percent', percent)

  const { 
    speed,
    currentSong: immutableCurrentSong, 
    playList:immutablePlayList,
    currentIndex,
    playing,
    fullScreen
  } = props
  const { changeCurrentDispatch, togglePlayingDispatch, togglePlayListDispatch } = props

  const playList = immutablePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();

  // console.log('playList', playList)

  const [preSong, setPreSong] = useState({});

  const audioRef = useRef();
  const songReady = useRef(true);

  useEffect(() => {
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    ) return;
    songReady.current = false;
    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    setPreSong(current);
    setPlayingLyric("");
    audioRef.current.src = getSongUrl(current.id);
    audioRef.current.autoplay = true;
    audioRef.current.playbackRate = speed;
    togglePlayingDispatch(true);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);

    // eslint-disable-next-line
  }, [currentIndex, playList])

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    console.log('playing', playing)
    // if(currentLyric.current) {
    //   currentLyric.current.togglePlay(currentTime*1000);
    // }
  }
  const toggleFullScreenDispatch = () => {

  }
  
  const updateTime = e => {
    setCurrentTime(e.target.currentTime);
  };
  const handleEnd = () => {
    // if (mode === playMode.loop) {
    //   handleLoop();
    // } else {
    //   handleNext();
    // }
  };
  const handleError = () => {
    songReady.current = true;
    // handleNext();
    alert("播放出错");
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          playing={playing}
          full={fullScreen}
          song={currentSong}
          percent={percent}
          clickPlaying={clickPlaying}
          setFullScreen={toggleFullScreenDispatch}
          togglePlayList={togglePlayListDispatch}
        ></MiniPlayer>
      )}
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
    </div>
  )

}

const mapStateToProps = (state) => ({
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  playList: state.getIn(["player", "playList"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  speed: state.getIn(["player", "speed"]),
})

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
  }
}

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Player));