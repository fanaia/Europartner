const { apiRetaguarda } = require("../config/apiRetaguarda");

const authOmieMiddleware = async (req, res, next) => {
  const { ping, appKey } = req.body;

  if (ping) return res.status(200).json();

  const empresa = await apiRetaguarda
    .get(`empresas?authOmie.appKey=${appKey}`)
    .then((res) => res.data[0]);

  if (!empresa || !empresa.ativo) {
    return res.status(401).json({ message: "Empresa não autorizada ou inativa na Retaguarda" });
  }

  req.body.authOmie = {
    appKey: empresa.authOmie.appKey,
    appSecret: empresa.authOmie.appSecret,
  };
  next();
};

module.exports = { authOmieMiddleware };
