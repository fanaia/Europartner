const invoiceService = require("../services/invoiceService");

class osController {
  static async etapaAlterada(req, res) {
    const { topic, event, author, authOmie } = req.body;
    if (topic !== "OrdemServico.EtapaAlterada") return res.status(400).json();

    if (event.etapa == process.env.OMIE_ETAPA_GERAR_INVOICE)
      invoiceService.gerarInvoice(authOmie, event.idOrdemServico);

    return res.status(200).json();
  }
}

module.exports = osController;
