"use strict";


function fatosVigentes(facts, schema) {
    var schemaObj = {};
    for (var i = 0; i < schema.length; i++)     // monta objeto com schema
        schemaObj[schema[i][0]] = schema[i][2];

    var vigentes = [];
    for (var i = 0; i < facts.length; i++) {
        var [ent, atr, val, added] = facts[i];
        
        // se não diz nada no schema, usa cardinalidade 'one' como default
        if (schemaObj[atr] == 'one' || !schemaObj.hasOwnProperty(atr)) {
            var idx = vigentes.findIndex(function(fact) {
                return fact[0] == ent && fact[1] == atr;
            });
            // se a cardinalidade é 'one' e existe tupla com a entidade e
            // o atributo, não vai mais valer, independente do valor e de added
            if (idx != -1)
                vigentes.splice(idx, 1);
        }

        else if (schemaObj[atr] == 'many' && !added) {
            var idx = vigentes.findIndex(function(fact) {
                return fact[0] == ent && fact[1] == atr && fact[2] == val;
            });
            // se a cardinalidade é 'many' e added é false, não vai mais valer
            // se existir uma tupla com a entidade, o atributo E o valor
            if (idx != -1)
                vigentes.splice(idx, 1);
        }

        // se added é verdadeiro, adiciona aos fatos vigentes
        if (added)
            vigentes.push(facts[i]);
    }
    return vigentes;
}


function testa(facts, schemas, expected, total) {
    var sucessos = 0;
    for (var i = 0; i < facts.length; i++) {
        var result = fatosVigentes(facts[i], schemas[i]);
        if (result.sort().toString() == expected[i].sort().toString()) {
            console.log('Teste ' + (i + 1) + ': sucesso');
            sucessos++;
        }
        else {
            console.log('Teste ' + numTeste + ': falha');
            console.log('Esperado: ' + expected[i]);
            console.log('Resultado: ' + result);
        }
    }
    alert(sucessos + ' de ' + total + ' testes passaram.');
}


var facts = [
    [
        ['gabriel', 'endereço', 'av rio branco, 109', true],
        ['joão', 'endereço', 'rua alice, 10', true],
        ['joão', 'endereço', 'rua bob, 88', true],
        ['joão', 'telefone', '234-5678', true],
        ['joão', 'telefone', '91234-5555', true],
        ['joão', 'telefone', '234-5678', false],
        ['gabriel', 'telefone', '98888-1111', true],
        ['gabriel', 'telefone', '56789-1010', true],
    ],
    [
        ['pedro', 'idade', 18, true],
        ['pedro', 'sexo', 'M', false]
    ],
    [
        ['carlos', 'idade', 40, true],
        ['joão', 'idade', 18, true],
        ['joão', 'idade', 21, false]
    ],
    [
        ['maria', 'telefone', '1234-5678', true],
        ['caio', 'telefone', '2345-6789', true],
        ['maria', 'telefone', '1111-2222', false]
    ]
];


var schemas = [
    [
        ['endereço', 'cardinality', 'one'],
        ['telefone', 'cardinality', 'many']
    ],
    [
        ['idade', 'cardinality', 'one'],
        ['sexo', 'cardinality', 'one']
    ],
    [
        ['idade', 'cardinality', 'one']
    ],
    [
        ['telefone', 'cardinality', 'many']
    ]
];


var expectedResults = [
    [
        ['gabriel', 'endereço', 'av rio branco, 109', true],
        ['joão', 'endereço', 'rua bob, 88', true],
        ['joão', 'telefone', '91234-5555', true],
        ['gabriel', 'telefone', '98888-1111', true],
        ['gabriel', 'telefone', '56789-1010', true]
    ],
    [
        ['pedro', 'idade', 18, true]
    ],
    [
        ['carlos', 'idade', 40, true]
    ],
    [
        ['maria', 'telefone', '1234-5678', true],
        ['caio', 'telefone', '2345-6789', true]
    ]
];


testa(facts, schemas, expectedResults, expectedResults.length)
