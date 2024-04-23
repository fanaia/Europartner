const { apiRetaguarda } = require("./config/apiRetaguarda");
const invoiceService = require("./services/invoiceService");
const osService = require("./services/omie/osService");

const checkOSs = async (empresa) => {
  try {
    console.log(`Verificando OSs da empresa ${empresa.nome}...`);
    const oss = await osService.listarOS(empresa.authOmie);

    console.log(`Total de OSs encontradas da empresa ${empresa.nome}: ${oss.length}`);

    for (const os of oss) {
      console.log(`Processar OS ${os.Cabecalho.nCodOS}...`);
      await invoiceService.gerarInvoice(empresa.authOmie, os.Cabecalho.nCodOS);
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log(`Verificação de OSs da empresa ${empresa.nome} concluída.`);

    // Aguarde 2 minutos após a conclusão e, em seguida, execute novamente
    setTimeout(() => checkOSs(empresa), 1 * 60 * 1000);
  }
};

const app = async () => {
  console.log("Iniciando ms-europartner-invoice...");

  try {
    const resEmpresas = await apiRetaguarda.get(`empresas?ativo=true`);
    const empresas = resEmpresas.data;

    for (const empresa of empresas) {
      checkOSs(empresa);
    }
  } catch (error) {
    console.error(error);
  }
};

app();
