// ==============================================================================
// BOT AUTOCHAT CUBA - WHATSAPP WEB CON CEREBRO IA (VERSIÓN 100% GARANTIZADA)
// ==============================================================================
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fetch = require('node-fetch');
const fs = require('fs');

// Clave API de Gemini e Información del Negocio embebidas para respuesta instantánea
const GEMINI_API_KEY = "AIzaSyD__W6TgfKerEyATESx6dTGD1b0pnzp-tI";
const KNOWLEDGE_CONTEXT = "\nINFORMACIÓN DEL NEGOCIO:\nNombre: Pizzería & Combos El Navegante\nCategoría: Gastronomía y Envíos a Domicilio\nTeléfono / Contacto: +53 52889900\nDirección: Calle 23 #452 e/ F y G, Vedado, La Habana\nHorario: Lunes a Domingo: 11:00 AM - 10:00 PM\nMétodos de pago aceptados: Transfermóvil, EnZona, Efectivo en CUP, USD / MLC al cambio\nMoneda principal: CUP\n\nCATÁLOGO DE PRODUCTOS / SERVICIOS:\n- Pizza Familiar Queso Gouda (Pizzas): 1200 CUP (~3.5 USD) | Pizza grande de 32cm con salsa de la casa y abundante queso Gouda. [Disponible]\n- Pizza Familiar Jamón y Queso (Pizzas): 1500 CUP (~4.2 USD) | Salsa, queso Gouda y jamón vicky de primera. [Disponible]\n- Combo Familiar El Navegante (Combos): 3800 CUP (~10.5 USD) | 2 Pizzas familiares Jamón + 1 Refresco Ciego Montero 1.5L + 4 Croquetas. [Disponible]\n- Lasaña de Carne Bolognesa (Especialidades): 1800 CUP (~5 USD) | Porción generosa horneada al momento con abundante queso. [Disponible]\n- Refresco Ciego Montero (1.5L) (Bebidas): 800 CUP (~2.2 USD) | Sabor TuKola, Naranja o Limón según disponibilidad. [Disponible]\n- Batido de Fruta Bomba / Mango (Bebidas): 400 CUP  | Batido natural fresco de 500ml. [Disponible]\n\nPRECIOS DE DOMICILIO POR MUNICIPIO:\n- Vedado / Plaza de la Revolución: 300 CUP \n- Playa: 500 CUP \n- Centro Habana: 400 CUP \n- Habana Vieja: 450 CUP \n- Marianao: 600 CUP \n- Diez de Octubre: 500 CUP \n- Boyeros: 800 CUP (Solo hasta Altahabana / Fontanar)\n\nPREGUNTAS FRECUENTES (FAQ):\nP: ¿Aceptan pago por Transfermóvil o EnZona?\nR: ¡Sí! Aceptamos Transfermóvil y EnZona a nuestro código QR o número de tarjeta. Te enviamos los datos de pago al confirmar el pedido.\n---\nP: ¿Hacen entregas a domicilio y cuánto cuesta?\nR: Hacemos envíos a Vedado (300 CUP), Centro Habana (400 CUP), Playa (500 CUP), Habana Vieja (450 CUP) y municipios aledaños.\n---\nP: ¿Cuál es el horario de atención?\nR: Abrimos todos los días de 11:00 AM a 10:00 PM. Los pedidos a domicilio se toman hasta las 9:30 PM.\n\nREGLAS DE ATENCIÓN Y TRANSFERENCIA A HUMANO:\n- Palabras o motivos de transferencia: queja, malo, devolución, transferencia fallida, hablar con dueño, humano, problema\n- Instrucción de tono personal: Eres el asistente virtual por WhatsApp de \"Pizzería & Combos El Navegante\" en La Habana, Cuba (+53). \nAtiendes clientes locales con trato muy amable, respetuoso, cálido y fluido (español de Cuba educado).\nREGLAS IMPORTANTES:\n1. Respuestas directas y breves para NO consumir muchos megas/datos del cliente.\n2. Si el cliente pregunta por precios o menú, dale las opciones con su precio en CUP claro.\n3. Si desea pedir a domicilio, pide: 1) Productos y cantidades, 2) Dirección exacta con entrecalles y municipio, 3) Método de pago (Transfermóvil, EnZona o Efectivo).\n4. Aclara costo del domicilio según el municipio si aplica.\n5. Si detectas alguna queja, problema con un pedido anterior o solicitud compleja, transfiérelo amablemente a un operador humano.\n";
const RAW_CATALOG = [{"id":"cat-1","name":"Pizza Familiar Queso Gouda","category":"Pizzas","priceCUP":1200,"priceUSD":3.5,"description":"Pizza grande de 32cm con salsa de la casa y abundante queso Gouda.","available":true},{"id":"cat-2","name":"Pizza Familiar Jamón y Queso","category":"Pizzas","priceCUP":1500,"priceUSD":4.2,"description":"Salsa, queso Gouda y jamón vicky de primera.","available":true},{"id":"cat-3","name":"Combo Familiar El Navegante","category":"Combos","priceCUP":3800,"priceUSD":10.5,"description":"2 Pizzas familiares Jamón + 1 Refresco Ciego Montero 1.5L + 4 Croquetas.","available":true},{"id":"cat-4","name":"Lasaña de Carne Bolognesa","category":"Especialidades","priceCUP":1800,"priceUSD":5,"description":"Porción generosa horneada al momento con abundante queso.","available":true},{"id":"cat-5","name":"Refresco Ciego Montero (1.5L)","category":"Bebidas","priceCUP":800,"priceUSD":2.2,"description":"Sabor TuKola, Naranja o Limón según disponibilidad.","available":true},{"id":"cat-6","name":"Batido de Fruta Bomba / Mango","category":"Bebidas","priceCUP":400,"description":"Batido natural fresco de 500ml.","available":true}];
const RAW_DELIVERY = [{"municipality":"Vedado / Plaza de la Revolución","costCUP":300,"available":true},{"municipality":"Playa","costCUP":500,"available":true},{"municipality":"Centro Habana","costCUP":400,"available":true},{"municipality":"Habana Vieja","costCUP":450,"available":true},{"municipality":"Marianao","costCUP":600,"available":true},{"municipality":"Diez de Octubre","costCUP":500,"available":true},{"municipality":"Boyeros","costCUP":800,"available":true,"notes":"Solo hasta Altahabana / Fontanar"}];
const RAW_FAQS = [{"id":"faq-1","question":"¿Aceptan pago por Transfermóvil o EnZona?","answer":"¡Sí! Aceptamos Transfermóvil y EnZona a nuestro código QR o número de tarjeta. Te enviamos los datos de pago al confirmar el pedido.","category":"Pagos","keywords":["transfermovil","enzona","pago","tarjeta","qr","transferencia"]},{"id":"faq-2","question":"¿Hacen entregas a domicilio y cuánto cuesta?","answer":"Hacemos envíos a Vedado (300 CUP), Centro Habana (400 CUP), Playa (500 CUP), Habana Vieja (450 CUP) y municipios aledaños.","category":"Envíos","keywords":["domicilio","envio","mensajero","donde entregan","cobertura","llegan"]},{"id":"faq-3","question":"¿Cuál es el horario de atención?","answer":"Abrimos todos los días de 11:00 AM a 10:00 PM. Los pedidos a domicilio se toman hasta las 9:30 PM.","category":"General","keywords":["horario","abierto","hora","atienden","domingo"]}];
const RAW_BUSINESS = {"name":"Pizzería & Combos El Navegante","phone":"+53 52889900","address":"Calle 23 #452 e/ F y G, Vedado","city":"La Habana","hours":"Lunes a Domingo: 11:00 AM - 10:00 PM","payments":["Transfermóvil","EnZona","Efectivo en CUP","USD / MLC al cambio"]};

