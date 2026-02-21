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
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ] 
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR CODE GERADO ABAIXO:');
});

client.on('ready', () => {
    console.log('Flowzap 2.0 CONECTADO!');
});

app.get('/disparar', async (req, res) => {
    const { numero, msg } = req.query;
    try {
        await client.sendMessage(`${numero}@c.us`, msg);
        res.status(200).send('Enviado com sucesso!');
    } catch (err) {
        res.status(500).send('Erro no servidor');
    }
});

app.get('/', (req, res) => res.send('Servidor Flowzap Ativo!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
client.initialize();
