/*
 * Copyright 2019 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { ToastNotificationList, TimedToastNotification } from 'patternfly-react';

class NotificationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: []
    };
  }

  handleNewNotification = (type, message) => {
    const showTypes = ['warning', 'error'];
    if (showTypes.indexOf(type) === -1) return;
    const { notifications } = this.state;
    notifications.push({
      key: notifications.length,
      type,
      persistent: false,
      timerdelay: 5000,
      message
    });
    this.setState({ notifications });
    console.log(`new notification of ${type}:${message}`);
  };

  removeNotificationAction = notification => {
    const { notifications } = this.state;
    notifications.some((n, i) => {
      if (n.key === notification.key) {
        notifications.splice(i, 1);
        this.setState({ notifications });
        return true;
      }
      return false;
    });
  };

  render() {
    return (
      <ToastNotificationList>
        {this.state.notifications.map(notification => (
          <TimedToastNotification
            key={notification.key}
            type={notification.type}
            persistent={notification.persistent}
            onDismiss={() => this.removeNotificationAction(notification)}
            timerdelay={notification.timerdelay}
          >
            <span>
              {notification.header && <strong>{notification.header}</strong>}
              {notification.message}
            </span>
          </TimedToastNotification>
        ))}
      </ToastNotificationList>
    );
  }
}

export default NotificationList;
