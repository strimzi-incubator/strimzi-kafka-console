import React from 'react';
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody, Bullseye } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { CogsIcon } from '@patternfly/react-icons';
import OpenAddTopic from './openAddTopic';

class TopicsEmpty extends React.Component {
  static propTypes = {
    onAction: PropTypes.func.isRequired,
    service: PropTypes.object.isRequired
  };

  state = {};

  render() {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={CogsIcon} />
          <Title size="lg">No topics</Title>
          <EmptyStateBody>There are no topics defined.</EmptyStateBody>
          <OpenAddTopic onAction={this.props.onAction} service={this.props.service} />
        </EmptyState>
      </Bullseye>
    );
  }
}

export default TopicsEmpty;
