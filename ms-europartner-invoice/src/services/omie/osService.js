const { apiOmie } = require("../../config/apiOmie");
const logger = require("../../config/logger");

const osService = {
  listarOS: async (omieAuth) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const body = {
      call: "ListarOS",
      app_key: omieAuth.appKey,
      app_secret: omieAuth.appSecret,
      param: [{ filtrar_por_etapa: "30" }],
    };

    try {
      const response = await apiOmie.post("servicos/os/", body);
      return response.data.osCadastro;
    } catch (error) {
      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data.faultstring === "ERROR: Não existem registros para a página [1]!"
      ) {
        return [];
      } else {
        logger.error(`Erro ao listar OS: ${error.message}`);
        console.error(`Erro ao listar OS: ${error.message}`);
        throw error;
      }
    }
  },

  consultarOS: async (omieAuth, codOs) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const body = {
      call: "ConsultarOS",
      app_key: omieAuth.appKey,
      app_secret: omieAuth.appSecret,
      param: [{ nCodOS: codOs }],
    };

    try {
      const response = await apiOmie.post("servicos/os/", body);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao consultar OS ${codOs}: ${error.message}`);
      console.error(`Erro ao consultar OS ${codOs}: ${error.message}`);
      throw error;
    }
  },

  trocarEtapaOS: async (omieAuth, codOs, etapa, observacao) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const body = {
      call: "AlterarOS",
      app_key: omieAuth.appKey,
      app_secret: omieAuth.appSecret,
      param: [{ nCodOS: codOs, cEtapa: etapa, cObservacao: observacao }],
    };

    try {
      const response = await apiOmie.post("servicos/os/", body);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao trocar etapa da OS ${codOs} para ${etapa}: ${error.message}`);
      console.error(`Erro ao trocar etapa da OS ${codOs} para ${etapa}: ${error.message}`);
      throw error;
    }
  },

  alterarOS: async (omieAuth, os) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const body = {
      call: "AlterarOS",
      app_key: omieAuth.appKey,
      app_secret: omieAuth.appSecret,
      param: [os],
    };

    try {
      const response = await apiOmie.post("servicos/os/", body);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao alterar OS ${os.nCodOS}: ${error.message}`);
      console.error(`Erro ao alterar OS ${os.nCodOS}: ${error.message}`);
      throw error;
    }
  },

  montarOsAlterada: async (
    omieAuth,
    codOs,
    etapa,
    anteciparParcelas,
    categoriaAdiantamento,
    contaCorrenteAdiantamento,
    observacoes
  ) => {
    const os = await osService.consultarOS(omieAuth, codOs);
    const novaOs = {
      Cabecalho: {
        nCodOS: codOs,
        dDtPrevisao: os.Cabecalho.dDtPrevisao,
        cCodParc: "999",
      },
      Observacoes: {
        cObsOS: `${observacoes}\n${os.Observacoes.cObsOS}`,
      },
    };

    if (etapa) novaOs.Cabecalho.cEtapa = etapa;
    if (anteciparParcelas) {
      novaOs.Parcelas = os.Parcelas.map((parcela) => ({
        ...parcela,
        parcela_adiantamento: "S",
        categoria_adiantamento: categoriaAdiantamento,
        conta_corrente_adiantamento: contaCorrenteAdiantamento,
      }));
    }
    return novaOs;
  },
};

module.exports = osService;
