import React from 'react';
import { Modal, Button } from '@patternfly/react-core';
import PropTypes from 'prop-types';

class DeleteConfirm extends React.Component {
  static propTypes = {
    onDeleteConfirm: PropTypes.func.isRequired,
    onDeleteClose: PropTypes.func.isRequired,
    deleteList: PropTypes.array.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  handleModalClose = () => {
    this.props.onDeleteClose();
  };

  handleModalSubmit = () => {
    this.props.onDeleteConfirm();
  };

  deleteList = () => {
    return this.props.deleteList.map((topic, index) => <li key={`delete-${index}`}>{topic}</li>);
  };

  render() {
    return (
      <Modal
        isSmall
        title="Delete existing topic?"
        isOpen={this.props.isOpen}
        onClose={this.handleModalClose}
        actions={[
          <Button key="cancel" variant="secondary" onClick={this.handleModalClose}>
            Cancel
          </Button>,
          <Button key="confirm" variant="primary" onClick={this.handleModalSubmit}>
            Confirm
          </Button>
        ]}
      >
        <ul className="delete-list">{this.deleteList()}</ul>
        Once you delete the topic, all the related configurations will be deleted. Do you still want to delete
        the topic?
      </Modal>
    );
  }
}

export default DeleteConfirm;
