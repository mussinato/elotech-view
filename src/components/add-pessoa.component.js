import React, { useState } from "react";
import PessoaService from "../services/pessoa.service";
import { cpf } from 'cpf-cnpj-validator'; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddPessoa = () => {
    const initialPessoaState = {
        id: null,
        nome: "",
        cpf: "",
        dataNascimento: "",
        contatos: []
    };
    const initialContatoState = {
      id: null,
      nome: "",
      telefone: "",
      email: ""
    };
    const [currentPessoa, setCurrentPessoa] = useState(initialPessoaState);
    const [currentContato, setCurrentContato] = useState(initialContatoState);
    const [errors, setErrors] = useState([]);
    const [errorsContato, setErrorsContato] = useState([]);
    const [contatos, setContatos] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [editandoContato, setEditandoContato] = useState(false);
    
    const handleInputChange = event => {
      const { name, value } = event.target;
      setCurrentPessoa({ ...currentPessoa, [name]: value });
    };

    const handleInputChangeContato = event => {
      const { name, value } = event.target;
      setCurrentContato({ ...currentContato, [name]: value });
    };

    const setDate = (date) => {
      setCurrentPessoa({ ...currentPessoa, dataNascimento: date });
    }

    const savePessoa = () => {
      newContato();
      let errors = validarPessoa(currentPessoa);
      
      if (errors.length <= 0) {
        console.log(currentPessoa);
        const { nome, cpf, dataNascimento, contatos } = currentPessoa;
        let dataFormatada = dataNascimento.toISOString().slice(0, 10);
        console.log("dataFormatada",dataFormatada);
        PessoaService.create({ nome, cpf, dataNascimento:dataFormatada, contatos })
          .then(response => {
            setSubmitted(true);
          })
          .catch(e => {
            console.log(e);
          });
        }
    };

    const saveContato = () => {
      let errors = validarContato(currentContato);
      if (errors.length <= 0){
        const list = currentPessoa.contatos.push(currentContato);
        setCurrentPessoa({ ...currentPessoa, [contatos]:list });
        newContato();
      }
    }
  
    const newPessoa = () => {
      setErrors([]);
      setCurrentPessoa(initialPessoaState);
      setContatos([]);
      setSubmitted(false);
      newContato();
    };

    const newContato = () => {
      setErrorsContato([]);
      setCurrentContato(initialContatoState);
      setEditandoContato(false);
      setCurrentIndex(-1);
    }

    const addContato = () => {
      setEditandoContato(true);
    }

    const validarPessoa = (data) => {
      let errors = [];

      if (!data.nome){
        errors.push({
          field:"nome",
          message:"Informe o nome"
        });
      }
      if (!data.cpf){
        errors.push({
          field:"cpf",
          message:"Informe o CPF"
        });        
      } else if (!cpf.isValid(data.cpf)){
        errors.push({
          field:"cpf",
          message:"CPF inválido"
        });        
      }
      if (!data.dataNascimento){
        errors.push({
          field:"dataNascimento",
          message:"Informe a data de nascimento"
        });
      }
      if (data.contatos.length <= 0){
        errors.push({
          field:"contatos",
          message:"É necessário adicionar ao menos um contato"
        });
      }
      console.log(errors);
      setErrors(errors);
      return errors;
    }

    const hasError = (field, errors) => {
      let errorsFilter = errors.filter(row => row.field == field);
      return errorsFilter.length > 0;
    }

    const getErrors = (field, errors) => {
      let errorsFilter = errors.filter(row => row.field == field).map(row => row.message);
      return (
        errorsFilter && errorsFilter.map((error, index) => (
          <div key={index} className="invalid-validation">{error}</div>
        ))
      );
    }

    const validarContato = (data) => {
      let errors = [];
      
      if (!data.nome) {
        errors.push({
          field:"nome",
          message:"Informe o nome"
        });
      }
      if (!data.telefone) {
        errors.push({
          field:"telefone",
          message:"Informe o telefone"
        });
      }
      if (!data.email) {
        errors.push({
          field:"email",
          message:"Informe o email"
        });
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
        errors.push({
          field:"email",
          message:"E-mail inválido"
        });
      }
      console.log(errors);
      setErrorsContato(errors);
      return errors;
    }

    return (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>Pessoa cadastrada com sucesso!</h4>
              <button className="btn btn-success" onClick={newPessoa}>
                Cadastrar Nova Pessoa
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={currentPessoa.nome}
                  onChange={handleInputChange}
                  className={`form-control ${hasError("nome",errors) ? 'is-invalid' : ''}`}
                />
                {getErrors("nome",errors)}
              </div>
    
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input
                  type="text"
                  id="cpf"
                  name="cpf"
                  value={currentPessoa.cpf}
                  onChange={handleInputChange}
                  className={`form-control ${hasError("cpf",errors) ? 'is-invalid' : ''}`}                    
                />
                {getErrors("cpf",errors)}
              </div>

              <div className="form-group">
                <label htmlFor="dataNascimento">Data de Nascimento</label><br/>
                <DatePicker
                  dateFormat="dd/MM/yyyy"
                  id="dataNascimento"
                  name="dataNascimento"
                  selected={currentPessoa.dataNascimento}
                  onChange={setDate}
                  maxDate={new Date()}
                  showMonthYearDropdown
                  className={`form-control ${hasError("dataNascimento",errors) ? 'is-invalid' : ''}`}                    
                />
                {getErrors("dataNascimento",errors)}
              </div>
             
             <br/>
              <ul className="list-group">
              {currentPessoa.contatos && currentPessoa.contatos.map((contato, index) => (
                  <li
                    className={"list-group-item " + (index === currentIndex ? "active" : "")}
                    key={index}
                  >
                    {contato.nome} - {contato.telefone} - {contato.email}
                  </li>
                ))}
              </ul>
              
              {editandoContato ? (
                <>
                <br/>
                <div className="form-group">
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={currentContato.nome}
                    onChange={handleInputChangeContato}
                    placeholder="Nome do Contato"
                    className={`form-control ${hasError("nome",errorsContato) ? 'is-invalid' : ''}`}                    
                  />
                  {getErrors("nome",errorsContato)}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    value={currentContato.telefone}
                    onChange={handleInputChangeContato}
                    placeholder="Telefone"
                    className={`form-control ${hasError("telefone",errorsContato) ? 'is-invalid' : ''}`}                    
                  />
                  {getErrors("telefone",errorsContato)}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={currentContato.email}
                    onChange={handleInputChangeContato}
                    placeholder="Email"
                    className={`form-control ${hasError("email",errorsContato) ? 'is-invalid' : ''}`}                    
                  />
                  {getErrors("email",errorsContato)}
                </div>

                <button type="button" className="btn btn-primary" onClick={saveContato}>
                  Salvar Contato
                </button>
                <button
                  type="button"
                  onClick={newContato}
                  className="btn btn-warning float-right"
                >
                  Cancelar
                </button>
                </>
              ):(
                <>
                <br/>
                <button
                  type="button"
                  onClick={addContato}
                  className="btn btn-warning"
                >
                  Adicionar Contato
                </button>       
                {getErrors("contatos",errors)}    
                </>
              )}
              <br/>
              <br/>
              <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={savePessoa}>
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={newPessoa}
                  className="btn btn-warning float-right"
                  style={{margin: 20}}
                >
                  Limpar Campos
                </button>
              </div>
            </div>
                        
          )}
        </div>
      );
  };
  
  export default AddPessoa;