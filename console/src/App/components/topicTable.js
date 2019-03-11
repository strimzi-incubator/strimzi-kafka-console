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
import { Button } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, sortable, SortByDirection } from '@patternfly/react-table';
import { UserFriendsIcon, ReplicatorIcon, RegionsIcon } from '@patternfly/react-icons';
import TopicDetailsTable from './detailsTable';
import TopicsToolbar from './topicsToolbar';
import TopicsService from '../topicsService';
import TopicsEmpty from './topicsEmpty';
import TopicsLoading from './topicsLoading';
import ServerError from './serverError';

class TopicsTable extends React.Component {
  constructor(props) {
    super(props);
    this.topics_service = new TopicsService();
    this.state = {
      columns: [
        { title: 'Name', cellFormatters: [this.formatName.bind(this)], transforms: [sortable] },
        { title: 'Partitions', cellFormatters: [this.formatPartition.bind(this)] },
        { title: 'Partition replicas', cellFormatters: [this.formatReplicas.bind(this)] },
        { title: 'Consumers', cellFormatters: [this.formatConsumers.bind(this)] }
      ],
      rows: [],
      totalRows: 1,
      pageNumber: 1,
      rowsPerPage: 5,
      actions: [
        {
          title: 'Delete',
          onClick: this.handleDeleteRow
        }
      ],
      serverError: false,
      firstLoad: true
    };
    this.refreshTopicList();
    this.polling = false;
    this.allRows = [];
  }

  getColumn = col => this.state.columns.findIndex(c => c.title === col);

  refreshTopicList = justCreated => {
    let { serverError } = this.state;
    const firstLoad = false;
    console.log('getting topic list');
    this.topics_service.getTopicList().then(
      topics => {
        console.log('got topic list');
        serverError = false;
        this.setState({ serverError, firstLoad });
        this.onTopicList(topics, justCreated);
        if (!this.polling) {
          this.polling = true;
          setTimeout(this.updateConsumers, 5000);
        }
      },
      e => {
        serverError = true;
        this.setState({ serverError, firstLoad });
        console.log(`topics error is ${e}`);
        setTimeout(this.refreshTopicList, 5000);
      }
    );
  };

  updateConsumers = () => {
    console.log('updating consumers');
    this.topics_service.getTopicList().then(
      topics => {
        const serverError = false;
        const { rows } = this.state;
        rows.forEach(row => {
          topics.some(topic => {
            if (row.cells[this.getColumn('Name')] === topic.name) {
              row.cells[this.getColumn('Operators')] = topic.consumers;
              return true;
            }
            return false;
          });
        });
        this.setState({ rows, serverError });
        setTimeout(this.updateConsumers, 5000);
      },
      e => {
        const serverError = true;
        this.setState({ serverError });
      }
    );
  };

  handleDeleteRow = (event, rowIndex) => {
    const { rows } = this.state;
    const name = rows[rowIndex].cells[0];
    this.topics_service.deleteTopic(name).then(this.refreshTopicList);
  };

  partitionClicked(value, xtraInfo) {
    const { rows } = this.state;
    const { rowIndex } = xtraInfo;
    rows[rowIndex].isOpen = !xtraInfo.rowData.isOpen;
    if (rows[rowIndex].isOpen) {
      rows[rowIndex + 1] = {
        parent: rowIndex,
        cells: [<TopicDetailsTable service={this.topics_service} data={xtraInfo.rowData.name.title} />]
      };
    } else {
      rows[rowIndex + 1] = {
        parent: rowIndex,
        cells: [<React.Fragment />]
      };
    }

    this.setState({
      rows
    });
  }

  formatName = (value, _xtraInfo) => value;

  formatReplicas = value => (
    <span className="table-cell-icon">
      <ReplicatorIcon size="md" />
      {value}
    </span>
  );

  formatConsumers = value => (
    <span className="table-cell-icon">
      <UserFriendsIcon size="md" />
      {value}
    </span>
  );

  formatPartition = (value, xtraInfo) => (
    <React.Fragment>
      <Button
        variant="plain"
        aria-label="Show partition information"
        onClick={() => this.partitionClicked(value, xtraInfo)}
        className="partition-icon-button"
      >
        <RegionsIcon size="md" color="#007BBA" />
      </Button>
      <span className="topics-region-value">{value}</span>
    </React.Fragment>
  );

