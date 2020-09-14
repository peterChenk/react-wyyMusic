import React, { useEffect } from 'react';
import Slider from '../../components/slider/';
import { connect } from "react-redux";
import * as actionTypes from './store/actionCreators';
import Scroll from '../../baseUI/scroll/index';
import RecommendList from '../../components/list/';
import { Content } from './style';
import { renderRoutes } from 'react-router-config';


function Recommend(props) {

  const { bannerList, recommendList } = props

  const { getBannerDataDispatch, getRecommendListDataDispatch } = props

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  useEffect(() => {
    if(!bannerList.size){
      getBannerDataDispatch();
    }
    if(!recommendList.size){
      getRecommendListDataDispatch();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <Content>
      <Scroll className="list">
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
    </Content>
  )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList'])
})

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch () {
      dispatch(actionTypes.getBannerList())
    },
    getRecommendListDataDispatch () {
      dispatch(actionTypes.getRecommendList())
    }
  }
}

// 将ui组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));