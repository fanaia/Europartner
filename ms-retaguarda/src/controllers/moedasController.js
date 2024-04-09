const Moeda = require("../models/moeda");

class MoedaController {
  static async create(req, res) {
    const moeda = new Moeda(req.body);
    await moeda.save();
    res.status(201).send(moeda);
  }

  static async read(req, res) {
    const moedas = await Moeda.find(req.query);

    const valores = await Promise.all(moedas.map((moeda) => moeda.getValor()));
    const moedasComValores = moedas.map((moeda, i) => ({ ...moeda._doc, cotacao: valores[i] }));
    res.send(moedasComValores);
  }

  static async readOne(req, res) {
    const moeda = await Moeda.findById(req.params.id);
    if (!moeda) {
      return res.status(404).send("Moeda not found");
    }
    const valorCotacao = await moeda.getValor();
    res.send({ ...moeda._doc, valorCotacao });
  }

  static async update(req, res) {
    const updateData = req.body;
    if (updateData.nome == "") return res.status(400).send("Nome is required");

    const moeda = await Moeda.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!moeda) {
      return res.status(404).send("Moeda not found");
    }
    res.send(moeda);
  }

  static async delete(req, res) {
    const moeda = await Moeda.findByIdAndDelete(req.params.id);
    if (!moeda) {
      return res.status(404).send("Moeda not found");
    }
    res.status(204).send();
  }
}

module.exports = MoedaController;
