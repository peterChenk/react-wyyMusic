import React, {useState, useEffect } from 'react';
import { SongList, SongItem } from "./style";

const selectItem = () => {

}

const SongsList = React.forwardRef((props, refs) => {
  const { songs } = props

  const totalCount = songs.length

  return (
    <SongList ref={refs} showBackground={props.showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => selectItem(e, 0)}>
          <i className="iconfont">&#xe6e3;</i>
          <span>播放全部 <span className="sum">(共{totalCount}首)</span></span>
        </div>
        {/* { showCollect ? collect(collectCount) : null} */}
      </div>
    </SongList>
  )
})


export default React.memo(SongsList)