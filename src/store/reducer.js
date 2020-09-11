import { combineReducers } from "redux-immutable";
import { reducer as rankReducer } from "../application/Rank/store/index";
import { reducer as albumReducer } from "../application/Album/store/index";

export default combineReducers({
  rank: rankReducer,
  album: albumReducer,
});