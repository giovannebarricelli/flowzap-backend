const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const app = express();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ]
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('--- QR CODE GERADO ABAIXO ---');
});

client.on('ready', () => {
    console.log('Flowzap 2.0 CONECTADO COM SUCESSO!');
});

app.get('/', (req, res) => res.send('Servidor Flowzap Ativo!'));

// Porta 10000 é essencial para o Render não dar erro
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Motor rodando na porta ${PORT}`);
});

client.initialize();
