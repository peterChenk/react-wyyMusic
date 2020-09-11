import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import Scroll from '../../baseUI/scroll/index';
import { getAlbumList } from './store/actionCreators'
import { Container } from "./style";
import { CSSTransition } from "react-transition-group";
import Header from './../../baseUI/header/index';
import { isEmptyObject } from '../../api/utils';
import AlbumDetail from '../../components/album-detail/index';


function Album (props) {

  const [showStatus, setShowStatus] = useState(true);
  const [isMarquee, setIsMarquee] = useState(false);
  const id = props.match.params.id;

  const { currentAlbum } = props
  const { getAlbumDataDispatch } = props
  console.log('currentAlbum', currentAlbum)
  let currentAlbumJS = currentAlbum.toJS()

  const headerEl = useRef();

  useEffect(() => {
    getAlbumDataDispatch(id)
    // eslint-disable-next-line
  }, [])

  const handleBack = () => {
    setShowStatus(false);
  }
  
  const handleScroll = () => {

  }
  const handlePullUp = () => {

  }
  const pullUpLoading = () => {

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
        <Header ref={headerEl} title={'返回'} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {
          !isEmptyObject(currentAlbumJS) ? (
            <Scroll 
              onScroll={handleScroll} 
              pullUp={handlePullUp} 
              bounceTop={false}
            >
              <AlbumDetail currentAlbum={currentAlbumJS} pullUpLoading={pullUpLoading}></AlbumDetail>
            </Scroll>
          ) : null
        }
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