const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const app = express();

// Configuração do Cliente WhatsApp
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
        executablePath: '/usr/bin/google-chrome-stable', // Necessário para alguns servidores nuvem
        args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    }
});

// Exibe o QR Code no terminal do servidor (importante para o primeiro acesso)
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
    console.log('QR CODE GENERADO: Escaneie no seu WhatsApp para ligar o Flowzap 2.0');
});

client.on('ready', () => {
    console.log('Flowzap 2.0 Online e pronto para o combate!');
});

// Rota que o seu CodePen vai chamar
app.get('/disparar', async (req, res) => {
    const { numero, msg } = req.query;
    
    if (!numero || !msg) {
        return res.status(400).send('Faltando número ou mensagem');
    }

    try {
        // Envia a mensagem para o número formatado
        await client.sendMessage(`${numero}@c.us`, msg);
        console.log(`Mensagem enviada para: ${numero}`);
        res.status(200).send('Sucesso no disparo!');
    } catch (err) {
        console.error('Erro ao enviar:', err);
        res.status(500).send('Erro interno no servidor');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

client.initialize();