// URL Endpoint del Servidor
let SERVER_API_URL = "https://ais-pre-a472uhvnm7pikzaopb26p2-170592462290.us-east5.run.app/api/brain/process";
if (SERVER_API_URL.includes('ais-dev-')) {
    SERVER_API_URL = SERVER_API_URL.replace('ais-dev-', 'ais-pre-');
}

console.log("🚀 Iniciando Bot de WhatsApp Web para AutoChat Cuba...");
console.log("⚡ Motor Inteligente de IA Directo activado para respuesta ultrarrápida.");

// Normalizar texto eliminando tildes y mayúsculas
function normalizarTexto(txt) {
    if (!txt) return "";
    return txt.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

// Buscar el navegador Chrome o Edge instalado en tu PC
let chromePath;
const posiblesRutasChrome = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    (process.env.LOCALAPPDATA || '') + '\\Google\\Chrome\\Application\\chrome.exe',
    (process.env.LOCALAPPDATA || '') + '\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];

for (const ruta of posiblesRutasChrome) {
    if (ruta && fs.existsSync(ruta)) {
        chromePath = ruta;
        console.log("🌐 Usando navegador instalado en tu PC:", chromePath);
        break;
    }
}

// Evitar que errores no capturados cierren el proceso en Render
process.on('unhandledRejection', (reason) => {
    console.error('⚠️ [ADVERTENCIA PROCESO]: Promesa rechazada ignorada:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('⚠️ [ADVERTENCIA PROCESO]: Excepción no capturada ignorada:', err);
});

// Configuración de Puppeteer optimizada para Render
const puppeteerOpts = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-component-update',
        '--disable-default-apps',
        '--mute-audio',
        '--no-default-browser-check'
    ]
};
if (chromePath) puppeteerOpts.executablePath = chromePath;

