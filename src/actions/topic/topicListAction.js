import { API_ROOT } from '../../config';
import request from '../../utils/request';
import {
  INVALIDATE_TOPICLIST,
  REQUEST_TOPICLIST,
  RECEIVE_TOPICLIST,
  RESET_TOPICLIST,
  FAILURE_TOPICLIST
} from '../../constants/ActionTypes';

const TOPICLIST_API_PATH = 'forum/topiclist';

function requestTopicList(isEndReached) {
  return {
    type: REQUEST_TOPICLIST,
    isEndReached
  };
}

function receiveTopicList(topicList, { boardId }) {
  return {
    type: RECEIVE_TOPICLIST,
    topicList,
    boardId
  };
}

function failureTopicList() {
  return {
    type: FAILURE_TOPICLIST
  };
}

function fetchTopicList(boardId, isEndReached = false, sortType = 'all', page = 1, pageSize = 20) {
  return dispatch => {
    dispatch(requestTopicList(isEndReached));

    let url = API_ROOT +
              TOPICLIST_API_PATH +
              `&boardId=${boardId}` +
              `&sortby=${sortType}` +
              `&page=${page}` +
              `&pageSize=${pageSize}`;

    return request({
      url,
      successCallback: data => dispatch(receiveTopicList(data, { boardId })),
      failureCallback: () => dispatch(failureTopicList())
    });
  };
}

function shouldFetchTopicList(boardId, state) {
  let { topicList } = state;

  if (!topicList.list[boardId] || !topicList.list[boardId].topicList.length) { return true; }

  if (topicList.isRefreshing || topicList.isEndReached) { return false; }

  return topicList.didInvalidate;
}

export function fetchTopicListIfNeeded(boardId, isEndReached, sortType, page, pageSize) {
  return (dispatch, getState) => {
    if (shouldFetchTopicList(boardId, getState())) {
      return dispatch(fetchTopicList(boardId, isEndReached, sortType, page, pageSize));
    }
  };
}

export function invalidateTopicList() {
  return {
    type: INVALIDATE_TOPICLIST
  };
}

export function resetTopicList(forumId) {
  return {
    type: RESET_TOPICLIST,
    forumId
  };
}
