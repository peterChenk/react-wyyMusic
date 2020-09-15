import React, { useEffect } from 'react';
import { connect } from "react-redux";




function Singer(props) {
  
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = () => {
  
}
// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Singer));