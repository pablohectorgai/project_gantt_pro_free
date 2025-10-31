/** @odoo-module **/

export class GanttFreeModel {
    setup(env, params) {
        this.env = env;
        this.params = params;
        this.orm = env.services.orm;
        this.action = env.config.action;
        this.arch = params.archInfo || {};
        this.state = {
            records: [],
            date_start: this.arch.date_start || "create_date",
            date_stop: this.arch.date_stop || "date_deadline",
            default_group_by: this.arch.default_group_by || null,
            workdays_only: !!(this.arch.workdays_only && this.arch.workdays_only !== "0"),
            model: params.resModel,
            domain: params.domain || [],
            context: params.context || {},
        };
    }

    async load() {
        const fields = [
            "name",
            "id",
            this.state.date_start,
            this.state.date_stop,
            "user_id",
            "project_id",
            "create_date",
        ];
        const data = await this.orm.searchRead(
            this.state.model,
            this.state.domain,
            fields,
            { context: this.state.context }
        );
        this.state.records = data;
        return data;
    }

    async writeDateRange(recordId, startISO, endISO) {
        const vals = {};
        vals[this.state.date_start] = startISO;
        vals[this.state.date_stop] = endISO;
        await this.orm.write(this.state.model, [recordId], vals);
    }
}
