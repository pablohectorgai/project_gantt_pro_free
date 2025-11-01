/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Component } from "@odoo/owl";

class ProjectGanttFree extends Component {}
ProjectGanttFree.template = "project_gantt_pro_free.GanttRoot";

console.log("[PGPF] client action JS cargado ✅");

registry.category("actions").add("project_gantt_pro_free.gantt", (env, props) => {
    return { Component: ProjectGanttFree, props };
});
