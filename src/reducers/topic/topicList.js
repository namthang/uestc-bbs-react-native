import {
  INVALIDATE_TOPICLIST,
  REQUEST_TOPICLIST,
  RECEIVE_TOPICLIST,
  RESET_TOPICLIST,
  REMOVE_CACHE,
  FAILURE_TOPICLIST
} from '../../constants/ActionTypes';

const defaultTopicListState = {
  // indicate fetching via pull to refresh
  isRefreshing: false,
  // indicate fetching via end reached
  isEndReached: false,
  didInvalidate: false,
  boardId: null,
  // dictionary for cache
  list: {},
  hasMore: false,
  page: 0,
  errCode: ''
};

export default function topicList(state = defaultTopicListState, action) {
  switch (action.type) {
    case INVALIDATE_TOPICLIST:
      return {
        ...state,
        didInvalidate: true
      };
    case REQUEST_TOPICLIST:
      return {
        ...state,
        isRefreshing: !action.isEndReached,
        isEndReached: action.isEndReached,
        didInvalidate: false
      };
    case RECEIVE_TOPICLIST:
      let {
        boardId,
        topicList
      } = action;

      let typeList = getMappedTypeList(topicList.classificationType_list);

      return {
        ...state,
        isRefreshing: false,
        isEndReached: false,
        didInvalidate: false,
        boardId,
        list: getNewCache(state, typeList, topicList.list, boardId, topicList.page),
        hasMore: !!topicList.has_next,
        page: topicList.page,
        errCode: topicList.errcode
      };
    case RESET_TOPICLIST:
      return {
        ...defaultTopicListState,
        list: getTopicListWithoutSpecificForum(state, action.forumId)
      };
    case FAILURE_TOPICLIST:
      return {
        ...state,
        isRefreshing: false,
        isEndReached: false,
        didInvalidate: false
      };
    case REMOVE_CACHE:
      return defaultTopicListState;
    default:
      return state;
  }
}

// map the fields of `type` to more clear names
function getMappedTypeList(typeList) {
  if (!typeList) { return []; }

  return typeList.map((item, index) => {
    return {
      typeId: item.classificationType_id,
      typeName: item.classificationType_name
    };
  });
}

// cache topic list and return
function getNewCache(oldState, typeList, topicList, boardId, page) {
  let newTopicList = [];

  if (page !== 1) {
    newTopicList = oldState.list[boardId].topicList.concat(topicList);
  } else {
    newTopicList = topicList;
  }

  return {
    ...oldState.list,
    [boardId]: {
      typeList,
      topicList: newTopicList
    }
  };
}

function getTopicListWithoutSpecificForum(oldState, forumId) {
  let newState = { ...oldState };
  delete newState.list[forumId];
  return newState.list;
}
