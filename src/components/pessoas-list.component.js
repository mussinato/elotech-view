import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import PessoaService from "../services/pessoa.service";

const PessoasList = () => {
  const [currentPessoa, setCurrentPessoa] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [pessoas, setPessoas] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    pesquisar(1);
  }, []);

  const setActivePessoa = (pessoa, index) => {
    setCurrentPessoa(pessoa);
    setCurrentIndex(index);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    pesquisar(value);
    setCurrentIndex(-1);
  }

  const pesquisar = (page) => {
    PessoaService.getAll(page-1, pageSize)
      .then(response => {
        if (response.status == 200){
          setPessoas(response.data.content);
          setTotalPages(response.data.totalPages);
        }
      })
      .catch(e => {
        console.log(e);
      });;;
  }

  return (
    <div className="list row">
      <div className="col-md-6">
        <h4>Pessoas</h4>

        <div className="mt-3">
          <Pagination
            className="my-3"
            count={totalPages}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>

        <ul className="list-group">
          {pessoas &&
            pessoas.map((pessoa, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActivePessoa(pessoa, index)}
                key={index}
              >
                {pessoa.nome}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-md-6">
        <br/>
        <br/><br/><br/>
        {currentPessoa ? (
          <div>
            <h4>Pessoa</h4>
            <div>
              <label>
                <strong>Nome:</strong>
              </label>{" "}
              {currentPessoa.nome}
            </div>
            <div>
              <label>
                <strong>CPF:</strong>
              </label>{" "}
              {currentPessoa.cpf}
            </div>
            <div>
              <label>
                <strong>Data de Nascimento:</strong>
              </label>{" "}
              {currentPessoa.dataNascimento}
            </div>
            
            <Link
              to={"/pessoas/" + currentPessoa.id}
              className="btn btn-primary float-right"
              style={{margin: 20}}
            >
              Editar
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Selecione uma pessoa para visualizar...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PessoasList;