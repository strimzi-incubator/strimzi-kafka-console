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
import { Table, TableHeader, TableBody, TableVariant, cellWidth } from '@patternfly/react-table';
import PropTypes from 'prop-types';

class TopicDetailsTable extends React.Component {
  constructor(props) {
    super(props);

    this.fetchDetails(props);
    this.state = {
      columns: [
        {
          title: 'Partition',
          props: { className: 'details-dot details-partition' },
          cellFormatters: [unalignColumn],
          transforms: [cellWidth(10)]
        },
        {
          title: 'Leader',
          props: { className: 'details-dot details-leader' },
          cellFormatters: [unalignColumn],
          transforms: [cellWidth(10)]
        },
        {
          title: 'In sync replicas',
          props: { className: 'pf-u-text-align-center details-dot details-insync' },
          cellFormatters: [formatSyncArray, unalignColumn],
          transforms: [cellWidth(10)]
        },
        {
          title: 'Out of sync replicas',
          props: { className: 'pf-u-text-align-center details-dot details-outsync' },
          cellFormatters: [formatSyncArray, unalignColumn],
          transforms: [cellWidth(20)]
        }
      ],
      rows: []
    };
  }
  static propTypes = {
    service: PropTypes.object.isRequired
  };

  fetchDetails(props) {
    this.props.service.getTopicDetails(props.data).then(details => {
      const { columns } = this.state;
      const rows = [];
      let replicaCount = 0;
      let isrCount = 0;
      details.partitions.forEach(partition => {
        // remove the broker from the lists (assumed to always be the 1st one in the list)
        partition.replicas.splice(0, 1);
        partition.isr.splice(0, 1);

        // accumulate the counts for the table header
        replicaCount += partition.replicas.length;
        isrCount += partition.isr.length;

        // get the list of out-of-sync replicas
        const osr = partition.replicas.filter(r => partition.isr.indexOf(r) === -1);

        // add a details row
        rows.push([partition.id, partition.leader, partition.isr, osr]);
      });
      // update the isr column title
      columns[2].title = `In sync replicas (${isrCount}/${replicaCount})`;

      this.setState({
        rows,
        columns
      });
    });
  }

  render() {
    const { columns, rows } = this.state;

    return (
      <Table
        className="topics-details-table"
        aria-label="Topics table"
        variant={TableVariant.compact}
        cells={columns}
        rows={rows}
      >
        <TableHeader />
        <TableBody />
      </Table>
    );
  }
}

const formatSyncArray = value => value.toString().replace(new RegExp(',', 'g'), ', ');
const unalignColumn = value => <span className="topic-details-data"> {value}</span>;

export default TopicDetailsTable;
