import { fromJS } from 'immutable';
import { getRankListRequest } from '../../../api/request';

export const getRankList = () => {
  return dispatch => {
    getRankListRequest()
  }
}