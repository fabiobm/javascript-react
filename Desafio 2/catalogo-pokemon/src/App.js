import React, { Component } from 'react';
import Paginas from './Paginas.js'
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        const totalPaginas = Math.ceil(811 / 20);   // 811 é o total de pokémon
        var paginas = [];
        for (var i = 0; i < totalPaginas; i++)
            paginas.push(i + 1);
        this.state = {paginas: paginas};
    }

    render() {
        return(
            <div>
                <Paginas paginas={this.state.paginas} />
            </div>
        );
    }
}

export default App;
