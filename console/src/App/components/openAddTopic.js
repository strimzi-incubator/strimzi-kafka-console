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
import { Modal, Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import AddTopicForm from './addTopicForm';
import TopicCreating from './topicCreating';
import TopicCreated from './topicCreated';

class OpenAddTopic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      isFormOpen: true,
      isCreatingOpen: false,
      isCreatedOpen: false
    };
  }
  static propTypes = {
    onAction: PropTypes.func.isRequired,
    service: PropTypes.object.isRequired
  };

  handleModalToggle = () => {
    this.setState(({ isModalOpen }) => ({
      isModalOpen: !isModalOpen,
      isFormOpen: true,
      isCreatingOpen: false,
      isCreatedOpen: false
    }));
  };

  handleModalSubmit = formElements => {
    // show the Creating topic dialog
    this.setState(() => ({
      isFormOpen: false,
      isCreatingOpen: true
    }));
    console.log('----- submitted add topic form with -----');
    console.log(JSON.stringify(formElements, null, 2));
    // send the request to create the topic
    this.props.service.createTopic(formElements).then(
      () => {
        // show the created dialog and
        this.setState(() => ({
          isCreatingOpen: false,
          isCreatedOpen: true
        }));
        // notify the table that it needs to refresh
        this.props.onAction('topic created', formElements.name);
      },
      e => {
        console.log(e);
        this.setState(() => ({
          isModalOpen: false,
          isCreatingOpen: false,
          isCreatedOpen: false
        }));
      }
    );
  };

  render() {
    const { isModalOpen } = this.state;

    return (
      <React.Fragment>
        <Button variant="primary" onClick={this.handleModalToggle}>
          Create
        </Button>
        <Modal isLarge className="topic-dialog" title="" isOpen={isModalOpen} onClose={this.handleModalToggle}>
          <AddTopicForm
            isOpen={this.state.isFormOpen}
            onSubmit={this.handleModalSubmit}
            onClose={this.handleModalToggle}
            service={this.props.service}
          />
          <TopicCreating isOpen={this.state.isCreatingOpen} />
          <TopicCreated isOpen={this.state.isCreatedOpen} onClose={this.handleModalToggle} />
        </Modal>
      </React.Fragment>
    );
  }
}

export default OpenAddTopic;
