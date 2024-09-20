const { apiRetaguarda } = require("./config/apiRetaguarda");
const logger = require("./config/logger");
const invoiceService = require("./services/invoiceService");
const osService = require("./services/omie/osService");

const checkOSs = async (empresa) => {
  try {
    console.log(`Verificando OSs da empresa ${empresa.nome}...`);
    const oss = await osService.listarOS(empresa.authOmie);
    console.log(`Total de OSs encontradas da empresa ${empresa.nome}: ${oss.length}`);

    for (const os of oss) {
      try {
        console.log(`Processar OS ${os.Cabecalho.nCodOS}...`);
        await invoiceService.gerarInvoice(empresa.authOmie, os.Cabecalho.nCodOS);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        logger.error(`Erro ao processar OS ${os.Cabecalho.nCodOS}`);
        console.log(`Erro ao processar OS ${os.Cabecalho.nCodOS}`);
      }
    }
  } catch (error) {
    logger.error(`Erro checkOSs: ${error}`);
  } finally {
    console.log(`Verificação de OSs da empresa ${empresa.nome} finalizada.`);
    console.log("");

    // setTimeout(() => checkOSs(empresa), 2 * 60 * 1000);
  }
};

const app = async () => {
  console.log("Iniciando MS-EUROPARTNER-INVOICE...");

  try {
    console.log("Verificando empresas...");
    const resEmpresas = await apiRetaguarda.get(`empresas?ativo=true`);
    const empresas = resEmpresas.data;

    for (const empresa of empresas) {
      console.log(`Verificando empresa ${empresa.nome}...`);
      await checkOSs(empresa);
    }
  } catch (error) {
    console.error(error);
  }
};

app();
