const fetch = require("node-fetch");
const { compactFile } = require("../../components/fileHandler");
const { apiOmie } = require("../../config/apiOmie");
const logger = require("../../config/logger");

const anexoService = {
  incluirAnexoInvoiceOS: async (omieAuth, codOs, arquivo) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      return await anexoService.incluirAnexo(
        omieAuth,
        "ordem-servico",
        codOs,
        `invoice-${codOs}.pdf`,
        "pdf",
        arquivo
      );
    } catch (error) {
      logger.error(`Erro ao incluir anexo na OS ${codOs}: ${error.message}`);
      console.error(`Erro ao incluir anexo na OS ${codOs}: ${error.message}`);
      // throw error;
    }
  },

  incluirAnexo: async (omieAuth, tabela, id, nomeArquivo, tipoArquivo, arquivo) => {
    try {
      const arquivoCompactado = await compactFile(arquivo, `invoice-${id}.pdf`);

      const param = {
        cCodIntAnexo: "",
        cTabela: tabela,
        nId: id,
        cNomeArquivo: nomeArquivo,
        cTipoArquivo: tipoArquivo,
        cArquivo: arquivoCompactado.base64File,
        cMd5: arquivoCompactado.md5,
      };

      const body = {
        call: "IncluirAnexo",
        app_key: omieAuth.appKey,
        app_secret: omieAuth.appSecret,
        param: [param],
      };

      const response = await apiOmie.post("geral/anexo/", body);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao incluir anexo na tabela ${tabela} com ID ${id}: ${error.message}`);
      console.error(`Erro ao incluir anexo na tabela ${tabela} com ID ${id}: ${error.message}`);
      // throw error;
    }
  },

  listarAnexo: async (omieAuth, tabela, id) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const param = {
        nPagina: 1,
        nRegPorPagina: 50,
        nId: id,
        cTabela: tabela,
      };

      const body = {
        call: "ListarAnexo",
        app_key: omieAuth.appKey,
        app_secret: omieAuth.appSecret,
        param: [param],
      };

      const response = await apiOmie.post("geral/anexo/", body);
      return response.data;
    } catch (error) {
      logger.error(`Erro ao listar anexos na tabela ${tabela} com ID ${id}: ${error.message}`);
      console.error(`Erro ao listar anexos na tabela ${tabela} com ID ${id}: ${error.message}`);
      // throw error;
    }
  },

  obterAnexo: async (omieAuth, cTabela, nId, nIdAnexo) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const param = {
        cTabela: cTabela,
        nId: nId,
        nIdAnexo: nIdAnexo,
      };

      const body = {
        call: "ObterAnexo",
        app_key: omieAuth.appKey,
        app_secret: omieAuth.appSecret,
        param: [param],
      };

      const response = await apiOmie.post("geral/anexo/", body);
      return response.data;
    } catch (error) {
      logger.error(
        `Erro ao obter anexo na tabela ${cTabela} com ID ${nId} e ID do anexo ${nIdAnexo}: ${error.message}`
      );
      console.error(
        `Erro ao obter anexo na tabela ${cTabela} com ID ${nId} e ID do anexo ${nIdAnexo}: ${error.message}`
      );
      // throw error;
    }
  },

  listarAnexoBuffer: async (omieAuth, idOrdemServico) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    try {
      const anexos = await anexoService.listarAnexo(omieAuth, "ordem-servico", idOrdemServico);
      if (!anexos || !anexos.listaAnexos) return [];

      const listaAnexos = anexos.listaAnexos;

      const listaAnexosBuffer = await Promise.all(
        listaAnexos.map(async (anexo) => {
          try {
            const { cNomeArquivo, cLinkDownload } = await anexoService.obterAnexo(
              omieAuth,
              anexo.cTabela,
              anexo.nId,
              anexo.nIdAnexo
            );

            const resposta = await fetch(cLinkDownload);
            const fileBuffer = await resposta.buffer();

            return {
              filename: cNomeArquivo,
              fileBuffer: fileBuffer,
            };
          } catch (error) {
            logger.error(
              `Erro ao obter buffer do anexo ${anexo.nIdAnexo} da OS ${idOrdemServico}: ${error.message}`
            );
            console.error(
              `Erro ao obter buffer do anexo ${anexo.nIdAnexo} da OS ${idOrdemServico}: ${error.message}`
            );
            throw error;
          }
        })
      );

      return listaAnexosBuffer;
    } catch (error) {
      console.error(`Erro ao listar buffers de anexos da OS ${idOrdemServico}: ${error.message}`);
      throw error;
    }
  },
};

module.exports = anexoService;
