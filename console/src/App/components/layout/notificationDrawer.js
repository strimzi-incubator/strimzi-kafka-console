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
import { Button, ButtonVariant } from '@patternfly/react-core';
import { BellIcon } from '@patternfly/react-icons';
import { NotificationDrawerWrapper } from 'patternfly-react';

class NotificationDrawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      panels: [
        {
          panelkey: '1',
          panelName: 'Notifications',
          notifications: [],
          isExpanded: true
        }
      ],
      isExpanded: false,
      expandedPanel: '1',
      isExpandable: true,
      hasunread: false,
      drawerVisible: false
    };
  }

  handleNewNotification = (type, text) => {
    /*     
    level: 'info',
    level: 'warning',
    level: 'ok',
    level: 'error',
    */
    const { panels } = this.state;
    panels[0].notifications.unshift({
      id: panels[0].notifications.length,
      seen: false,
      level: type,
      text,
      group: 'Community'
    });
    this.setState({ panels, hasunread: true });
  };

  toggleDrawerHide = () => {
    this.setState({ drawerVisible: !this.state.drawerVisible });
  };

  onMarkPanelAsRead = panelkey => {
    const panels = this.state.panels.map(panel => {
      if (panel.panelkey === panelkey) {
        panel.notifications.map(notification => {
          notification.seen = true;
          return notification;
        });
      }
      return panel;
    });
    this.setState({ panels });
    this.updateUnreadCount();
  };

  onMarkPanelAsClear = key => {
    const panels = this.state.panels.map(panel => {
      if (panel.panelkey === key) panel.notifications = [];
      return panel;
    });
    this.setState({ panels });
    this.updateUnreadCount();
  };

  onNotificationAsRead = (panelkey, nkey) => {
    const panels = this.state.panels.map(panel => {
      if (panel.panelkey === panelkey) {
        panel.notifications.map(notification => {
          if (notification.id === nkey) notification.seen = true;
          return notification;
        });
      }
      return panel;
    });
    this.setState({ panels });
    this.updateUnreadCount();
  };

  onNotificationHide = (panelkey, nkey) => {
    const panels = this.state.panels.map(panel => {
      if (panel.panelkey === panelkey) {
        for (let i = 0; i < panel.notifications.length; i++) {
          if (nkey === panel.notifications[i].id) {
            panel.notifications.splice(i, 1);
          }
        }
      }
      return panel;
    });
    this.setState({ panels });
    this.updateUnreadCount();
  };

  togglePanel = key => {
    if (this.state.expandedPanel === key) this.setState({ expandedPanel: '-1' });
    else this.setState({ expandedPanel: key });
  };

  toggleDrawerExpand = () => {
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));
  };

  updateUnreadCount = () => {
    let hasunread = false;
    for (let i = 0; i < this.state.panels.length; i++) {
      for (let j = 0; j < this.state.panels[i].notifications.length; j++) {
        if (this.state.panels[i].notifications[j].seen === false) {
          hasunread = true;
        }
      }
    }
    this.setState({ hasunread });
  };

  render() {
    const { hasunread } = this.state;

    return (
      <div className={hasunread ? 'dot' : ''}>
        <Button
          id="notificationButton"
          onClick={this.toggleDrawerHide}
          aria-label="Notifications actions"
          variant={ButtonVariant.plain}
        >
          <BellIcon />
        </Button>
        <div className={this.state.drawerVisible ? '' : 'hidden'}>
          <NotificationDrawerWrapper
            panels={this.state.panels}
            togglePanel={this.togglePanel}
            toggleDrawerExpand={this.toggleDrawerExpand}
            isExpanded={this.state.isExpanded}
            isExpandable={this.state.isExpandable}
            expandedPanel={this.state.expandedPanel}
            toggleDrawerHide={this.toggleDrawerHide}
            onNotificationAsRead={this.onNotificationAsRead}
            onNotificationHide={this.onNotificationHide}
            onMarkPanelAsClear={this.onMarkPanelAsClear}
            onMarkPanelAsRead={this.onMarkPanelAsRead}
          />
        </div>
      </div>
    );
  }
}

export default NotificationDrawer;
