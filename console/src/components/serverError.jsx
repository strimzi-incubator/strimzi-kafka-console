import React from 'react';
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody, Bullseye } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

class ServerError extends React.Component {
  state = {};

  render() {
    return (
      <Bullseye>
        <EmptyState>
          <EmptyStateIcon icon={ErrorCircleOIcon} />
          <Title size="lg">Server error</Title>
          <EmptyStateBody>Unable to connect to console_server at http://localhost:8080.</EmptyStateBody>
        </EmptyState>
      </Bullseye>
    );
  }
}

export default ServerError;
