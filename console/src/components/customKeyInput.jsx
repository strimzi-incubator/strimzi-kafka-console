import React from 'react';

class CustomKeyInput extends React.Component {
  constructor(props) {
    super(props);
    this.customTopicConigs = [
      {
        name: 'cleanup.policy',
        description: 'A string that is either "delete" or "compact". This string designates the retention policy to use on old log segments.The default policy("delete") will discard old segments when their retention time or size limit has been reached.The "compact" setting will enable log compaction on the topic.list',
        type: 'list',
        default: 'delete',
        validValues: '[compact, delete]',
        serverDefaultProperty: 'log.cleanup.policy',
        importance: 'medium'
      },
      {
        name: 'compression.type',
        description: 'Specify the final compression type for a given topic. This configuration accepts the standard compression codecs(gzip, snappy, lz4, zstd). It additionally accepts \'uncompressed\' which is equivalent to no compression; and \'producer\' which means retain the original compression codec set by the producer.',
        type: 'string',
        default: 'producer',
        validValues: '[uncompressed, zstd, lz4, snappy, gzip, producer]',
        serverDefaultProperty: 'compression.type',
        importance: 'medium'
      },
      {
        name: 'delete.retention.ms',
        description: 'The amount of time to retain delete tombstone markers for log compacted topics.This setting also gives a bound on the time in which a consumer must complete a read if they begin from offset 0 to ensure that they get a valid snapshot of the final stage(otherwise delete tombstones may be collected before they complete their scan).',
        type: 'long',
        default: '86400000',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.cleaner.delete.retention.ms',
        importance: 'medium'
      },
      {
        name: 'file.delete.delay.ms',
        description: 'The time to wait before deleting a file from the filesystem',
        type: 'long',
        default: '60000',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.cleaner.delete.retention.ms',
        importance: 'medium'
      },
      {
        name: 'flush.messages',
        description: 'This setting allows specifying an interval at which we will force an fsync of data written to the log.For example if this was set to 1 we would fsync after every message; if it were 5 we would fsync after every five messages.In general we recommend you not set this and use replication for durability and allow the operating system\'s background flush capabilities as it is more efficient.This setting can be overridden on a per - topic basis(see the per - topic configuration section).',
        type: 'long',
        default: '9223372036854775807',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.flush.interval.messages',
        importance: 'medium'
      },

      {
        name: 'flush.ms',
        description: 'This setting allows specifying a time interval at which we will force an fsync of data written to the log.For example if this was set to 1000 we would fsync after 1000 ms had passed.In general we recommend you not set this and use replication for durability and allow the operating system\'s background flush capabilities as it is more efficient.',
        type: 'long',
        default: '9223372036854775807',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.flush.interval.ms',
        importance: 'medium'
      },

      {
        name: 'follower.replication.throttled.replicas',
        description: 'A list of replicas for which log replication should be throttled on the follower side.The list should describe a set of replicas in the form[PartitionId]: [BrokerId], [PartitionId]: [BrokerId]:...or alternatively the wildcard ' * ' can be used to throttle all replicas for this topic.',
        type: 'list',
        default: '',
        validValues: '[partitionId], [brokerId]: [partitionId], [brokerId]:...',
        serverDefaultProperty: 'follower.replication.throttled.replicas',
        importance: 'medium'
      },

      {
        name: 'index.interval.bytes',
        description: 'This setting controls how frequently Kafka adds an index entry to its offset index.The default setting ensures that we index a message roughly every 4096 bytes.More indexing allows reads to jump closer to the exact position in the log but makes the index larger.You probably don\'t need to change this.',
        type: 'int',
        default: '4096',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.index.interval.bytes',
        importance: 'medium'
      },

      {
        name: 'leader.replication.throttled.replicas',
        description: 'A list of replicas for which log replication should be throttled on the leader side.The list should describe a set of replicas in the form[PartitionId]: [BrokerId], [PartitionId]: [BrokerId]:...or alternatively the wildcard ' * ' can be used to throttle all replicas for this topic.',
        type: 'list',
        default: '',
        validValues: '[partitionId], [brokerId]: [partitionId], [brokerId]:...',
        serverDefaultProperty: 'leader.replication.throttled.replicas',
        importance: 'medium'
      },

      {
        name: 'max.message.bytes',
        description: 'The largest record batch size allowed by Kafka.If this is increased and there are consumers older than 0.10.2, the consumers\' fetch size must also be increased so that the they can fetch record batches this large.In the latest message format version, records are always grouped into batches for efficiency.In previous message format versions, uncompressed records are not grouped into batches and this limit only applies to a single record in that case.',
        type: 'int',
        default: '1000012',
        validValues: '[0,...]',
        serverDefaultProperty: 'message.max.bytes',
        importance: 'medium'
      },

      {
        name: 'message.format.version',
        description: 'Specify the message format version the broker will use to append messages to the logs.The value should be a valid ApiVersion.Some examples are: 0.8.2, 0.9.0.0, 0.10.0, check ApiVersion for more details.By setting a particular message format version, the user is certifying that all the existing messages on disk are smaller or equal than the specified version.Setting this value incorrectly will cause consumers with older versions to break as they will receive messages with a format that they don\'t understand.',
        type: 'string',
        default: '2.1-IV2',
        validValues: 'kafka.api.ApiVersionValidator$@56aac163',
        serverDefaultProperty: 'log.message.format.version',
        importance: 'medium'
      },

      {
        name: 'message.timestamp.difference.max.ms',
        description: 'The maximum difference allowed between the timestamp when a broker receives a message and the timestamp specified in the message.If message.timestamp.type = CreateTime, a message will be rejected if the difference in timestamp exceeds this threshold.This configuration is ignored if message.timestamp.type = LogAppendTime.',
        type: 'long',
        default: '9223372036854775807',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.message.timestamp.difference.max.ms',
        importance: 'medium'
      },

      {
        name: 'message.timestamp.type',
        description: 'Define whether the timestamp in the message is message create time or log append time.The value should be either`CreateTime` or`LogAppendTime`',
        type: 'string',
        default: 'CreateTime',
        validValues: '[CreateTime, LogAppendTime]',
        serverDefaultProperty: 'log.message.timestamp.type',
        importance: 'medium'
      },

      {
        name: 'min.cleanable.dirty.ratio',
        description: 'This configuration controls how frequently the log compactor will attempt to clean the log(assuming log compaction is enabled).By default we will avoid cleaning a log where more than 50 % of the log has been compacted.This ratio bounds the maximum space wasted in the log by duplicates(at 50 % at most 50 % of the log could be duplicates).A higher ratio will mean fewer, more efficient cleanings but will mean more wasted space in the log.',
        type: 'double',
        default: '0.5',
        validValues: '[0,..., 1]',
        serverDefaultProperty: 'log.cleaner.min.cleanable.ratio',
        importance: 'medium'
      },

      {
        name: 'min.compaction.lag.ms',
        description: 'The minimum time a message will remain uncompacted in the log.Only applicable for logs that are being compacted.',
        type: 'long',
        default: '0',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.cleaner.min.compaction.lag.ms',
        importance: 'medium'
      },

      {
        name: 'min.insync.replicas',
        description: 'When a producer sets acks to "all"(or "-1"), this configuration specifies the minimum number of replicas that must acknowledge a write for the write to be considered successful.If this minimum cannot be met, then the producer will raise an exception(either NotEnoughReplicas or NotEnoughReplicasAfterAppend). When used together, min.insync.replicas and acks allow you to enforce greater durability guarantees.A typical scenario would be to create a topic with a replication factor of 3, set min.insync.replicas to 2, and produce with acks of "all".This will ensure that the producer raises an exception if a majority of replicas do not receive a write.',
        type: 'int',
        default: '1',
        validValues: '[1,...]',
        serverDefaultProperty: 'min.insync.replicas',
        importance: 'medium'
      },

      {
        name: 'preallocate',
        description: 'True if we should preallocate the file on disk when creating a new log segment.',
        type: 'boolean',
        default: 'false',
        validValues: 'log.preallocate',
        importance: 'medium'
      },

      {
        name: 'retention.bytes',
        description: 'This configuration controls the maximum size a partition(which consists of log segments) can grow to before we will discard old log segments to free up space if we are using the "delete" retention policy.By default there is no size limit only a time limit.Since this limit is enforced at the partition level, multiply it by the number of partitions to compute the topic retention in bytes.',
        type: 'long - 1',
        default: '',
        validValues: '',
        serverDefaultProperty: 'log.retention.bytes',
        importance: 'medium'
      },

      {
        name: 'retention.ms',
        description: 'This configuration controls the maximum time we will retain a log before we will discard old log segments to free up space if we are using the "delete" retention policy.This represents an SLA on how soon consumers must read their data.If set to - 1, no time limit is applied.',
        type: 'long',
        default: '604800000',
        validValues: '',
        serverDefaultProperty: 'log.retention.ms',
        importance: 'medium'
      },

      {
        name: 'segment.bytes',
        description: 'This configuration controls the segment file size for the log.Retention and cleaning is always done a file at a time so a larger segment size means fewer files but less granular control over retention.',
        type: 'int',
        default: '1073741824',
        validValues: '[14,...]',
        serverDefaultProperty: 'log.segment.bytes',
        importance: 'medium'
      },

      {
        name: 'segment.index.bytes',
        description: 'This configuration controls the size of the index that maps offsets to file positions.We preallocate this index file and shrink it only after log rolls.You generally should not need to change this setting.',
        type: 'int',
        default: '10485760',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.index.size.max.bytes',
        importance: 'medium'
      },

      {
        name: 'segment.jitter.ms',
        description: 'The maximum random jitter subtracted from the scheduled segment roll time to avoid thundering herds of segment rolling',
        type: 'long',
        default: '0',
        validValues: '[0,...]',
        serverDefaultProperty: 'log.roll.jitter.ms',
        importance: 'medium'
      },

      {
        name: 'segment.ms',
        description: 'This configuration controls the period of time after which Kafka will force the log to roll even if the segment file isn\'t full to ensure that retention can delete or compact old data.',
        type: 'long',
        default: '604800000',
        validValues: '[1,...]',
        serverDefaultProperty: 'log.roll.ms',
        importance: 'medium'
      },

      {
        name: 'unclean.leader.election.enable',
        description: 'Indicates whether to enable replicas not in the ISR set to be elected as leader as a last resort, even though doing so may result in data loss.',
        type: 'boolean',
        default: 'false',
        validValues: '',
        serverDefaultProperty: 'unclean.leader.election.enable',
        importance: 'medium'
      },

      {
        name: 'message.downconversion.enable',
        description: 'This configuration controls whether down - conversion of message formats is enabled to satisfy consume requests.When set to false, broker will not perform down - conversion for consumers expecting an older message format.The broker responds with UNSUPPORTED_VERSION error for consume requests from such older clients.This configurationdoes not apply to any message format conversion that might be required for replication to followers.',
        type: 'boolean',
        default: 'true',
        validValues: '',
        serverDefaultProperty: 'log.message.downconversion.enable',
        importance: 'low'
      }
    ];


    this.options = [
      { value: 'KB', disabled: false },
      { value: 'MB', disabled: false },
      { value: 'GB', disabled: false },
      { value: 'TB', disabled: false },
      { value: 'ZB', disabled: false }
    ];
    this.default = props.initialName;
    this.state = {
      isExpanded: false,
      selected: null
    };
  }

  onSelect = (event) => {
    this.setState({
      isExpanded: false
    });
    this.props.onSelect(event.target.value);

  };

  render() {
    const titleId = 'custom-topic-config';
    return (
      <div className={this.props.className}>
        <span id={titleId} hidden>
          Custom config topic
        </span>
        <select
          aria-label="Select Input"
          className="pf-c-form-control"
          aria-labelledby={titleId}
          aria-invalid={false}
          defaultValue={this.default}
          onChange={this.onSelect}
        >
          {this.customTopicConigs.map((option, index) => (
            <option
              label=''
              value={option.name}
              key={index}
            >{option.name}</option>
          ))}
        </select>
      </div>
    );
  }
}

export default CustomKeyInput;