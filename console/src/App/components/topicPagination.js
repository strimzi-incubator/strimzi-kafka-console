import React from 'react';
import PropTypes from 'prop-types';
import 'patternfly-react/dist/css/patternfly-react.css';

class TopicPagination extends React.Component {
  static propTypes = {
    totalRows: PropTypes.number.isRequired,
    pageNumber: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    handleSetPage: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      hideDropDown: true
    };
  }

  getPageStart() {
    return this.props.totalRows === 0 ? 0 : (this.props.pageNumber - 1) * this.props.rowsPerPage + 1;
  }

  getPageEnd() {
    return Math.min(this.props.totalRows, this.getPageStart() + this.props.rowsPerPage - 1);
  }

  getTotalPages() {
    return Math.ceil(this.props.totalRows / this.props.rowsPerPage);
  }

  handleNextPage = () => {
    const pageNumber = Math.min(this.getTotalPages(), this.props.pageNumber + 1);
    this.props.handleSetPage(pageNumber);
  };

  handlePreviousPage = () => {
    const pageNumber = Math.max(1, this.props.pageNumber - 1);
    this.props.handleSetPage(pageNumber);
  };

  handleFirstPage = () => {
    this.props.handleSetPage(1);
  };

  handleLastPage = () => {
    this.props.handleSetPage(this.getTotalPages());
  };

  handlePageChange = e => {
    const { value } = e.target;
    console.log('changed page number to ');
    console.log(value);
    const pageNumber = Math.max(1, Math.min(Number(value), this.getTotalPages()));
    console.log(`setting pageNumber to ${pageNumber}`);
    this.props.handleSetPage(pageNumber);
  };

  handleToggleDropDown = () => {
    const hideDropDown = !this.state.hideDropDown;
    this.setState({ hideDropDown });
  };

  render() {
    return (
      <div className="pf-c-pagination pf-m-footer" aria-label="Element pagination">
        <div className="pf-c-options-menu">
          <span id="pagination-options-menu-bottom-example-label" hidden>
            Items per page:
          </span>
          <div className="pf-c-options-menu__toggle pf-m-text pf-m-plain">
            <span className="pf-c-options-menu__toggle-text">
              <b>
                {this.getPageStart()} - {this.getPageEnd()}
              </b>{' '}
              of <b>{this.props.totalRows}</b> Items
            </span>
            <button
              className="pf-c-options-menu__toggle-button hidden"
              id="pagination-options-menu-bottom-example-toggle"
              onClick={this.handleToggleDropDown}
              aria-haspopup="listbox"
              aria-expanded="false"
              aria-labelledby="pagination-options-menu-bottom-example-label pagination-options-menu-bottom-example-toggle"
              aria-label="Select"
            >
              <i className="fas fa-caret-down" aria-hidden="true" />
            </button>
          </div>
          <ul
            className="pf-c-options-menu__menu"
            aria-labelledby="pagination-options-menu-bottom-example-label"
            hidden={this.state.hideDropDown}
          >
            <li>
              <button className="pf-c-options-menu__menu-item">
                5<i className="fas fa-check pf-c-options-menu__menu-item-icon" aria-hidden="true" />
              </button>
            </li>
            <li>
              <button className="pf-c-options-menu__menu-item pf-m-selected">10</button>
            </li>
            <li>
              <button className="pf-c-options-menu__menu-item">20</button>
            </li>
          </ul>
        </div>
        <nav className="pf-c-pagination__nav" aria-label="Pagination">
          <button
            className={`pf-c-button pf-m-plain${this.props.pageNumber > 1 ? '' : ' pf-m-disabled'}`}
            aria-label="Go to first page"
            aria-disabled="true"
            onClick={this.handleFirstPage}
          >
            <i className="fas fa-angle-double-left" aria-hidden="true" />
          </button>
          <button
            className={`pf-c-button pf-m-plain${this.props.pageNumber > 1 ? '' : ' pf-m-disabled'}`}
            aria-label="Go to previous page"
            aria-disabled="true"
            onClick={this.handlePreviousPage}
          >
            <i className="fas fa-angle-left" aria-hidden="true" />
          </button>
          <div
            className="pf-c-pagination__nav-page-select"
            aria-label={`Current page ${this.props.pageNumber} of ${this.getTotalPages()}`}
          >
            <input
              className="pf-c-form-control"
              aria-label="Current page"
              type="number"
              min="1"
              max={this.getTotalPages()}
              size="2"
              value={this.props.pageNumber}
              onChange={this.handlePageChange}
            />
            <span aria-hidden="true">of {this.getTotalPages()}</span>
          </div>
          <button
            className={`pf-c-button pf-m-plain${this.props.pageNumber < this.getTotalPages() ? '' : ' pf-m-disabled'}`}
            onClick={this.handleNextPage}
            aria-label="Go to next page"
          >
            <i className="fas fa-angle-right" aria-hidden="true" />
          </button>
          <button
            className={`pf-c-button pf-m-plain${this.props.pageNumber < this.getTotalPages() ? '' : ' pf-m-disabled'}`}
            onClick={this.handleLastPage}
            aria-label="Go to last page"
          >
            <i className="fas fa-angle-double-right" aria-hidden="true" />
          </button>
        </nav>
      </div>
    );
  }
}

export default TopicPagination;