// Limpiar archivos de bloqueo de sesión previa si existieran para evitar errores de "browser is already running"
try {
    const lock1 = path.join(process.cwd(), 'sesion_whatsapp', 'session', 'SingletonLock');
    if (fs.existsSync(lock1)) fs.unlinkSync(lock1);
    const lock2 = path.join(process.cwd(), 'sesion_whatsapp', 'session', 'SingletonCookie');
    if (fs.existsSync(lock2)) fs.unlinkSync(lock2);
} catch (errClean) {}

// Inicializar cliente de WhatsApp Web
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './sesion_whatsapp' }),
    webVersionCache: {
        type: 'local'
    },
    puppeteer: puppeteerOpts
});

// Estado de WhatsApp
let latestQrString = '';
let isWhatsAppConnected = false;

// Servidor HTTP ultra-ligero de inicio inmediato para Render (Evita error 502 Bad Gateway y pasa chequeo de puerto en <1s)
try {
    const express = require('express');
    const httpApp = express();
    const HTTP_PORT = process.env.PORT || 10000;

    httpApp.get('/health', (req, res) => res.json({ status: 'ok', whatsapp: isWhatsAppConnected ? 'online' : 'waiting_qr' }));

    // Endpoint API para polling fluido en tiempo real
    httpApp.get('/api/qr-status', (req, res) => {
        res.json({
            connected: isWhatsAppConnected,
            qr: latestQrString,
            qrUrl: latestQrString ? ('https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=' + encodeURIComponent(latestQrString)) : ''
        });
    });

    const renderQrHtml = (req, res) => {
        const html = '<!DOCTYPE html>' +
'<html lang="es">' +
'<head>' +
'    <meta charset="UTF-8">' +
'    <title>Vincular WhatsApp - AutoChat Cuba</title>' +
'    <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
'    <style>' +
'        * { box-sizing: border-box; }' +
'        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px; }' +
'        .card { background: #1e293b; padding: 32px 24px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-width: 440px; width: 100%; border: 1px solid #334155; transition: all 0.3s ease; }' +
'        img.qr-code { background: white; padding: 14px; border-radius: 16px; margin: 20px 0; width: 280px; height: 280px; box-shadow: 0 8px 20px rgba(0,0,0,0.4); }' +
'        h1 { font-size: 22px; color: #38bdf8; margin: 0 0 12px 0; font-weight: 700; }' +
'        p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 8px 0; }' +
'        .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-bottom: 16px; }' +
'        .status-waiting { background: #451a03; color: #fbbf24; border: 1px solid #78350f; }' +
'        .status-connected { background: #064e3b; color: #34d399; border: 1px solid #065f46; }' +
'        .loading-spinner { width: 40px; height: 40px; border: 4px solid #334155; border-top: 4px solid #38bdf8; border-radius: 50%; animation: spin 1s linear infinite; margin: 30px auto; }' +
'        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' +
'        .instructions { background: #0f172a; padding: 14px; border-radius: 12px; font-size: 13px; color: #cbd5e1; text-align: left; margin-top: 15px; border: 1px solid #1e293b; }' +
'        .instructions ol { margin: 6px 0 0 20px; padding: 0; }' +
'        .instructions li { margin-bottom: 4px; }' +
'        .live-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; display: inline-block; animation: pulse 1.5s infinite; }' +
'        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }' +
'    </style>' +
'</head>' +
'<body>' +
'    <div class="card" id="mainCard">' +
'        <div id="content">' +
'            <div class="loading-spinner"></div>' +
'            <p>Iniciando WhatsApp Web en Render...</p>' +
'        </div>' +
'    </div>' +
'    <script>' +
'        let currentQr = "";' +
'        let isConnected = false;' +
'        async function checkStatus() {' +
'            try {' +
'                const res = await fetch("/api/qr-status");' +
'                const data = await res.json();' +
'                const container = document.getElementById("content");' +
'                if (data.connected) {' +
'                    if (!isConnected) {' +
'                        isConnected = true;' +
'                        container.innerHTML = '<div class="status-badge status-connected"><span class="live-dot"></span> BOT CONECTADO Y ACTIVO</div><h1 style="color: #34d399;">✅ ¡WhatsApp Vinculado con Éxito!</h1><p>AutoChat Cuba está sincronizado y respondiendo mensajes en automático 24/7 en tu teléfono.</p><p style="font-size: 12px; color: #64748b; margin-top: 15px;">Puedes cerrar esta ventana. El bot seguirá funcionando en segundo plano.</p>';' +
'                    }' +
'                } else if (data.qr) {' +
'                    isConnected = false;' +
'                    if (currentQr !== data.qr) {' +
'                        currentQr = data.qr;' +
'                        container.innerHTML = '<div class="status-badge status-waiting"><span class="live-dot"></span> ESPERANDO ESCÁNEO</div><h1>📱 Vincular WhatsApp AutoChat</h1><p>Escanea este código QR desde WhatsApp para conectar la Inteligencia Artificial:</p><img class="qr-code" src="' + data.qrUrl + '" alt="Código QR WhatsApp" /><div class="instructions"><b>Pasos en tu teléfono:</b><ol><li>Abre WhatsApp en tu teléfono.</li><li>Ve a <b>Ajustes</b> / <b>Dispositivos vinculados</b>.</li><li>Toca en <b>Vincular un dispositivo</b>.</li><li>Apunta con tu cámara hacia este código QR.</li></ol></div>';' +
'                    }' +
'                } else {' +
'                    isConnected = false;' +
'                    currentQr = "";' +
'                    container.innerHTML = '<div class="loading-spinner"></div><h1>🤖 Generando Código QR...</h1><p>Iniciando el motor de WhatsApp Web en el servidor. Por favor espera unos segundos.</p>';' +
'                }' +
'            } catch (err) {' +
'                console.error("Error verificando estado:", err);' +
'            }' +
'        }' +
'        checkStatus();' +
'        setInterval(checkStatus, 2000);' +
'    </script>' +
'</body>' +
'</html>';
        res.send(html);
    };

    httpApp.get('/', renderQrHtml);
    httpApp.get('/qr', renderQrHtml);

    httpApp.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log("🌐 Servidor Web para Render activo en el puerto " + HTTP_PORT);
        console.log("👉 URL PARA ESCANEAR CÓDIGO QR EN HD: https://autochat-bot.onrender.com");
    });
} catch (eHttp) {
    console.log("Servidor HTTP secundario omitido.");
}

