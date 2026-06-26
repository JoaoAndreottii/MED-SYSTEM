FROM node:20-alpine

WORKDIR /app

# Test: just run node directly
CMD ["node", "-e", "require('http').createServer((req,res)=>{res.writeHead(200);res.end(JSON.stringify({status:'ok',time:new Date().toISOString()}))}).listen(3000,'0.0.0.0',()=>console.log('Server listening'))"]
