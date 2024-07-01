const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3000;

// URL da página Tempo de Refletir
const url = 'https://www.wgospel.com/tempoderefletir/';

// Função para capturar e extrair os links dos devocionais
async function fetchDevocionalLinks() {
	try {
		// Fazendo requisição HTTP para obter o HTML da página
		const response = await axios.get(url);
		const html = response.data;

		// Usando cheerio para carregar o HTML
		const $ = cheerio.load(html);

		const links = [];

		// Selecionando os elementos que contêm os links dos devocionais
		$('.post-title a').each((index, element) => {
			const link = $(element).attr('href');
			links.push(link);
		});

		return links;
	} catch (error) {
		console.error('Erro ao capturar os links dos devocionais:', error);
		return [];
	}
}

// Função para capturar o conteúdo da div post-wrapper-content a partir de <p><strong> até o final e remover tags HTML
async function fetchDevocionalContent(link) {
	try {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto(link, { waitUntil: 'networkidle2' });

		const content = await page.evaluate(() => {
			const contentElement = document.querySelector('.post-wrapper-content');
			if (contentElement) {
				const startElement = contentElement.querySelector('p > strong');
				if (startElement) {
					let currentNode = startElement.parentElement;
					let contentHTML = '';
					while (currentNode) {
						contentHTML += currentNode.outerHTML;
						currentNode = currentNode.nextElementSibling;
					}
					return contentHTML;
				}
			}
			return null;
		});

		await browser.close();

		if (content) {
			const $ = cheerio.load(content);
			let textContent = $.text();

			// Expressão regular para remover o trecho indesejado
			const unwantedTextPattern = /-> Apresentação: Amilton Menezes[\s\S]*?Compartilhar/;
			textContent = textContent.replace(unwantedTextPattern, '').trim();

			return textContent;
		}

		return null;
	} catch (error) {
		console.error(`Erro ao capturar o conteúdo do devocional em ${link}:`, error);
		return null;
	}
}

// Rota para obter os conteúdos dos devocionais em formato JSON
app.get('/devocionais', async (req, res) => {
	try {
		const links = await fetchDevocionalLinks();
		const devocionais = [];

		for (const link of links) {
			const content = await fetchDevocionalContent(link);
			if (content) {
				devocionais.push({ link, content });
			}
		}

		res.json(devocionais);
	} catch (error) {
		console.error('Erro ao obter os conteúdos dos devocionais:', error);
		res.status(500).json({ error: 'Erro ao obter os conteúdos dos devocionais' });
	}
});

// Iniciando o servidor Express
app.listen(port, () => {
	console.log(`Servidor rodando em http://localhost:${port}`);
});
