import React, { Component } from 'react';
import Lista from './Lista.js';


// Esse componente gerencia a paginação e tem o componente Lista como filho.
// Recebe uma array representando a lista de páginas.

class Paginas extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pagina: 1,
            offset: 0,
            loading: false  // indica se algum sub-componente está carregando
        };

        this.trocaPagina = this.trocaPagina.bind(this);
        this.trocaPaginaInput = this.trocaPaginaInput.bind(this);
        this.listaLoadingChanged = this.listaLoadingChanged.bind(this);
    }

    // Callback executado pela Lista quando ela muda seu estado de carregando
    listaLoadingChanged(loading) {
        this.setState({ loading: loading });
    }

    // Define páginas que vão aparecer na barra de selecionar a página
    paginasClicaveis() {
        const totalPaginas = this.props.paginas.length;
        if (totalPaginas <= 7)
            return this.props.paginas;
        
        var paginaEsquerda = this.state.pagina;
        if (this.state.pagina === this.props.paginas.length)
            paginaEsquerda = totalPaginas - 5;
        else if (this.state.pagina > totalPaginas - 6)
            paginaEsquerda = totalPaginas - 6;

        var paginas = [];
        for (var i = 0; i < 6; i++)
            paginas.push(paginaEsquerda + i);

        return paginas;
    }

    // Muda o estado para indicar troca de página
    trocaPagina(pag) {
        if (this.state.loading)     // não troca enquanto está carregando
            return;
        if (pag >= 1 && pag <= this.props.paginas.length) {
            this.setState({
                pagina: pag,
                offset: 20 * (pag - 1)
            });
        }
    }

    // Pergunta ao usuário a página que ele quer ir e troca (se for válida) 
    trocaPaginaInput() {
        if (this.state.loading)
            return;
        var msg = 'Digite o número da página (de 1 a ';
        msg += this.props.paginas.length + ')';
        var pag = parseInt(prompt(msg), 10);
        if (!isNaN(pag))
            this.trocaPagina(pag);
    }

    render() {
        return (
            <div>
                <Lista limite={20} offset={this.state.offset} carregando={this.listaLoadingChanged}/>
                <br/><br/>
                <div className="paginas" style={{opacity: this.state.loading ? 0.5 : 1}}>
                    <button type="button" onClick={() => this.trocaPagina(this.state.pagina - 1)} className="pagina">❮</button>
                    {this.paginasClicaveis().map(pag =>
                        <button type="button" onClick={() => this.trocaPagina(pag)} className={pag === this.state.pagina ? "pagina active" : "pagina"} key={pag}>
                            {pag}
                        </button>
                    )}
                    <button type="button" onClick={this.trocaPaginaInput} className="pagina">...</button>
                    <button type="button" onClick={() => this.trocaPagina(this.state.pagina + 1)} className="pagina">❯</button>
                </div>
            </div>
        )
    }
}

export default Paginas;
