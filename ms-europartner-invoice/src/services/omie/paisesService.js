const { apiOmie } = require("../../config/apiOmie");

const paisesService = {
  consultarPais: async (omieAuth, codPais) => {
    const body = {
      call: "ListarPaises",
      app_key: omieAuth.appKey,
      app_secret: omieAuth.appSecret,
      param: [{ filtrar_por_codigo: codPais }],
    };

    try {
      const response = await apiOmie.post("geral/paises/", body);
      return response.data;
    } catch (error) {
      // Tratamento de erro
      throw error.message;
    }
  },
};

module.exports = paisesService;
