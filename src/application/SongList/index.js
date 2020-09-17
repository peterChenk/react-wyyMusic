import React, {useState, useEffect } from 'react';
import { SongList, SongItem } from "./style";
import { getName } from '../../api/utils';
import { ONE_PAGE_COUNT } from '../../api/config';



const SongsList = React.forwardRef((props, refs) => {
  const { songs, musicAnimation, showCollect, collectCount } = props

  const totalCount = songs.length

  const [startIndex, setStartIndex] = useState(0);

  const usePageSplit = false

  useEffect(() => {
    if(startIndex + 1 + ONE_PAGE_COUNT >= totalCount)
      return;
    setStartIndex(startIndex + ONE_PAGE_COUNT);
  }, [startIndex, totalCount])

  const selectItem = (e) => {
    musicAnimation(e.nativeEvent.clientX, e.nativeEvent.clientY);
  }

  const songList = (list) => {
    let res = []
    // 判断页数是否超过总数
    let end = usePageSplit ? startIndex + ONE_PAGE_COUNT : list.length;
    for (let i = 0; i < end; i++) {
      if(i >= list.length) break;
      let item = list[i];
      res.push(
        <li key={item.id} onClick={(e) => selectItem(e, i)}>
          <span className="index">{i + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
              { item.ar ? getName(item.ar): getName(item.artists) } - { item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      )
      
    }
    return res
  }

  // const showCollect = false
  // const collectCount = 0

  const collect = (count) => {
    return  (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span>收藏({Math.floor(count/1000)/10}万)</span>
      </div>
      // <div className="isCollected">
      //   <span>已收藏({Math.floor(count/1000)/10}万)</span>
      // </div>
    )
  };

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>播放全部 <span className="sum">(共{totalCount}首)</span></span>
        </div>
        { showCollect ? collect(collectCount) : null}
      </div>
      <SongItem>
        { songList(songs) }
      </SongItem>
    </SongList>
  )
})


export default React.memo(SongsList)