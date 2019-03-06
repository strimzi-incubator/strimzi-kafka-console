import React from 'react';
import PropTypes from 'prop-types';

class AgeSelectInput extends React.Component {
  constructor(props) {
    super(props);

    this.default = 'days';
  }
  static options = {
    msecs: 1,
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 7 * 24 * 60 * 60 * 1000,
    years: 52 * 7 * 24 * 60 * 60 * 60 * 1000
  };

  static propTypes = {
    onSelect: PropTypes.func.isRequired
  };

  static convertToMS = (unit, value) => AgeSelectInput.options[unit] * value;

  onSelect = event => {
    this.props.onSelect(event.target.value);
  };

  options = () => {
    const opts = AgeSelectInput.options;
    // options sorted by age
    const ordered = Object.keys(opts).sort((a, b) => {
      if (opts[a] < opts[b]) return -1;
      if (opts[b] < opts[a]) return 1;
      return 0;
    });
    return ordered.map((unit, index) => (
      <option label="" value={unit} key={`age-${index}`}>
        {unit}
      </option>
    ));
  };

  render() {
    const titleId = 'ageSelect';
    return (
      <div>
        <span id={titleId} hidden>
          Select age period
        </span>
        <select
          aria-label="Select Input"
          className="pf-c-form-control"
          aria-labelledby={titleId}
          aria-invalid={false}
          defaultValue={this.default}
          onChange={this.onSelect}
        >
          {this.options()}
        </select>
      </div>
    );
  }
}

export default AgeSelectInput;
