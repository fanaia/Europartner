import React, { useState, useEffect, useRef } from "react";
import { Form, Card, FormControl, InputGroup } from "react-bootstrap";
import { loadMoeda, updateTipoCotacao, updateValor } from "../services/moedaService";

const MoedaEdit = ({ moeda }) => {
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [simbolo, setSimbolo] = useState("");
  const [tipoCotacao, setTipoCotacao] = useState("cotacao");
  const [valorCotacao, setValorCotacao] = useState(0);
  const [valorFinal, setValorFinal] = useState(0);
  const [porcentagem, setPorcentagem] = useState(0);
  const [valorFixo, setValorFixo] = useState(0);

  const fetchMoeda = async () => {
    const moedaData = await loadMoeda(moeda);
    setId(moedaData._id);
    setNome(moedaData.nome);
    setSimbolo(moedaData.simbolo);
    setTipoCotacao(moedaData.tipoCotacao);
    setValorCotacao(moedaData.cotacao.valorCotacao);
    setValorFinal(moedaData.cotacao.valorFinal);

    switch (moedaData.tipoCotacao) {
      case "porcentagem":
        setPorcentagem(moedaData.valor);
        setValorFixo((moedaData.cotacao.valorCotacao * (moedaData.valor / 100)).toFixed(4));
        break;
      case "valorFixo":
        setValorFixo(moedaData.valor);
        setPorcentagem((moedaData.valor / moedaData.cotacao.valorCotacao) * 100);
        break;
      default:
        setPorcentagem(100);
        setValorFixo(moedaData.cotacao.valorCotacao.toFixed(4));
        break;
    }
  };

  useEffect(() => {
    fetchMoeda();
  }, [moeda]);

  const handleTipoCotacaoChange = async (e) => {
    await updateTipoCotacao(id, e);

    if (e === "cotacao") await updateValor(id, 0);
    if (e === "porcentagem") await updateValor(id, porcentagem);
    if (e === "valorFixo") await updateValor(id, valorFixo);

    fetchMoeda();
  };

  const timeoutRef = useRef(null);
  const handlePorcentagemChange = (e) => {
    setPorcentagem(e.target.value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await updateValor(id, e.target.value);
      fetchMoeda();
    }, 500);
  };

  const handleValorFixoChange = (e) => {
    setValorFixo(e.target.value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      await updateValor(id, e.target.value);
      fetchMoeda();
    }, 500);
  };

  return (
    <div className="col-md-4">
      <Card className="mb-3">
        <Card.Header>
          <b>{nome}</b> ({simbolo}) : {`R$ ${valorFinal}`}
        </Card.Header>
        <Card.Body>
          <Form>
            <InputGroup>
              <InputGroup.Radio
                checked={tipoCotacao === "cotacao"}
                onChange={() => handleTipoCotacaoChange("cotacao")}
              />
              <InputGroup.Text className="w-100" style={{ maxWidth: "130px" }}>
                Cotação Online
              </InputGroup.Text>
              <FormControl type="text" disabled={true} value={`${valorCotacao}`} />
            </InputGroup>

            <InputGroup>
              <InputGroup.Radio
                checked={tipoCotacao === "porcentagem"}
                onChange={() => handleTipoCotacaoChange("porcentagem")}
              />
              <InputGroup.Text className="w-100" style={{ maxWidth: "130px" }}>
                Valor %
              </InputGroup.Text>
              <FormControl
                type="text"
                disabled={tipoCotacao !== "porcentagem"}
                onChange={handlePorcentagemChange}
                value={porcentagem}
              />
            </InputGroup>

            <InputGroup>
              <InputGroup.Radio
                checked={tipoCotacao === "valorFixo"}
                onChange={() => handleTipoCotacaoChange("valorFixo")}
              />
              <InputGroup.Text className="w-100" style={{ maxWidth: "130px" }}>
                Valor fixo
              </InputGroup.Text>
              <FormControl
                type="number"
                disabled={tipoCotacao !== "valorFixo"}
                onChange={handleValorFixoChange}
                value={valorFixo}
              />
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MoedaEdit;
