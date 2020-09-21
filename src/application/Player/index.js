import React, { useRef, useState, useEffect } from "react";
import { connect } from "react-redux";
import { isEmptyObject, shuffle, findIndex, getSongUrl } from "../../api/utils";
import MiniPlayer from "./mini-player";
import PlayList from "./play-list/index";
import {
  changeCurrentSong,
  changePlayingState,
  changeShowPlayList
} from "./store/actionCreators";

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
  const getLyric = id => {
    setTimeout(() => {
      songReady.current = true;
    }, 3000);
    // let lyric = "";
    // if (currentLyric.current) {
    //   currentLyric.current.stop();
    // }
    // // 避免songReady恒为false的情况
    // setTimeout(() => {
    //   songReady.current = true;
    // }, 3000);
    // getLyricRequest(id)
    //   .then(data => {
    //     lyric = data.lrc && data.lrc.lyric;
    //     if(!lyric) {
    //       currentLyric.current = null;
    //       return;
    //     }
    //     currentLyric.current = new Lyric(lyric, handleLyric, speed);
    //     currentLyric.current.play();
    //     currentLineNum.current = 0;
    //     currentLyric.current.seek(0);
    //   })
    //   .catch(() => {
    //     currentLyric.current = "";
    //     songReady.current = true;
    //     audioRef.current.play();
    //   });
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
      <PlayList clearPreSong={setPreSong.bind(null, {})}></PlayList>
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