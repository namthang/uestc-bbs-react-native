import { Navigator } from 'react-native';
import Home from './containers/Home';
import ForumList from './containers/ForumList';
import TopicDetail from './containers/TopicDetail';
import ForumDetail from './containers/ForumDetail';
import Search from './containers/Search';
import Browser from './containers/Browser';
import Message from './containers/Message';

let _navigator = null;

export default class Router {
  constructor(navigator) {
    _navigator = navigator;
  }

  _navigateTo(route, isReplace, isForceReplace) {
    // this case is that if we are in Home page and
    // we want to login or logout, we need to replace
    // Home page as well since we want to fetch topic
    // list again with or without authrization.
    if (isForceReplace) {
      _navigator.replace(route);
      return;
    }

    let currentRoute = this.getCurrentRoute();
    if (route.id !== currentRoute.id) {
      if (isReplace) {
        _navigator.replace(route);
        return;
      }

      _navigator.push(route);
    }
  }

  getCurrentRoute() {
    let routeList = _navigator.getCurrentRoutes();
    let currentRoute = routeList[routeList.length - 1];
    return currentRoute;
  }

  isCurrentRoute(routeId) {
    return routeId === this.getCurrentRoute().id;
  }

  pop() {
    _navigator.pop();
  }

  toHome(isForceReplace) {
    this._navigateTo({
      id: 'home',
      title: '最新',
      component: Home
    }, true, isForceReplace);
  }

  toForumList() {
    this._navigateTo({
      id: 'forumList',
      title: '版块',
      component: ForumList
    }, true);
  }

  toSearch() {
    this._navigateTo({
      id: 'search',
      title: '搜索',
      component: Search
    });
  }

  toTopic(topic) {
    this._navigateTo({
      id: 'topicDetail',
      title: topic.board_name,
      component: TopicDetail,
      passProps: topic
    });
  }

  toForum(forum) {
    this._navigateTo({
      /**
      * we should use `forum.board_id` instead of literal text `forumDetail`
      * as id otherwise we can't transition to sub forum from top torum.
      */
      id: forum.board_id,
      title: forum.board_name,
      component: ForumDetail,
      passProps: forum
    });
  }

  toBrowser(url) {
    this._navigateTo({
      id: 'WebView',
      component: Browser,
      passProps: { url }
    });
  }

  toMessage() {
    this._navigateTo({
      id: 'message',
      title: '消息',
      component: Message
    });
  }
}
