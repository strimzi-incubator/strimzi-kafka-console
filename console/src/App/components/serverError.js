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
import { Title, EmptyState, EmptyStateIcon, EmptyStateBody, Bullseye } from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';

const ServerError = () => (
  <Bullseye>
    <EmptyState>
      <EmptyStateIcon icon={ErrorCircleOIcon} />
      <Title size="lg">Server error</Title>
      <EmptyStateBody>Unable to connect to console_server at http://localhost:8080.</EmptyStateBody>
    </EmptyState>
  </Bullseye>
);

export default ServerError;
