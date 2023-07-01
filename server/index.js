var bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const http = require('http');
require('dotenv').config();
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());
const port = process.env.PORT || 80;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const reactServerURL = process.env.FE_HOST + ":" + process.env.FE_PORT; 
app.use(express.static(reactServerURL));

// Redirect requests for CSS and JavaScript files to the remote server
app.get('/', createProxyMiddleware({
  target: reactServerURL,
  changeOrigin: true,
}));

// Redirect requests for CSS and JavaScript files to the remote server
app.get('/index.css', createProxyMiddleware({
  target: reactServerURL,
  changeOrigin: true,
}));

app.get('/index.js', createProxyMiddleware({
  target: reactServerURL,
  changeOrigin: true,
}));

app.use('/image1.jpg', createProxyMiddleware({
  target: reactServerURL,
  changeOrigin: true,
}));

app.use('/image2.jpg', createProxyMiddleware({
  target: reactServerURL,
  changeOrigin: true,
}));

app.use('/image3.jpg', createProxyMiddleware({
  target: reactServerURL,
  changeOrigin: true,
}));

app.use('/static', createProxyMiddleware({
  target: reactServerURL,
  changeOrigin: true,
}));

app.get('/all_subscriptions', (req, res) => {
  resp = getRequest(process.env.FE_HOST, process.env.FE_PORT, "/");
  res.setHeader('Content-Type', 'text/html');
  res.status(resp.status).send(resp.message);
})


app.post('/create_user', async (req, res) => {
  postRequest(process.env.DB_HOST, process.env.DB_PORT, "/create_user", req.body)
    .then((resp) => {
      console.log(resp);
      res.status(resp.status).send(JSON.stringify(resp.message));
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error');
    });
});

app.post('/create_magazine', (req, res) => {
  postRequest(process.env.DB_HOST, process.env.DB_PORT, "/create_magazine", req.body)
    .then((resp) => {
      console.log(resp);
      res.status(resp.status).send(JSON.stringify(resp.message));
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error');
    });
});

app.post('/create_subscription', (req, res) => {
  postRequest(process.env.DB_HOST, process.env.DB_PORT, "/create_subscription", req.body)
    .then((resp) => {
      console.log(resp);
      res.status(resp.status).send(JSON.stringify(resp.message));
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error');
    });
});

app.get('/subscriptions', (req, res) => {
  getRequest(process.env.DB_HOST, process.env.DB_PORT, "/subscriptions")
    .then((resp) => {
      res.setHeader('Content-Type', 'text/html');
      console.log(resp);
      res.status(resp.status).send(resp.message);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error');
    });
})

app.get('/batch', (req, res) => {
  getRequest(process.env.BATCH_HOST, process.env.BATCH_PORT, "/batch")
    .then((resp) => {
      res.setHeader('Content-Type', 'text/html');
      console.log(resp);
      res.status(resp.status).send(resp.message);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error');
    });
});

 app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function postRequest(host, port, route, data) {
  return new Promise((resolve, reject) => {
    const requestData = JSON.stringify(data);

    const options = {
      hostname: host,
      port: port,
      path: route,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };

    const request = http.request(options, (resp) => {
      let responseData = '';

      resp.on('data', (chunk) => {
        responseData += chunk;
      });

      resp.on('end', () => {
        resolve({ status: resp.statusCode, message: responseData.toString() });
      });
    });

    request.on('error', (error) => {
      reject({ status: 500, message: 'Error: ' + error.toString() });
    });

    request.write(requestData);
    request.end();
  });
}

function getRequest(host, port, route) {
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: host,
      port: port,
      path: route,
      method: 'GET'
    }, (resp) => {
      let responseData = '';

      resp.on('data', (chunk) => {
        responseData += chunk;
      });

      resp.on('end', () => {
        resolve({ status: resp.statusCode, message: responseData.toString() });
      });
    });

    request.on('error', (error) => {
      reject({ status: 500, message: 'Error: ' + error.toString() });
    });

    request.end();
  });
}