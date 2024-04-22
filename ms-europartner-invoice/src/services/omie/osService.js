const logger = require("../../config/logger");
const { apiOmie } = require("../../config/apiOmie");

const osService = {
  listarOS: async (omieAuth) => {
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
        throw error.message;
      }
    }
  },

  consultarOS: async (omieAuth, codOs) => {
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
      // Tratamento de erro
      console.log(error.message);
      throw error.message;
    }
  },

  trocarEtapaOS: async (omieAuth, codOs, etapa, observacao) => {
    const os = await osService.consultarOS(omieAuth, codOs);
    const novaObs = os.Observacoes.observacao
      ? observacao + "/n" + os.Observacoes.observacao
      : observacao;

    const novaOs = {
      Cabecalho: {
        nCodOS: codOs,
        cEtapa: etapa,
      },
      Observacoes: { cObsOS: novaObs },
    };
    return await osService.alterarOS(omieAuth, novaOs);
  },

  alterarOS: async (omieAuth, os) => {
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
      logger.error(`${error.stack}`);
      logger.info(`Erro ao alterar OS: ${JSON.stringify(body)}`);

      if (error.response && error.response.status === 500) {
        throw new error("Erro ao alterar OS", error.response.data);
      } else {
        throw new error("Erro ao alterar OS", error.message);
      }
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
