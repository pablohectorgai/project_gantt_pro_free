/** @odoo-module **/

import { Component } from "@odoo/owl";
import { useBus } from "@web/core/utils/hooks";

export class GanttFreeController extends Component {
    setup() {
        this.bus = useBus();
    }

    async reload() {
        this.bus.trigger("gantt_free:reload");
    }

    setMode(ev) {
        const mode = ev.target.value;
        const canvas = this.el.querySelector(".o_gantt_free_canvas");
        const gantt = canvas && canvas.gantt;
        if (gantt) {
            gantt.change_view_mode(mode);
        } else {
            this.bus.trigger("gantt_free:reload");
        }
    }
}

GanttFreeController.template = "project_gantt_pro_free.GanttFreeController";
