import logo from './logo.svg';
import './App.css';
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AddPessoa from "./components/add-pessoa.component";
import PessoasList from "./components/pessoas-list.component";
import Pessoa from "./components/pessoa.component";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/pessoas" className="navbar-brand">
          Elotech
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/pessoas"} className="nav-link">
              Pessoas
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/cadastrar"} className="nav-link">
              Cadastrar
            </Link>
          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/pessoas"]} component={PessoasList} />
          <Route exact path="/cadastrar" component={AddPessoa} />
          <Route path="/pessoas/:id" component={Pessoa} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
