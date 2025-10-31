{
    "name": "Project Gantt Pro (Free View Type)",
    "summary": "Custom Gantt view type (gantt_free) for Project Tasks (Community friendly)",
    "version": "17.0.1.0.0",
    "license": "LGPL-3",
    "author": "MetaProject",
    "depends": ["base", "web", "project"],
    "assets": {
        "web.assets_backend": [
            "project_gantt_pro_free/static/src/js/gantt_client_action.js",
            "project_gantt_pro_free/static/src/xml/gantt_templates.xml",
        ],
    },
    "data": [
        "views/project_task_gantt_view.xml",
    ],
    "application": False,
    "installable": True,
}
