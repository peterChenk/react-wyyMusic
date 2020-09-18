import React, { useEffect, useState, useRef, useCallback } from 'react';
import { connect } from 'react-redux';
import Scroll from '../../baseUI/scroll/index';
import { getAlbumList } from './store/actionCreators'
import { Container } from "./style";
import { HEADER_HEIGHT } from './../../api/config';
import style from "../../assets/global-style";
import { CSSTransition } from "react-transition-group";
import Header from './../../baseUI/header/index';
import { isEmptyObject } from '../../api/utils';
import AlbumDetail from '../../components/album-detail/index';
import MusicNote from '../../baseUI/music-note/index';


function Album (props) {

  const [showStatus, setShowStatus] = useState(true);
  const [isMarquee, setIsMarquee] = useState(false);
  const [title, setTitle] = useState("歌单");
  const id = props.match.params.id;

  const { currentAlbum } = props
  const { getAlbumDataDispatch } = props
  let currentAlbumJS = currentAlbum.toJS()

  const headerEl = useRef();
  const musicNoteRef = useRef();

  useEffect(() => {
    getAlbumDataDispatch(id)
    // eslint-disable-next-line
  }, [])

  const handleBack = () => {
    setShowStatus(false);
  }
  
  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y/minScrollY);
    let headerDom = headerEl.current;
    if(pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent-1)/2);
      setTitle(currentAlbumJS&&currentAlbumJS.name);
      setIsMarquee(true);
    } else{
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("歌单");
      setIsMarquee(false);
    }
  }, [currentAlbumJS]);
  const handlePullUp = () => {

  }
  const pullUpLoading = () => {

  }
  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y});
  }

  return (
    <CSSTransition
      in={showStatus}  
      timeout={300} 
      classNames="fly" 
      appear={true} 
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container>
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {
          !isEmptyObject(currentAlbumJS) ? (
            <Scroll 
              onScroll={handleScroll} 
              pullUp={handlePullUp} 
              bounceTop={false}
            >
              <AlbumDetail currentAlbum={currentAlbumJS} pullUpLoading={pullUpLoading} musicAnimation={musicAnimation}></AlbumDetail>
            </Scroll>
          ) : null
        }
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
})
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch (id) {
      dispatch(getAlbumList(id))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));