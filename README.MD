# Webscraping

## Descrição do Projeto

**Webscraping** é um projeto criado para aprimorar e automatizar a coleta de informações de devocionais a partir de um site específico, com o objetivo de melhorar um projeto já existente chamado **Vida com Deus**. Este projeto utiliza técnicas de web scraping para extrair, processar e apresentar informações de forma estruturada e acessível.

## Objetivo

O principal objetivo do **Webscraping** é capturar devocionais diretamente do site "Tempo de Refletir", processar o conteúdo e disponibilizá-lo em um formato JSON através de uma API criada com Node.js e Express. Isso permite que o projeto **Vida com Deus** mantenha as informações atualizadas de acordo com o site de origem.

## Técnicas Utilizadas

### Web Scraping

Web scraping é uma técnica de extração de informações de sites. Neste projeto, utilizamos as seguintes bibliotecas e ferramentas para realizar o scraping:

- **Axios**: Biblioteca usada para fazer requisições HTTP e obter o HTML da página alvo.
- **Cheerio**: Biblioteca que permite manipular e navegar no HTML como se estivéssemos utilizando jQuery. É utilizada para selecionar e extrair as partes relevantes do conteúdo.
- **Puppeteer**: Ferramenta que controla navegadores headless, como o Chrome, permitindo renderizar páginas complexas e capturar conteúdos que dependem de JavaScript para serem carregados.