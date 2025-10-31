/** @odoo-module **/

import { registry } from "@web/core/registry";
import { GanttFreeRenderer } from "./gantt_free_renderer";
import { GanttFreeController } from "./gantt_free_controller";
import { GanttFreeModel } from "./gantt_free_model";

export const ganttFreeView = {
    type: "gantt_free",
    display_name: "Gantt Free",
    icon: "fa fa-tasks",
    multiRecord: true,
    Controller: GanttFreeController,
    Renderer: GanttFreeRenderer,
    Model: GanttFreeModel,
    Props: {},
};

registry.category("views").add("gantt_free", ganttFreeView);
