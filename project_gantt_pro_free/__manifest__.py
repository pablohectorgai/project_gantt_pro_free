{
    "name": "Project Gantt (Free)",
    "version": "17.0.1.0.0",
    "license": "LGPL-3",
    "author": "MetaProject",
    "depends": ["base", "web", "project"],
    "data": [
        "views/project_gantt_menu.xml",
    ],
    "assets": {
        "web.assets_backend": [
            "project_gantt_pro_free/static/src/js/gantt_client_action.js",
            "project_gantt_pro_free/static/src/xml/gantt_templates.xml",
        ],
    },
    "installable": True,
}
