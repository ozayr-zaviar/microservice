var bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
const port = process.env.PORT || 80;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/batch', (req, res) => {
    // Spawn a new Python process
    error_flag = false
    const pythonProcess = spawn('python3', ['job.py']);

    // Listen for data from the Python script
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Received data from Python script: ${data}`);
    });

    // Listen for errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
      res.status(404).send("job failed")
    });

    // Listen for the Python script to exit
    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    if (!error_flag) {
      res.status(200).send("Job started")
    }
});

 app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 