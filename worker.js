'use strict'

const hub_host = 'registry-1.docker.io'
const auth_url = 'https://auth.docker.io'

const workers_host = '你的自定义域名'
const workers_url = `https://${workers_host}`

const HTML = `

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>镜像加速说明</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
            background-image: url('https://qninq.cn/api/bingimg/'); /* Replace with your image path */
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 2em;
            margin-bottom: 0.5em;
            color: #007aff;
        }
        p {
            margin-bottom: 1em;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            position: relative;
        }
        pre::before {
            content: " ";
            display: block;
            position: absolute;
            top: 10px;
            left: 10px;
            width: 12px;
            height: 12px;
            background: #ff5f56;
            border-radius: 50%;
            box-shadow: 20px 0 0 #ffbd2e, 40px 0 0 #27c93f;
        }
        code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            font-size: 0.875em;
        }
        .copy-button {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #007aff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
        }
        pre:hover .copy-button {
            opacity: 1;
        }
    </style>
</head>
<body>
    <div class="container">
        <center><h1>镜像加速说明</h1></center>
        <h2>为了加速镜像拉取，使用以下命令设置<b>registry mirror</b>：</h2>
        <pre><code>
sudo tee /etc/docker/daemon.json &lt;&lt;EOF
{
    "registry-mirrors": ["https://{workers_host}"]
}
EOF</code><button class="copy-button" onclick="copyCode(this)">复制代码</button></pre>
        <h2>用法：</h2>
        <h3>原拉取镜像命令：</h3>
        <pre><code>
docker pull library/alpine:latest</code><button class="copy-button" onclick="copyCode(this)">复制代码</button></pre>
        <h3>加速拉取镜像命令：</h3>
        <pre><code>
docker pull {workers_host}/library/alpine:latest</code><button class="copy-button" onclick="copyCode(this)">复制代码</button></pre>

    </div>


    <script>
        function copyCode(button) {
            const code = button.previousSibling;
            const textArea = document.createElement('textarea');
            textArea.value = code.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            button.textContent = '已复制';
            setTimeout(() => {
                button.textContent = '复制代码';
            }, 2000);
        }
    </script>
     <style>
        .custom-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #90EE90; /* 浅绿色 */
            color: #FFFFFF; /* 纯白色 */
            text-align: center;
            text-decoration: none;
            border-radius: 5px; /* 微小圆角 */
            font-size: 16px;
            font-weight: bold; /* 粗体 */
            border: 2px solid; /* 边框 */
            border-image: linear-gradient(to right, #b8c6db, #f5f7fa) 1; /* 金属质感边框 */
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 阴影 */
            cursor: pointer;
            transition: background-color 0.3s;
        }

        .custom-button:hover {
            background-color: #76c776; /* 鼠标悬停时稍微变深的浅绿色 */
        }
    </style>
</body>
</html>
`
/** @type {RequestInit} */
const PREFLIGHT_INIT = {
    status: 204,
    headers: new Headers({
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
        'access-control-max-age': '1728000',
    }),
}

/**
 * @param {any} body
 * @param {number} status
 * @param {Object<string, string>} headers
 */
function makeRes(body, status = 200, headers = {}) {
    headers['access-control-allow-origin'] = '*'
    return new Response(body, {status, headers})
}


/**
 * @param {string} urlStr
 */
function newUrl(urlStr) {
    try {
        return new URL(urlStr)
    } catch (err) {
        return null
    }
}


addEventListener('fetch', e => {
    const ret = fetchHandler(e)
        .catch(err => makeRes('cfworker error:\n' + err.stack, 502))
    e.respondWith(ret)
})


/**
 * @param {FetchEvent} e
 */
