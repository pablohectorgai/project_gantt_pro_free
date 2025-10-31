/** @odoo-module **/

import { Component, onMounted, onWillUpdateProps, useExternalListener } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";

const isWeekend = (d) => {
    const day = d.getUTCDay();
    return day === 0 || day === 6;
};
const toISO = (d) => d.toISOString().substring(0, 10);

function snapToWorkday(date, dir = "auto") {
    const d = new Date(date);
    const goNext = dir === "forward" || (dir === "auto" && isWeekend(d));
    const goPrev = dir === "backward";
    while (isWeekend(d)) {
        d.setUTCDate(d.getUTCDate() + (goPrev ? -1 : 1));
    }
    return d;
}

export class GanttFreeRenderer extends Component {
    setup() {
        this.notification = useService("notification");
        onMounted(() => this._renderGantt(this.props));
        onWillUpdateProps((nextProps) => {
            if (
                nextProps.reloadKey !== this.props.reloadKey ||
                nextProps.viewMode !== this.props.viewMode
            ) {
                this._renderGantt(nextProps);
            }
        });
        useExternalListener(window, "resize", () => this._renderGantt());
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

    async _renderGantt(props = this.props) {
        const wrapper = this.el?.querySelector(".o_gantt_free_canvas");
        if (!wrapper) {
            return;
        }
        wrapper.innerHTML = "";

        const model = props.model || this.props.model;
        const records = await model.load();
        const tasks = this._normalize(records);

        if (!window.Gantt) {
            wrapper.innerHTML =
                '<div class="alert alert-warning">Falta la librería Frappe-Gantt. Verifica assets.</div>';
            return;
        }

        const viewMode = props.viewMode || this.props.viewMode || "Week";
        const options = {
            view_modes: ["Day", "Week", "Month"],
            view_mode: viewMode,
            custom_popup_html: (task) =>
                `<div class="o-gantt-popup"><h6>${task.name}</h6><p>${task._start} → ${task._end}</p></div>`,
            on_date_change: async (task, start, end) => {
                try {
                    if (model.state.workdays_only) {
                        if (isWeekend(start)) {
                            start = snapToWorkday(start, "forward");
                        }
                        if (isWeekend(end)) {
                            end = snapToWorkday(end, "backward");
                        }
                        if (+end < +start) {
                            end = new Date(start);
                            end.setUTCDate(end.getUTCDate() + 1);
                        }
                        const bar = this.gantt?.bar_map.get(task.id);
                        if (bar) {
                            bar.set_start_end(start, end);
                        }
                    }

                    const startISO = toISO(start);
                    const endISO = toISO(end);
                    await model.writeDateRange(task.id, startISO, endISO);
                    this.notification.add(_t("Fechas actualizadas"), { type: "success" });
                } catch (e) {
                    this.notification.add(_t("Error al guardar fechas"), { type: "danger" });
                    console.error(e);
                }
            },
        };

        this.gantt = new window.Gantt(wrapper, tasks, options);
        wrapper.gantt = this.gantt;

        if (model.state.workdays_only) {
            const svg = this.el.querySelector(".o_gantt_free_canvas svg");
            if (svg) {
                const min = this.gantt.date_utils.start_of(this.gantt.gantt_start, "day");
                const max = this.gantt.date_utils.end_of(this.gantt.gantt_end, "day");
                const dayMs = 24 * 3600 * 1000;
                const gridLayer = svg.querySelector(".grid-layer");
                const grid = this.gantt.layers && this.gantt.layers.grid;
                const gridHeight = grid
                    ? grid.getBoundingClientRect().height
                    : svg.getBoundingClientRect().height;

                for (let t = +min; t <= +max; t += dayMs) {
                    const d = new Date(t);
                    if (isWeekend(d)) {
                        const x = this.gantt.get_x(d);
                        const next = new Date(d);
                        next.setUTCDate(next.getUTCDate() + 1);
                        const x2 = this.gantt.get_x(next);
                        const width = Math.max(1, x2 - x);
                        const rect = document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "rect"
                        );
                        rect.setAttribute("x", x);
                        rect.setAttribute("y", 0);
                        rect.setAttribute("width", width);
                        rect.setAttribute("height", gridHeight);
                        rect.setAttribute("fill", "rgba(0,0,0,0.06)");
                        rect.setAttribute("pointer-events", "none");
                        (gridLayer || svg).appendChild(rect);
                    }
                }
            }
        }
    }
}

GanttFreeRenderer.template = "project_gantt_pro_free.GanttFreeRenderer";
