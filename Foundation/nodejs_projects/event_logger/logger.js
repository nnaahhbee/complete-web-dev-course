const fs = require('fs');
const os = require('os');
const path = require("path");

const EventEmitter = require('events');

class Logger extends EventEmitter{
    log(message){
        this.emit('message', {message})
    }
}

const logger = new Logger();
const logFile = path.join(__dirname, "eventlog.txt");

const logToFile = (event) => {
    const logMessage = `${new Date().toISOString()} - ${event.message} \n`;
    fs.appendFileSync(logFile, logMessage);
}

logger.on('message', logToFile);

setInterval(() => {
   const memoryusage = os.freemem() / os.totalmem() * 100
   logger.log(`Current memory usage: ${memoryusage.toFixed(2)}`);
}, 3000);

logger.log('Application started');
logger.log('Application event occured');
