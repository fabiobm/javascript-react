import React, { Component } from 'react';
import Pokemon from './Pokemon.js';


// Esse componente gerencia a lista e tem componentes Pokémon como filhos.
// Recebe o limite de pokémon por página, o offset (por qual número começar)
// e a função a ser executado quando o estado de carregando mudar.

class Lista extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pokes: [],
            erro: false,
            loading: false,  // indica se algum sub-componente está carregando
        };

        this.pokeLoadingChanged = this.pokeLoadingChanged.bind(this);
    }

    // Callback executado pelo Pokémon quando ele muda seu estado de carregando
    pokeLoadingChanged(idx, loading) {
        const poke = this.state.pokes[idx];
        const newPoke = {   // cria novo Pokémon, mudando apenas loading
            num: poke.num,
            infos: poke.infos,
            idx: poke.idx,
            loading: loading
        };

        // cria nova array substituindo apenas o pokémon do índice certo
        const pokes = this.state.pokes.map(poke =>
            poke.idx === idx ? newPoke : poke);
        const loadingState = pokes.some(poke => poke.loading);
        this.props.carregando(loadingState);
        this.setState({ pokes: pokes, loading: loadingState });
    }

    // Pega na PokéAPI a lista de Pokémon de acordo com o offset atual
    // (definido pela página)
    pegaLista() {
        const url = 'https://pokeapi.co/api/v2/pokemon/?limit=';
        this.props.carregando(true);
        this.setState({ loading: true })
        fetch(url + this.props.limite + '&offset=' + this.props.offset)
            .then(res => res.json())
            .then(res => {
                const pokes = res.results.map(function(poke, idx) {
                    return {
                        num: poke.url.slice(-3, -1),
                        infos: poke,
                        idx: idx,
                        loading: false
                    };
                });
                this.props.carregando(false);
                this.setState({
                    pokes: pokes,
                    erro: false,
                    loading: false,
                });
            })
            .catch(err => {
                this.props.carregando(false);
                this.setState({ erro: true, loading: false })
            });
    }

    // Quando carrega pela primeira vez, pega a lista
    componentDidMount() {
        this.pegaLista();
    }

    // Quando atualiza, se o limite ou offset forem diferentes, pega a lista
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.limite !== this.props.limite || prevProps.offset !== this.props.offset) {
            this.pegaLista();
        }
    }

    render() {
        const erro = <h2>Erro ao carregar lista.<br/>Tente novamente mais tarde.</h2>;
        return (
            <div style={{opacity: this.state.loading ? 0.5 : 1}}>
                <h1>Catálogo Pokémon</h1>
                {this.state.erro ? erro : null}
                {this.state.loading
                    ? <h2><br/><br/>Carregando...</h2>
                    : null
                }
                <table>
                    <tbody>
                    {this.state.pokes.map(poke =>
                        <Pokemon key={poke.infos.name} num={poke.num} infos={poke.infos} idx={poke.idx} carregando={this.pokeLoadingChanged}/>
                    )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Lista;
