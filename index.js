const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

// URL da página Tempo de Refletir
const url = 'https://www.wgospel.com/tempoderefletir/';

// Função para capturar e extrair os devocionais
async function fetchDevocionais() {
    try {
        // Fazendo requisição HTTP para obter o HTML da página
        const response = await axios.get(url);
        const html = response.data;

        // Usando cheerio para carregar o HTML
        const $ = cheerio.load(html);

        const devocionais = [];

        // Selecionando os elementos que contêm os devocionais
        $('.post-excerpt').each((index, element) => {
            // Encontrando o texto do devocional dentro de 'post-excerpt'
            const devocionalTexto = $(element).html().trim(); // Usando .html() para capturar o HTML interno

            // Extraindo o número do devocional
            const numeroRegex = /TEMPO DE REFLETIR \d+/;
            const numero = devocionalTexto.match(numeroRegex)[0];

            // Extraindo a data do devocional
            const dataRegex = /\d+ de \w+ de \d+/;
            const dataMatch = devocionalTexto.match(dataRegex);
            const data = dataMatch ? dataMatch[0] : '';

            // Extraindo o assunto do devocional
            const assuntoRegex = /(\d{4}.*?)<span class="excerpt-hellip">/;
            const assuntoMatch = devocionalTexto.match(assuntoRegex);
            const assunto = assuntoMatch ? assuntoMatch[1].trim() : '';

            // Criando objeto com número, data e assunto do devocional
            const devocional = {
                numero: numero,
                data: data,
                assunto: assunto
            };
            devocionais.push(devocional);
        });

        return devocionais;
    } catch (error) {
        console.error('Erro ao capturar os devocionais:', error);
        return [];
    }
}

// Rota para obter os devocionais em formato JSON
app.get('/post', async (req, res) => {
    try {
        const devocionais = await fetchDevocionais();
        res.json(devocionais);
    } catch (error) {
        console.error('Erro ao obter os devocionais:', error);
        res.status(500).json({ error: 'Erro ao obter os devocionais' });
    }
});

// Iniciando o servidor Express
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
