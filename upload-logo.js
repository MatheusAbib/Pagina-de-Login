const fs = require('fs');
const mysql = require('mysql2/promise');

async function uploadLogo() {
    try {
        const imagePath = 'C:\\Users\\97857\\Downloads\\door.png';
        
        if (!fs.existsSync(imagePath)) {
            console.error('❌ Arquivo não encontrado:', imagePath);
            return;
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;

        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'usbw',
            database: 'correios'
        });

        await connection.execute(
            'INSERT INTO config (chave, valor, descricao) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE valor = ?',
            ['logo', dataUrl, 'Logo do sistema', dataUrl]
        );

        console.log('✅ Logo salva com sucesso!');
        console.log('📊 Tamanho: ~' + (dataUrl.length / 1024).toFixed(0) + 'KB');
        await connection.end();
    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

uploadLogo();
