import React, {useState, useEffect, useRef, useCallback} from 'react';
import Scroll from './../../baseUI/scroll/index';
import SearchBox from './../../baseUI/search-box/index';
import { Container, ShortcutWrapper, HotKey } from './style';
import { connect } from 'react-redux';
import { getHotKeyWords, changeEnterLoading, getSuggestList } from './store/actionCreators';
import { List, ListItem, EnterLoading } from './../Singers/style';
import LazyLoad, {forceCheck} from 'react-lazyload';
import { CSSTransition } from 'react-transition-group';
import Loading from './../../baseUI/loading/index';
import MusicalNote from '../../baseUI/music-note';
import { SongItem } from '../Album/style';
import { getName } from '../../api/utils';
// import { getSongDetail } from './../Player/store/actionCreators';


function Search(props) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');

  const { songsCount } = props

  useEffect(() => {
    setShow(true);
    // if(!hotList.size)
    //   getHotKeyWordsDispatch();
      // eslint-disable-next-line
  }, []);

  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    console.log('q', q)
    setQuery(q);
    if(!q) return;
    // changeEnterLoadingDispatch(true);
    // getSuggestListDispatch(q);
  }

  return (
    <CSSTransition
      in={show} 
      timeout={300} 
      appear={true} 
      classNames="fly"  
      unmountOnExit
      onExited={() => props.history.goBack()}>
        <Container play={songsCount}>
          <div className="search_box_wrapper">
            <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
          </div>
          <div>
            搜索搜索搜索搜索搜索
          </div>
        </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));