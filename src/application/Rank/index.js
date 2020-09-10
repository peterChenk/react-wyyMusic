import React, { useEffect } from 'react';
import {
  List, 
  ListItem,
  SongList,
  Container
} from './style';
import Scroll from '../../baseUI/scroll/index';

function Rank (props) {
  console.log('props', props)
  const { loading } = props

  let displayStyle = loading ? {"display":"none"}:  {"display": ""};
  return (
    <Container>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>官方榜</h1>
            {/* { renderRankList(officialList) } */}
          <h1 className="global" style={displayStyle}>全球榜</h1>
            {/* { renderRankList(globalList, true) } */}
          {/* { loading ? <EnterLoading><Loading></Loading></EnterLoading> : null } */}
        </div>
      </Scroll>
    </Container>
  )
}

export default React.memo(Rank)