// Eventos de estado de WhatsApp (Consola limpia sin bloques de texto QR gigantes)
client.on('qr', (qr) => {
    latestQrString = qr;
    isWhatsAppConnected = false;
    console.log("⚠️ [ESTADO ESTABLECIDO]: WHATSAPP NO ESTÁ VINCULADO");
    console.log("👉 Por favor abre tu URL de Render para escanear el QR en HD: https://autochat-bot.onrender.com");
});

client.on('loading_screen', (percent, message) => {
    console.log("⏳ [CARGANDO WHATSAPP WEB]: " + percent + "% - " + message);
});

client.on('change_state', (state) => {
    console.log("🔄 [CAMBIO DE ESTADO WHATSAPP]: " + state);
});

client.on('authenticated', () => {
    console.log("🔐 [ESTADO]: Sesión de WhatsApp Autenticada con éxito.");
});

client.on('ready', () => {
    isWhatsAppConnected = true;
    latestQrString = '';
    console.log("✅ [ESTADO]: ¡WHATSAPP VINCULADO Y CONECTADO EXITOSAMENTE!");
    console.log("🤖 AutoChat Cuba está activo y respondiendo mensajes automáticamente 24/7.");
});

client.on('auth_failure', msg => {
    isWhatsAppConnected = false;
    console.error("❌ [ESTADO ERROR]: Fallo de autenticación en WhatsApp:", msg);
});