  onSelect = (_event, isSelected, rowId) => {
    let rows;
    if (rowId === -1) {
      rows = this.state.rows.map(oneRow => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      rows = [...this.state.rows];
      rows[rowId].selected = isSelected;
    }
    this.setState({
      rows
    });
  };

  onSort = (_event, index, direction) => {
    this.state.rows.forEach((row, i) => {
      row.orgIndex = i;
    });
    const mainRows = this.state.rows.filter(row => 'isOpen' in row);
    let sortedRows = mainRows.sort((a, b) => {
      if (a[index] < b[index]) return -1;
      else if (a[index] > b[index]) return 1;
      return 0;
    });
    sortedRows = SortByDirection.asc ? sortedRows : sortedRows.reverse();
    const finalRows = [];
    sortedRows.forEach((row, i) => {
      finalRows.push(row);
      const child = this.state.rows[row.orgIndex + 1];
      child.parent = i;
      finalRows.push(child);
    });
    this.setState({
      sortBy: {
        index,
        direction
      },
      rows: finalRows
    });
  };

  /* topics is an array of these
  {
      "name": "my-topic-2",
      "partitions": [
        { "id": 0, "leader": 1, "replicas": [1, 0, 2], "isr": [1, 0, 2] },
        { "id": 1, "leader": 2, "replicas": [2, 1, 0], "isr": [2, 1, 0] },
        { "id": 2, "leader": 0, "replicas": [0, 2, 1], "isr": [0, 2, 1] }],
      "consumers": 0
    }
  */
  onTopicList(topics, justCreated) {
    let { rows, pageNumber } = this.state;
    let justCreatedIndex = -1;
    this.allRows = [];
    rows = [];
    topics.forEach((topic, i) => {
      if (topic.name === justCreated) {
        justCreatedIndex = i * 2;
      }
      // each partition should have the same number of replicas, so just count the 1st
      const replicas = topic.partitions[0].replicas.length;
      rows.push({
        isOpen: false,
        cells: [topic.name, topic.partitions.length, replicas, topic.consumers]
      });
      rows.push({
        parent: i * 2,
        cells: ['child']
      });
    });
    pageNumber = 1;
    if (justCreatedIndex > 0) {
      const tmp = rows[0];
      rows[0] = rows[justCreatedIndex];
      rows[justCreatedIndex] = tmp;
    }
    this.allRows = rows.slice();
    this.handleSetPage(pageNumber);
  }

  handleSetPage = pageNumber => {
    const totalRows = this.allRows.length / 2;
    const { rowsPerPage } = this.state;
    const start = (pageNumber - 1) * (rowsPerPage * 2);
    const end = Math.min(totalRows * 2, start + rowsPerPage * 2);
    const rows = this.allRows.slice(start, end);
    this.fixParents(rows);
    this.setState({ rows, pageNumber, totalRows });
  };

  fixParents = rows => {
    rows.forEach((row, i) => {
      if (row.parent) {
        row.parent = i - 1;
      }
    });
  };

  onCollapse = (event, rowKey, isOpen) => {
    const { rows } = this.state;
    /**
     * Please do not use rowKey as row index for more complex tables.
     * Rather use some kind of identifier like ID passed with each row.
     */
    rows[rowKey].isOpen = isOpen;
    this.setState({
      rows
    });
  };

  onTableAction = (action, name) => {
    const { rows } = this.state;
    if (action === 'Delete selected topics') {
      const deleteList = rows.filter(row => row.cells.length > 1 && row.selected).map(row => row.cells[0]);
      this.topics_service.deleteTopicList(deleteList).then(this.refreshTopicList());
    } else if (action === 'topic created') {
      this.refreshTopicList(name);
    } else if (action === 'paged') {
      this.handleSetPage(this.state.pageNumber, this.state.totalRows);
    }
  };

  render() {
    const { columns, rows, actions, sortBy, serverError, firstLoad } = this.state;
    if (serverError) {
      return <ServerError />;
    }
    if (firstLoad) {
      return <TopicsLoading />;
    }
    if (rows.length === 0) {
      return <TopicsEmpty onAction={this.onTableAction} service={this.topics_service} />;
    }

    return (
      <div id="topicTableWrapper">
        <TopicsToolbar
          rows={this.state.rows}
          totalRows={this.state.totalRows}
          pageNumber={this.state.pageNumber}
          rowsPerPage={this.state.rowsPerPage}
          onAction={this.onTableAction}
          handleSetPage={this.handleSetPage}
          service={this.topics_service}
        />
        <Table
          aria-label="Topics table"
          className="topics-table-table"
          actions={actions}
          onSelect={this.onSelect}
          onCollapse={this.onCollapse}
          sortBy={sortBy}
          onSort={this.onSort}
          rows={rows}
          cells={columns}
        >
          <TableHeader className="topics-table-header" />
          <TableBody />
        </Table>
      </div>
    );
  }
}

export default TopicsTable;
