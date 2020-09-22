import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { isEmptyObject, shuffle, findIndex, getSongUrl } from "../../api/utils";
import MiniPlayer from "./mini-player";
import NormalPlayer from "./normal-player";
import PlayList from "./play-list/index";
import Toast from "./../../baseUI/toast/index";
import Lyric from "../../api/lyric-parser";
import {
  changeCurrentSong,
  changePlayingState,
  changeShowPlayList,
  changeFullScreen,
  changeSpeed,
  changePlayList,
  changeCurrentIndex,
  changePlayMode
} from "./store/actionCreators";
import { getLyricRequest } from "./../../api/request";

function Player (props) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlayingLyric, setPlayingLyric] = useState("");
  const [modeText, setModeText] = useState("");

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;
  console.log('percent', percent)

  const { 
    speed,
    currentSong: immutableCurrentSong, 
    playList:immutablePlayList,
    currentIndex,
    playing,
    fullScreen,
    mode,
    sequencePlayList: immutableSequencePlayList,
  } = props
  const { 
    changeCurrentDispatch, 
    togglePlayingDispatch, 
    togglePlayListDispatch,
    toggleFullScreenDispatch,
    changeSpeedDispatch,
    changePlayListDispatch,
    changeCurrentIndexDispatch,
    changeModeDispatch
  } = props

  const playList = immutablePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  const [preSong, setPreSong] = useState({});

  const audioRef = useRef();
  const toastRef = useRef();
  const songReady = useRef(true);

  const currentLyric = useRef();
  const currentLineNum = useRef();

  useEffect(() => {
    console.log('useEffect1', currentIndex)
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id ||
      !songReady.current
    ) return;
    console.log('useEffect22', currentIndex)
    songReady.current = false;
    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    setPreSong(current);
    setPlayingLyric("");
    audioRef.current.src = getSongUrl(current.id);
    audioRef.current.autoplay = true;
    audioRef.current.playbackRate = speed;
    togglePlayingDispatch(true);
    getLyric(current.id);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);

    // eslint-disable-next-line
  }, [currentIndex, playList])

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  useEffect(() => {
    if (!fullScreen) return;
    if (currentLyric.current && currentLyric.current.lines.length) {
      handleLyric({
        lineNum: currentLineNum.current,
        txt: currentLyric.current.lines[currentLineNum.current].txt
      });
    }
  }, [fullScreen]);

  const handleLyric = ({ lineNum, txt }) => {
    if(!currentLyric.current)return;
    currentLineNum.current = lineNum;
    setPlayingLyric(txt);
  };

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    console.log('playing', playing)
    if(currentLyric.current) {
      currentLyric.current.togglePlay(currentTime*1000);
    }
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
  const getLyric = id => {
    let lyric = "";
    if (currentLyric.current) {
      currentLyric.current.stop();
    }
    // 避免songReady恒为false的情况
    setTimeout(() => {
      songReady.current = true;
    }, 3000);
    getLyricRequest(id)
      .then(data => {
        lyric = data.lrc && data.lrc.lyric;
        if(!lyric) {
          currentLyric.current = null;
          return;
        }
        currentLyric.current = new Lyric(lyric, handleLyric, speed);
        currentLyric.current.play();
        currentLineNum.current = 0;
        currentLyric.current.seek(0);
      })
      .catch(() => {
        currentLyric.current = "";
        songReady.current = true;
        audioRef.current.play();
      });
  };

  const handleError = () => {
    songReady.current = true;
    // handleNext();
    alert("播放出错");
  };

  const clickSpeed = (newSpeed) => {
    changeSpeedDispatch(newSpeed);
    audioRef.current.playbackRate = newSpeed;
    currentLyric.current.changeSpeed(newSpeed);
    currentLyric.current.seek(currentTime*1000);
  }

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText("顺序循环");
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText("单曲循环");
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  };

  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    audioRef.current.play();
    if (currentLyric.current) {
      currentLyric.current.seek(0);
    }
  };

  const handlePrev = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index === 0) index = playList.length - 1;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          full={fullScreen}
          toggleFullScreenDispatch={toggleFullScreenDispatch}
          currentPlayingLyric={currentPlayingLyric}
          currentLyric={currentLyric.current}
          currentLineNum={currentLineNum.current}
          speed={speed}
          clickSpeed={clickSpeed}
          duration={duration}
          percent={percent}
          onProgressChange={onProgressChange}
          changeMode={changeMode}
          mode={mode}
          currentTime={currentTime}
          handlePrev={handlePrev}
          clickPlaying={clickPlaying}
          handleNext={handleNext}
          playing={playing}
          togglePlayListDispatch={togglePlayListDispatch}
        >
        </NormalPlayer>
      )}
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
      <PlayList clearPreSong={setPreSong.bind(null, {})}></PlayList>
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        onError={handleError}
      ></audio>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  )

}

const mapStateToProps = (state) => ({
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  playList: state.getIn(["player", "playList"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  speed: state.getIn(["player", "speed"]),
  fullScreen: state.getIn(["player", "fullScreen"]),
  mode: state.getIn(["player", "mode"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"])
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
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    changeSpeedDispatch(data) {
      dispatch(changeSpeed(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
  }
}

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Player));