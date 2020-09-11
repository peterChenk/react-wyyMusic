
import { fromJS } from 'immutable';
import { CHANGE_CURRENT_ALBUM } from './constants'


const defaultState = fromJS({
  currentAlbum: {}
})

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case CHANGE_CURRENT_ALBUM:
      return state.set('currentAlbum', action.data);
  
    default:
      return state
  }
}

export default reducer