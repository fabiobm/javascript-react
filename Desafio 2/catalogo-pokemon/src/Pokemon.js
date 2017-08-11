import React, { Component } from 'react';


// Esse componente gerencia um Pokémon na lista e tem componentes InfoExtra
// como filhos. Recebe o número do pokémon, as informações sobre ele, o índice
// na array e a função a ser executada quando o estado de carregando muda.

class Pokemon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sprite: null,   // imagem
            tipos: [],
            stats: {},
            altura: null,
            peso: null,
            hidden: true,   // indica se informações extras estão visíveis
            erro: false,
            loading: false, // indica se está carregando
        }

        this.maisInfo = this.maisInfo.bind(this);
    }

    // Quando carrega pela primeira vez, pega as informações do pokémon
    componentDidMount() {
        this.setState({ loading: true });
        this.props.carregando(this.props.idx, true);
        fetch('https://pokeapi.co/api/v2/pokemon/' + this.props.infos.name)
            .then(res => res.json())
            .then(res => {
                const sprite = res.sprites.front_default;
                const tipos = res.types.map(obj => obj.type.name);
                
                // a altura e o peso estão multiplicados por 10 na PokéAPI
                const altura = res.height / 10;
                const peso = res.weight / 10;

                const stats = res.stats.map(obj => ({
                    name: obj.stat.name,
                    value: obj.base_stat
                }));
                this.props.carregando(this.props.idx, false);
                this.setState({
                    sprite: sprite,
                    tipos: tipos,
                    stats: stats,
                    altura: altura,
                    peso: peso,
                    erro: false,
                    loading: false
                });
            })
            .catch(() => {
                this.props.carregando(this.props.idx, false);
                this.setState({ erro: true, loading: false });
            });
    }

    // Quando o nome do Pokémon é clicado, exibe informações extras
    maisInfo() {
        if (this.state.loading) // não mostra enquanto está carregando
            return;
        this.setState((prevState, props) => ({ hidden: !prevState.hidden }));
    }

    // Recebe os nomes dos tipos e retorna um texto organizado
    textoTipos(tipos) {
        if (tipos.length < 1 || tipos.length > 2)
            return null

        const tipo1 = tipos[0][0].toUpperCase() + tipos[0].slice(1);
        if (tipos.length === 1)
            return tipo1;
        return tipos[1][0].toUpperCase() + tipos[1].slice(1) + '/' + tipo1;
    }

    // Recebe os nomes e valores dos stats e retorna um texto organizado
    textoStats(stats) {
        var texto = [];
        for (var i = stats.length - 1; i > 0; i--) {
            if (stats[i].name === 'hp')
                texto.push('HP: ' + stats[i].value);
            if (stats[i].name === 'attack')
                texto.push('ATTACK: ' + stats[i].value);
            if (stats[i].name === 'defense')
                texto.push('DEFENSE: ' + stats[i].value);
            if (stats[i].name === 'special-attack')
                texto.push('SP. ATK: ' + stats[i].value);
            if (stats[i].name === 'special-defense')
                texto.push('SP. DEF: ' + stats[i].value);
            if (stats[i].name === 'speed')
                texto.push('SPEED: ' + stats[i].value);
        }
        return texto;
    }

    render() {
        const erro = <h5>Erro ao carregar informações.<br/>Tente novamente mais tarde.</h5>;
        const conteudoImg = <img src={this.state.sprite} alt="Pokémon Sprite" />;
        const conteudoTipos = this.textoTipos(this.state.tipos);
        const conteudoStats = this.textoStats(this.state.stats);
        const conteudoAltura = this.state.altura + 'm';
        const conteudoPeso = this.state.peso + 'kg';
        
        return(
            <tr style={{opacity: this.state.loading ? 0.5 : 1}}>
                <td>
                <button type="button" onClick={this.maisInfo}>
                    {this.state.loading ?
                        "Carregando..."
                        : (this.props.infos.name[0].toUpperCase() +
                            this.props.infos.name.slice(1))
                    }
                </button>
                </td>
                <InfoExtra hidden={this.state.hidden} erro={this.state.erro} mensagemErro={erro} conteudo={conteudoImg} />
                <InfoExtra hidden={this.state.hidden} erro={this.state.erro} mensagemErro={erro} conteudo={conteudoTipos} />
                {conteudoStats.map(stat =>
                    <InfoExtra key={stat} hidden={this.state.hidden} erro={this.state.erro} mensagemErro={erro} conteudo={stat} />
                )}
                <InfoExtra hidden={this.state.hidden} erro={this.state.erro} mensagemErro={erro} conteudo={conteudoAltura} />
                <InfoExtra hidden={this.state.hidden} erro={this.state.erro} mensagemErro={erro} conteudo={conteudoPeso} />
            </tr>
        );
    }
}


// Esse componente representa um item de informação extra de um Pokémon e
// recebe o conteúdo a ser exibido e flags indicando se deve ficar oculto ou
// exibir uma mensagem de erro

function InfoExtra(props) {
    return (
        <td hidden={props.hidden}>
            <div hidden={props.erro}>
                {props.conteudo}
            </div>
            {props.erro ? props.mensagemErro : null}
        </td>
    );
}

export default Pokemon;
