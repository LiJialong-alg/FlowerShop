// 生成自签名SSL证书脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certPath = path.join(__dirname, 'server.crt');
const keyPath = path.join(__dirname, 'server.key');

// 检查证书是否已存在
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    console.log('✅ SSL证书已存在');
    process.exit(0);
}

try {
    console.log('🔐 正在生成自签名SSL证书...');
    execSync('openssl req -nodes -new -x509 -keyout server.key -out server.crt -days 365 -subj "/C=CN/ST=State/L=City/O=Organization/CN=localhost"', {
        stdio: 'inherit',
        cwd: __dirname
    });
    console.log('✅ SSL证书生成成功！');
} catch (error) {
    console.error('❌ 生成失败，请确保已安装OpenSSL');
    console.error('Windows用户可访问: https://slproweb.com/products/Win32OpenSSL.html');
    process.exit(1);
}
