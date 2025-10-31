/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component, onWillStart, useState } from "@odoo/owl";

class ProjectGanttFree extends Component {
    setup() {
        this.state = useState({});
        onWillStart(async () => {
            // TODO: load tasks/projects data via RPC if needed
        });
    }
}

ProjectGanttFree.template = "project_gantt_pro_free.GanttRoot";

registry.category("actions").add("project_gantt_pro_free.gantt", (env, props) => {
    return { Component: ProjectGanttFree, props };
});
