import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../build/client/',import.meta.url));
const port=Number(process.env.PORT || 4173);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.data':'text/x-script','.webp':'image/webp','.avif':'image/avif','.jpg':'image/jpeg','.png':'image/png','.gif':'image/gif','.ico':'image/x-icon','.xml':'application/xml','.txt':'text/plain'};
http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    const pathname=decodeURIComponent(url.pathname);
    let file=path.resolve(root,`.${pathname}`);
    const relative=path.relative(root,file);
    if(relative==='..'||relative.startsWith(`..${path.sep}`)||path.isAbsolute(relative))throw Error('Invalid path');
    let info;
    try{info=await stat(file);}catch{/* Static 404 below. */}
    if(info?.isDirectory()){
      if(!pathname.endsWith('/')){res.writeHead(301,{Location:pathname+'/'+url.search});res.end();return;}
      file=path.join(file,'index.html');
    }
    let bytes;
    try{bytes=await readFile(file);}catch{
      // Some static hosts serve extensionless documents directly.
      if(!path.extname(file))try{file+='.html';bytes=await readFile(file);}catch{}
      if(!bytes){res.statusCode=404;file=path.join(root,'404.html');bytes=await readFile(file);}
    }
    res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
    res.setHeader('Cache-Control',pathname.startsWith('/media/')||pathname.startsWith('/assets/')?'public, max-age=31536000, immutable':'no-cache');
    res.end(req.method==='HEAD'?undefined:bytes);
  }catch{res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`Static preview: http://127.0.0.1:${port}`));
