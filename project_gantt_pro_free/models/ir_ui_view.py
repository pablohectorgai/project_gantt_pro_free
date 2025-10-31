from odoo import fields, models


class IrUiView(models.Model):
    _inherit = "ir.ui.view"

    type = fields.Selection(
        selection_add=[("gantt_free", "Gantt Free")],
        ondelete={"gantt_free": "cascade"},
    )
