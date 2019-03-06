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
    // for the demo only, pretend that the topic creation takes a second
    // so we can see the spinning cogs
    setTimeout(() => {
      this.props.service.createTopic(formElements).then(
        () => {
          // show the created dialog
          this.setState(() => ({
            isCreatingOpen: false,
            isCreatedOpen: true
          }));
          // notify the table that it needs to refresh the topics list
          this.props.onAction('topic created');
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
    }, 1000);
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