client.on('disconnected', (reason) => {
    isWhatsAppConnected = false;
    console.log("🔌 [ESTADO]: WhatsApp Desconectado. Razón:", reason);
});

// Consulta multinivel al Cerebro IA
async function consultarCerebroIA(clienteTelefono, mensajeTexto) {
    const prompt = `Mensaje entrante del cliente (+${clienteTelefono}): "${mensajeTexto}"`;

    // 1. TIER 1: Consulta directa a Gemini Cloud API (si hay API key)
    if (GEMINI_API_KEY && GEMINI_API_KEY.length > 15) {
        const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
        for (const model of models) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
                const sysInstruction = `Eres el CEREBRO AUTOMÁTICO de WhatsApp para un negocio local en Cuba.
Debes responder al mensaje del cliente en español cubano cálido, educado, claro y servicial.
Mantén la respuesta concisa (máximo 3-4 frases o viñetas cortas) para minimizar uso de datos móviles.

${KNOWLEDGE_CONTEXT}
`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        systemInstruction: { parts: [{ text: sysInstruction }] },
                        generationConfig: { temperature: 0.2 }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const textResp = data.candidates[0].content.parts[0].text;
                        if (textResp && textResp.trim().length > 0) {
                            return textResp.trim();
                        }
                    }
                }
            } catch (err) {
                // Siguiente modelo si falla
            }
        }
    }

    // 2. TIER 2: Servidor API Remoto
    try {
        const res = await fetch(SERVER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ customerPhone: clienteTelefono, message: mensajeTexto, source: 'WHATSAPP_WEB' })
        });
        const text = await res.text();
        if (text.trim().startsWith('{')) {
            const data = JSON.parse(text);
            if (data && data.result && data.result.aiResponse) {
                return data.result.aiResponse;
            }
        }
    } catch (e) {}

    // 3. TIER 3: Motor Local Inteligente con Procesamiento de Lenguaje y Búsqueda de Catálogo
    const normMsg = normalizarTexto(mensajeTexto);

    // a. Operador humano / Queja / Reclamo
    if (['humano', 'operador', 'persona', 'atencion', 'queja', 'reclamo', 'problema', 'cancelar'].some(k => normMsg.includes(k))) {
        return " Entendido. Un operador de nuestro equipo se pondrá en contacto contigo a la brevedad para atenderte personalmente.";
    }

    // b. Búsqueda directa de productos en el catálogo (ej: "pizza de queso", "cuanto vale la pizza", "tienen cerveza")
    const matchedProducts = RAW_CATALOG.filter(item => {
        const normName = normalizarTexto(item.name);
        const normCat = normalizarTexto(item.category);
        const words = normName.split(/s+/).filter(w => w.length > 2);
        if (normMsg.includes(normName) || normMsg.includes(normCat)) return true;
        const matches = words.filter(w => normMsg.includes(w));
        return matches.length >= 2 || (words.length === 1 && matches.length === 1 && normMsg.includes(words[0]));
    });

    if (matchedProducts.length > 0) {
        let response = "🍕 *INFORMACIÓN DE PRODUCTO SOLICITADO:*\n\n";
        matchedProducts.forEach(p => {
            response += "• *" + p.name + "* (" + p.category + "): *" + p.priceCUP + " CUP*" + (p.priceUSD ? " (~" + p.priceUSD + " USD)" : "") + "\n  _" + p.description + "_ [" + (p.available ? "✅ Disponible" : "❌ Agotado") + "]\n\n";
        });
        response += "¿Te gustaría realizar un pedido o deseas consultar algo más?";
        return response;
    }

    // c. Domicilio / Envío / Reparto
    if (['domicilio', 'envio', 'entregan', 'llegan', 'reparto', 'mensajero', 'vedado', 'playa', 'municipio'].some(k => normMsg.includes(k))) {
        let resp = "🛵 *ENVIOS A DOMICILIO Y TARIFAS POR MUNICIPIO:*\n\n";
        RAW_DELIVERY.forEach(d => {
            resp += "• *" + d.municipality + "*: " + d.costCUP + " CUP " + (d.notes ? "(" + d.notes + ")" : "") + "\n";
        });
        resp += "\n⏱️ Tiempo estimado de entrega: 35-45 min. ¿En qué municipio te encuentras?";
        return resp;
    }

    // d. Horario / Ubicación / Dirección
    if (['horario', 'hora', 'abren', 'cierran', 'ubicacion', 'donde', 'direccion', 'lugar', 'telefono'].some(k => normMsg.includes(k))) {
        return "📍 *" + RAW_BUSINESS.name + "*\n• Dirección: " + RAW_BUSINESS.address + ", " + RAW_BUSINESS.city + "\n• Horario: " + RAW_BUSINESS.hours + "\n• Teléfono: " + RAW_BUSINESS.phone + "\n• Métodos de pago: " + RAW_BUSINESS.payments.join(', ');
    }

    // e. Métodos de pago
    if (['pago', 'pagar', 'transfermovil', 'enzona', 'efectivo', 'tarjeta', 'usd', 'cup'].some(k => normMsg.includes(k))) {
        return "💳 *MÉTODOS DE PAGO ACEPTADOS:*\n" + RAW_BUSINESS.payments.map(p => '• ' + p).join('\n') + "\n\nPuedes pagar al momento de recibir tu pedido. ¡A tu servicio!";
    }

    // f. Menú general / Precios / Qué tienen
    if (['precio', 'cuanto', 'vale', 'cuesta', 'costo', 'menu', 'carta', 'catalogo', 'oferta', 'tienen', 'comida', 'lista'].some(k => normMsg.includes(k))) {
        return "📋 *MENÚ Y CATÁLOGO DE PRODUCTOS:*\n\n" + KNOWLEDGE_CONTEXT;
    }

    // g. Saludo inicial
    if (['hola', 'buenas', 'saludos', 'que tal', 'buenos dias', 'buenas tardes', 'buenas noches'].some(k => normMsg.includes(k))) {
        return "¡Hola! 👋 Bienvenido a *" + RAW_BUSINESS.name + "*. ¿En qué podemos ayudarte hoy?\n\nPuedes preguntarnos por nuestros precios, menú de pizzas, envíos a domicilio o realizar un pedido.";
    }

    // h. Respuesta garantizada con catálogo completo
    return "¡Hola! 👋 Gracias por escribirnos a *" + RAW_BUSINESS.name + "*.\n\n📋 *AQUÍ TIENES NUESTRO MENÚ Y PRECIOS:*\n\n" + KNOWLEDGE_CONTEXT;
}