async function fetchHandler(e) {
    const getReqHeader = (key) => e.request.headers.get(key);

    let url = new URL(e.request.url);

    if (url.pathname === '/') {
        // Fetch and return the home page HTML content with replacement
        
        let text = HTML.replace(/{workers_host}/g, workers_host);
        return new Response(text, {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            }
        });
    }

    if (url.pathname === '/token') {
        let token_parameter = {
            headers: {
                'Host': 'auth.docker.io',
                'User-Agent': getReqHeader("User-Agent"),
                'Accept': getReqHeader("Accept"),
                'Accept-Language': getReqHeader("Accept-Language"),
                'Accept-Encoding': getReqHeader("Accept-Encoding"),
                'Connection': 'keep-alive',
                'Cache-Control': 'max-age=0'
            }
        };
        let token_url = auth_url + url.pathname + url.search
        return fetch(new Request(token_url, e.request), token_parameter)
    }

    url.hostname = hub_host;

    let parameter = {
        headers: {
            'Host': hub_host,
            'User-Agent': getReqHeader("User-Agent"),
            'Accept': getReqHeader("Accept"),
            'Accept-Language': getReqHeader("Accept-Language"),
            'Accept-Encoding': getReqHeader("Accept-Encoding"),
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0'
        },
        cacheTtl: 3600
    };

    if (e.request.headers.has("Authorization")) {
        parameter.headers.Authorization = getReqHeader("Authorization");
    }

    let original_response = await fetch(new Request(url, e.request), parameter)
    let original_response_clone = original_response.clone();
    let original_text = original_response_clone.body;
    let response_headers = original_response.headers;
    let new_response_headers = new Headers(response_headers);
    let status = original_response.status;

    if (new_response_headers.get("Www-Authenticate")) {
        let auth = new_response_headers.get("Www-Authenticate");
        let re = new RegExp(auth_url, 'g');
        new_response_headers.set("Www-Authenticate", response_headers.get("Www-Authenticate").replace(re, workers_url));
    }

    if (new_response_headers.get("Location")) {
        return httpHandler(e.request, new_response_headers.get("Location"))
    }

    let response = new Response(original_text, {
        status,
        headers: new_response_headers
    })
    return response;

}


/**
 * @param {Request} req
 * @param {string} pathname
 */
function httpHandler(req, pathname) {
    const reqHdrRaw = req.headers

    // preflight
    if (req.method === 'OPTIONS' &&
        reqHdrRaw.has('access-control-request-headers')
    ) {
        return new Response(null, PREFLIGHT_INIT)
    }

    let rawLen = ''

    const reqHdrNew = new Headers(reqHdrRaw)

    const refer = reqHdrNew.get('referer')

    let urlStr = pathname

    const urlObj = newUrl(urlStr)

    /** @type {RequestInit} */
    const reqInit = {
        method: req.method,
        headers: reqHdrNew,
        redirect: 'follow',
        body: req.body
    }
    return proxy(urlObj, reqInit, rawLen, 0)
}


/**
 *
 * @param {URL} urlObj
 * @param {RequestInit} reqInit
 */
async function proxy(urlObj, reqInit, rawLen) {
    const res = await fetch(urlObj.href, reqInit)
    const resHdrOld = res.headers
    const resHdrNew = new Headers(resHdrOld)

    // verify
    if (rawLen) {
        const newLen = resHdrOld.get('content-length') || ''
        const badLen = (rawLen !== newLen)

        if (badLen) {
            return makeRes(res.body, 400, {
                '--error': `bad len: ${newLen}, except: ${rawLen}`,
                'access-control-expose-headers': '--error',
            })
        }
    }
    const status = res.status
    resHdrNew.set('access-control-expose-headers', '*')
    resHdrNew.set('access-control-allow-origin', '*')
    resHdrNew.set('Cache-Control', 'max-age=1500')

    resHdrNew.delete('content-security-policy')
    resHdrNew.delete('content-security-policy-report-only')
    resHdrNew.delete('clear-site-data')

    return new Response(res.body, {
        status,
        headers: resHdrNew
    })
}