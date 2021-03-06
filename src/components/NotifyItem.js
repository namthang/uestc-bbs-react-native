import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight
} from 'react-native';
import moment from 'moment';
import colors from '../styles/common/_colors';
import styles from '../styles/components/_NotifyItem';

export default class NotifyItem extends Component {
  render() {
    let { router, notification } = this.props;
    let {
      topic_id,
      board_id,
      board_name,
      topic_subject,
      topic_content,
      reply_content,
      icon,
      reply_nick_name,
      replied_date
    } = notification;
    let topic = {
      topic_id,
      board_id,
      board_name
    };

    replied_date = moment(+replied_date).startOf('minute').fromNow();

    return (
      <View style={styles.container}>
        <TouchableHighlight
          underlayColor={colors.underlay}
          onPress={() => router.toTopic(topic)}>
          <View style={styles.item}>
            <View style={styles.authorInfo}>
              <Image
               style={styles.avatar}
               source={{ uri: icon }} />
              <View style={styles.author}>
                <Text style={styles.name}>{reply_nick_name}</Text>
                <Text style={styles.date}>{replied_date}</Text>
              </View>
            </View>
            <Text style={styles.replyContent}>{reply_content}</Text>
            <View style={styles.quote}>
              <Text style={styles.topicContent}>{topic_content}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
