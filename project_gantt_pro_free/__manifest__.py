{
    "name": "Project Gantt Pro (Free View Type)",
    "summary": "Custom Gantt view type (gantt_free) for Project Tasks (Community friendly)",
    "version": "17.0.1.0.0",
    "license": "LGPL-3",
    "author": "MetaProject",
    "depends": ["web", "project"],
    "assets": {
        "web.assets_backend": [
            "project_gantt_pro_free/static/lib/frappe-gantt.min.css",
            "project_gantt_pro_free/static/lib/frappe-gantt.min.js",
            "project_gantt_pro_free/static/src/xml/gantt_free_templates.xml",
            "project_gantt_pro_free/static/src/js/gantt_free_model.js",
            "project_gantt_pro_free/static/src/js/gantt_free_renderer.js",
            "project_gantt_pro_free/static/src/js/gantt_free_controller.js",
            "project_gantt_pro_free/static/src/js/gantt_free_view.js",
        ],
    },
    "data": [
        "views/assets.xml",
        "views/project_task_gantt_view.xml",
    ],
    "application": False,
    "installable": True,
}
