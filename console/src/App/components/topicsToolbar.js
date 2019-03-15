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
import {
  Button,
  Dropdown,
  DropdownPosition,
  DropdownToggle,
  DropdownItem,
  KebabToggle,
  TextInput,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Chip,
  ChipGroup,
  ChipGroupToolbarItem
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import flexStyles from '@patternfly/patternfly/utilities/Flex/flex.css';
import spacingStyles from '@patternfly/patternfly/utilities/Spacing/spacing.css';
import { SortAmountDownIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import OpenAddTopic from './openAddTopic';
import TopicPagination from './topicPagination';

class TopicsToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isKebabOpen: false,
      searchValue: ''
    };
  }

  static propTypes = {
    onAction: PropTypes.func.isRequired,
    filters: PropTypes.array.isRequired,
    service: PropTypes.object.isRequired,
    totalRows: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    handleSetPage: PropTypes.func.isRequired,
    deleteFilter: PropTypes.func.isRequired,
    filterAdded: PropTypes.func.isRequired
  };

  handleTextInputChange = value => {
    this.setState({ searchValue: value });
  };
  onValueKeyPress = keyEvent => {
    const { searchValue } = this.state;

    if (keyEvent.key === 'Enter' && searchValue && searchValue.length > 0) {
      this.filterAdded(searchValue);
      keyEvent.stopPropagation();
      keyEvent.preventDefault();
    }
  };

  filterAdded = searchValue => {
    this.setState({ searchValue: '' });
    this.props.filterAdded(searchValue);
  };

  onKebabToggle = isOpen => {
    this.setState({
      isKebabOpen: isOpen
    });
  };
  onKebabSelect = event => {
    // notify the table that we selected an action from this toolbar
    this.props.onAction(event.target.innerText);
    this.setState({
      isKebabOpen: !this.state.isKebabOpen
    });
  };
  buildSearchBox = () => (
    <React.Fragment>
      <TextInput
        value={this.state.searchValue}
        type="search"
        placeholder="Filter by name..."
        onChange={this.handleTextInputChange}
        onKeyPress={e => this.onValueKeyPress(e)}
        className="topics-search-filter"
        aria-label="search text input"
      />
      <span className="fa fa-search input-search" />
    </React.Fragment>
  );

  buildKebab = () => {
    const { isKebabOpen } = this.state;

    return (
      <Dropdown
        onToggle={this.onKebabToggle}
        onSelect={this.onKebabSelect}
        position={DropdownPosition.right}
        toggle={<KebabToggle onToggle={this.onKebabToggle} />}
        isOpen={isKebabOpen}
        isPlain
        dropdownItems={[
          <DropdownItem component="button" key="delete-topics">
            Delete selected topics
          </DropdownItem>
        ]}
      />
    );
  };

  render() {
    return (
      <React.Fragment>
        <Toolbar className={css(flexStyles.justifyContentSpaceBetween, spacingStyles.mxXl, spacingStyles.myMd)}>
          <ToolbarGroup className="topics-toolbar-filter">
            <ToolbarItem className={css(spacingStyles.mrXl)}>{this.buildSearchBox()}</ToolbarItem>
            <ToolbarItem>
              <Button variant="plain" aria-label="Sort A-Z">
                <SortAmountDownIcon />
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem className={css(spacingStyles.mxMd)}>
              <OpenAddTopic onAction={this.props.onAction} service={this.props.service} />
            </ToolbarItem>
            <ToolbarItem>{this.buildKebab()}</ToolbarItem>
          </ToolbarGroup>
          <div className="topics-pagination">
            <ToolbarItem>
              <TopicPagination
                totalRows={this.props.totalRows}
                pageNumber={this.props.pageNumber}
                rowsPerPage={this.props.rowsPerPage}
                handleSetPage={this.props.handleSetPage}
              />
            </ToolbarItem>
          </div>
        </Toolbar>
        <Toolbar className="topics-chips-toolbar">
          <ChipGroup withToolbar>
            {this.props.filters.map(currentGroup => (
              <ChipGroupToolbarItem key={currentGroup.category} categoryName={currentGroup.category}>
                {currentGroup.chips.map(chip => (
                  <Chip key={chip} onClick={() => this.props.deleteFilter(chip)}>
                    {chip}
                  </Chip>
                ))}
              </ChipGroupToolbarItem>
            ))}
          </ChipGroup>
        </Toolbar>
      </React.Fragment>
    );
  }
}

export default TopicsToolbar;
