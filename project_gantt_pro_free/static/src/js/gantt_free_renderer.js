/** @odoo-module **/

import { Component, onMounted, useExternalListener } from "@odoo/owl";
import { useBus, useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";

export class GanttFreeRenderer extends Component {
    setup() {
        this.notification = useService("notification");
        this.bus = useBus();
        onMounted(() => this._renderGantt());
        useExternalListener(window, "resize", () => this._renderGantt());
        this.bus.addEventListener("gantt_free:reload", () => this._renderGantt());
    }

    get model() {
        return this.props.model;
    }

    _normalize(records) {
        const sField = this.model.state.date_start;
        const eField = this.model.state.date_stop;

        return records.map((r) => {
            let start = r[sField] || r.create_date || r[eField];
            let end = r[eField] || r[sField] || r.create_date;
            const toDate = (d) => (d ? String(d).substring(0, 10) : null);
            return {
                id: r.id,
                name: r.name || `#${r.id}`,
                start: toDate(start),
                end: toDate(end),
                progress: 0,
                custom_class: "",
                _raw: r,
            };
        });
    }

    async _renderGantt() {
        const wrapper = this.el.querySelector(".o_gantt_free_canvas");
        if (!wrapper) {
            return;
        }
        wrapper.innerHTML = "";

        const records = await this.model.load();
        const tasks = this._normalize(records);

        if (!window.Gantt) {
            wrapper.innerHTML =
                '<div class="alert alert-warning">Falta la librería Frappe-Gantt. Verifica assets.</div>';
            return;
        }

        const options = {
            view_modes: ["Day", "Week", "Month"],
            view_mode: "Week",
            custom_popup_html: (task) =>
                `<div class="o-gantt-popup"><h6>${task.name}</h6><p>${task._start} → ${task._end}</p></div>`,
            on_date_change: async (task, start, end) => {
                try {
                    const startISO = start.toISOString().substring(0, 10);
                    const endISO = end.toISOString().substring(0, 10);
                    await this.model.writeDateRange(task.id, startISO, endISO);
                    this.notification.add(_t("Fechas actualizadas"), { type: "success" });
                } catch (e) {
                    this.notification.add(_t("Error al guardar fechas"), { type: "danger" });
                    console.error(e);
                }
            },
        };

        this.gantt = new window.Gantt(wrapper, tasks, options);
        wrapper.gantt = this.gantt;
    }
}

GanttFreeRenderer.template = "project_gantt_pro_free.GanttFreeRenderer";