// Registro de IDs procesados para evitar duplicación entre 'message' y 'message_create'
const processedMsgIds = new Set();

async function procesarMensajeEntrante(msg) {
    try {
        if (!msg) return;

        const rawFrom = msg.from || '';
        const mensajeTexto = msg.body || '';

        console.log("📩 [WHATSAPP EVENTO ENTRANTE] ID:", msg.id?._serialized, "| De:", rawFrom, "| EsMío (fromMe):", msg.fromMe, "| Texto:", JSON.stringify(mensajeTexto));

        if (!msg.id || !msg.id._serialized) return;

        // Si ya procesamos este mensaje exacto, ignorarlo
        if (processedMsgIds.has(msg.id._serialized)) return;
        processedMsgIds.add(msg.id._serialized);

        // Mantener el caché pequeño (máx 500 IDs)
        if (processedMsgIds.size > 500) {
            const firstItem = processedMsgIds.values().next().value;
            processedMsgIds.delete(firstItem);
        }

        // Ignorar chats grupales y estados
        if (rawFrom.includes('@g.us') || rawFrom === 'status@broadcast') {
            console.log("ℹ️ [Ignorado]: Mensaje de grupo o estado.");
            return;
        }

        if (!mensajeTexto || mensajeTexto.trim() === '') {
            console.log("ℹ️ [Ignorado]: El mensaje no contiene texto procesable (imagen/audio sin texto).");
            return;
        }

        // Si el mensaje viene del propio teléfono vinculado (fromMe)
        if (msg.fromMe) {
            const lowBody = mensajeTexto.toLowerCase().trim();
            if (lowBody.startsWith('!') || lowBody.includes('ping') || lowBody.includes('test') || lowBody.includes('bot') || lowBody.includes('hola')) {
                console.log("🧪 [Prueba propia en teléfono vinculado]: Respondiendo a '" + mensajeTexto + "'...");
                try {
                    const chat = await msg.getChat();
                    await chat.sendMessage("🤖 *AutoChat Cuba (Modo Prueba)*: ¡Conexión verificada! El bot está activo en tu cuenta y respondiendo a tus clientes 24/7.");
                    console.log("✅ [Respuesta de prueba propia enviada con éxito]");
                } catch (ePrueba) {
                    console.error("⚠️ Error enviando respuesta de prueba propia:", ePrueba);
                }
            } else {
                console.log("ℹ️ [Mensaje enviado por ti mismo]: Ignorado para no responderte a ti mismo en conversaciones normales.");
            }
            return;
        }

        // Extraer teléfono limpio del cliente
        const clienteTelefono = rawFrom.replace('@c.us', '').replace('@lid', '').replace('+', '').replace(/[^0-9]/g, '');
        console.log("🚀 [CEREBRO IA] ¡PROCESANDO MENSAJE RECIBIDO DE CLIENTE! (+" + clienteTelefono + "): " + mensajeTexto);

        // Consultar el motor de inteligencia artificial (Tier 1 Gemini API -> Tier 2 API -> Tier 3 Local Engine)
        const respuestaIA = await consultarCerebroIA(clienteTelefono, mensajeTexto);

        if (respuestaIA) {
            console.log("💬 [AutoChat IA Responde a +" + clienteTelefono + "]: " + respuestaIA);
            
            // Método seguro 1: Usar la instancia Chat para garantizar entrega en WhatsApp Multi-Dispositivo (@lid y @c.us)
            try {
                const chat = await msg.getChat();
                await chat.sendMessage(respuestaIA);
                console.log("✅ [Respuesta enviada con éxito vía chat.sendMessage a +" + clienteTelefono + "]");
            } catch (chatErr) {
                console.log("⚠️ Falló chat.sendMessage, reintentando con msg.reply...");
                try {
                    await msg.reply(respuestaIA);
                    console.log("✅ [Respuesta enviada con éxito vía msg.reply]");
                } catch (replyErr) {
                    console.log("⚠️ Falló msg.reply, reintentando con client.sendMessage...");
                    await client.sendMessage(rawFrom, respuestaIA);
                    console.log("✅ [Respuesta enviada con éxito vía client.sendMessage]");
                }
            }
        } else {
            console.log("⚠️ No se pudo obtener respuesta del Cerebro IA.");
        }
    } catch (err) {
        console.error("❌ Error procesando mensaje de WhatsApp:", err);
    }
}

// Escuchar TANTO 'message' COMO 'message_create' para garantizar 100% de captura en WhatsApp Web Multi-Dispositivo (MD)
client.on('message', procesarMensajeEntrante);
client.on('message_create', procesarMensajeEntrante);

// Inicializar cliente de WhatsApp Web en segundo plano
client.initialize();
