import express from "express";
import os from "os";
import cluster from "node:cluster";
let app = express();
let port = 9000;

const numCpus = os.cpus().length;
//console.log(numCpus);

app.use(express.json());
app.get("/", (req, res) => {
    console.log(req.body.data, ` Coming  to ${process.pid}`);
    res.send("Hello from Ishaan");
    cluster.worker.kill(); // Kill process after response
});

if (cluster.isPrimary)
{
    for (let i = 0; i < numCpus; i++)
    {
        cluster.fork(); // Distribution of process to other cores
    }

    //  Event to get the killed pid
    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster.fork(); // 0 down time arch.
    });
}
else
{
    app.listen(port, () => {
        console.log(`Server at ${port} port  ----> Process ID ${process.pid}`);
    });
}