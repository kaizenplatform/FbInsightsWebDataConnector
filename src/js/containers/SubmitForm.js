import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import moment from 'moment';
import RadioGroupField from '../components/form/fields/RadioGroupField';
import DateRangeField from '../components/form/fields/DateRangeField';
import CheckboxGroupField from '../components/form/fields/CheckboxGroupField';
import insightsColumns from '../schema/insightsColumns';
import insightsFields from '../schema/insightsFields';
import insightsConverters from '../schema/insightsConverters';
import insightsBreakdowns from '../schema/insightsBreakdowns';
import insightsLevels from '../schema/insightsLevels';
import { submit as tableauSubmit } from '../utils/tableau';

const required = (value) => {
  return value ? undefined : 'Required';
};

const validateBreakdown = (value) => {
  return !value || insightsBreakdowns.indexOf(value) ? undefined : 'Invalid';
};

let SubmitForm = class SubmitForm extends Component {
  static propTypes = {
    adAccounts: React.PropTypes.object.isRequired,
  }

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(data) {
    const { adAccounts, adSets, fbStatus } = this.props;
    const { level, dateRange, breakdowns } = data;
    const fields = insightsFields.map(f => f.id);
    const targetSchemaIds = fields.slice().concat(breakdowns);
    const current = adSets.current || adAccounts.current;
    const all = adSets.all || adAccounts.all;

    const connectionData = {
      path: `v2.9/${current}/insights`,
      schema: {
        id: `fb_insights_${current}_${level}`,
        alias: `FB Insights: ${all[current].name} (${level})`,
        columns: insightsColumns.filter((c) => {
          const id = insightsConverters[c.id] ? insightsConverters[c.id].id : c.id;
          return targetSchemaIds.indexOf(id) !== -1;
        }),
      },
      params: {
        level,
        access_token: fbStatus.token,
        fields,
        time_increment: 1,
        breakdowns,
        action_breakdowns: 'action_video_type',
        time_range: {
          since: dateRange.startDate.format('YYYY-MM-DD'),
          until: dateRange.endDate.format('YYYY-MM-DD'),
        },
      },
      converters: insightsConverters,
    };

    tableauSubmit('Facebook Insights Connector', JSON.stringify(connectionData));
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form className="form-horizontal" onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="form-group">
          <Field
            component={RadioGroupField}
            name="level"
            label="Level"
            options={insightsLevels}
            validate={[required]}
          />
        </div>
        <div className="form-group">
          <Field
            component={DateRangeField}
            name="dateRange"
            label="Date Range"
            locale={{ format: 'YYYY/MM/DD' }}
            validate={[required]}
          />
        </div>
        <div className="form-group">
          <Field
            component={CheckboxGroupField}
            name="breakdowns"
            label="Breakdowns"
            options={insightsBreakdowns}
            columnNumber="4"
            validate={[validateBreakdown]}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Get Facebook Insights Data!
        </button>
      </form>
    );
  }
};

SubmitForm = reduxForm({
  form: 'SubmitForm',
  initialValues: { level: 'ad', dateRange: { startDate: moment().add(-30, 'd'), endDate: moment() } },
})(SubmitForm);

function mapStateToProps(state) {
  return {
    adAccounts: state.adAccounts,
    adSets: state.adSets,
    fbStatus: state.fbStatus,
  };
}

export default connect(mapStateToProps)(SubmitForm);
