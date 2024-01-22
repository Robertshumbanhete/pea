const conn = require("./_db_connection");

async function _update_claim_state(claim_id, user_id, description, state, fund_id) {
  try {
    const sql_1 = "INSERT INTO `claim_status`(  `fund_id`, `claim_id`, `user_id`, `description`, `state`) VALUES (?,?,?,?,? );";
    const parameters_1 = [fund_id, claim_id, user_id, description, state];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    return res_message_1.insertId;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function _get_claim_details(claim_id) {
  try {
    const sql_1 = "SELECT claims.id , claims.event_date, claims.report_date, CONCAT(individuals.first_name, ' ', individuals.middle_name,' ',individuals.last_name,' (', individuals.national_id, ')') AS reported_by FROM claims INNER JOIN individuals ON claims.claimant_id = individuals.id WHERE claims.id = ?;";
    const parameters_1 = [claim_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return res_message_1[0];
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

async function get_fund_name(fund_id) {
  try {
    const sql_1 = "SELECT funds.fund_name FROM funds WHERE funds.id = ?;";
    const parameters_1 = [fund_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return res_message_1[0].fund_name;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

async function _get_member_name(member_id) {
  try {
    const sql_1 = "SELECT CONCAT(individuals.first_name, ' ',individuals.middle_name, ' ', individuals.last_name) AS member_name FROM individuals WHERE individuals.id = ?;";
    const parameters_1 = [member_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return res_message_1[0].member_name;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

async function _get_member_national_id(member_id) {
  try {
    const sql_1 = "SELECT individuals.national_id FROM individuals WHERE individuals.id = ?;";
    const parameters_1 = [member_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return res_message_1[0].national_id;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

async function _get_last_salary(member_id, fund_id) {
  try {
    const sql_1 = "SELECT contributions_employees.salary FROM contributions_employees INNER JOIN contributions ON contributions.id = contributions_employees.contributions_id WHERE contributions_employees.member_id = ? AND contributions.fund_id = ? ORDER BY contributions.contribution_month DESC LIMIT 1;";
    const parameters_1 = [member_id, fund_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return res_message_1[0].salary;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

async function _get_total_contribution_period(member_id, fund_id) {
  try {
    const sql_1 = "SELECT COUNT(DISTINCT contributions.contribution_month ) as total_contribution_period FROM contributions_employees INNER JOIN contributions ON contributions.id = contributions_employees.contributions_id WHERE contributions_employees.member_id = ? AND contributions.fund_id = ?;";
    const parameters_1 = [member_id, fund_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return res_message_1[0].total_contribution_period;
    } else {
      return undefined;
    }
  } catch (error) {
    return undefined;
  }
}

async function _get_benefit_calculation(member_id, fund_id) {
  try {
    const last_salary = await _get_last_salary(member_id, fund_id);

    if (last_salary) {
      const total_contribution_period = await _get_total_contribution_period(member_id, fund_id);

      if (total_contribution_period) {
        contribution_benefit = last_salary * total_contribution_period * 0.02;
      } else {
        contribution_benefit = undefined;
      }
    } else {
      contribution_benefit = undefined;
    }
  } catch (error) {
    console.log(error);
    contribution_benefit = undefined;
  }

  return contribution_benefit;
}

async function update_process_claim_log(fund_id, user_id, claim_id, dep_id, action, rel_rec, description) {
  try {
    const sql_1 = "INSERT INTO `claims_process_log`(   `fund_id`, `user_id`,  `claim_id`, `dep_id`,`action`, `rel_rec`, `description` ) VALUES ( ?,?,?,?,?,?,?);";
    const parameters_1 = [fund_id, user_id, claim_id, dep_id, action, rel_rec, description];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    return res_message_1.insertId;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function get_claim_report(fund_id, claim_id) {
  try {
    const sql_1 = "SELECT claims_process_log.dep_id , claims_process_log.claim_id, claims_process_log.action , claims_process_log.description, claims_process_log.date FROM claims_process_log WHERE claims_process_log.fund_id = ? AND claims_process_log.claim_id = ?   AND claims_process_log.rel_rec = 0;";
    const parameters_1 = [fund_id, claim_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    const calim_report = res_message_1;

    console.log(calim_report);

    return calim_report;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function _get_currency() {
  try {
    const sql_1 = "SELECT currency.id, currency.code FROM currency WHERE currency.status = 1;";
    const parameters_1 = [];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function _get_vendor_address() {
  try {
    const sql_1 = "SELECT system_parameters.company_details FROM system_parameters ;";
    const parameters_1 = [];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results[0].company_details;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

module.exports = {
  _update_claim_state,
  _get_claim_details,
  get_fund_name,
  _get_member_name,
  _get_member_national_id,
  _get_last_salary,
  _get_total_contribution_period,
  _get_benefit_calculation,
  update_process_claim_log,
  get_claim_report,
  _get_currency,
  _get_vendor_address,
};
