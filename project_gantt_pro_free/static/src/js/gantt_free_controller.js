/** @odoo-module **/

import { Component, useState } from "@odoo/owl";

export class GanttFreeController extends Component {
    setup() {
        this.state = useState({ reloadKey: 0, mode: "Week" });
    }

    reload() {
        this.state.reloadKey += 1;
    }

    setMode(ev) {
        const mode = ev.target.value;
        this.state.mode = mode;
        const canvas = this.el.querySelector(".o_gantt_free_canvas");
        const gantt = canvas && canvas.gantt;
        if (gantt) {
            gantt.change_view_mode(mode);
        } else {
            this.state.reloadKey += 1;
        }
    }
}

GanttFreeController.template = "project_gantt_pro_free.GanttFreeController";
