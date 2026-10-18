import {PassThrough} from 'node:stream';
import {createReadableStreamFromReadable} from '@react-router/node';
import {renderToPipeableStream} from 'react-dom/server';
import {ServerRouter} from 'react-router';

// This entry runs during development and static generation; no runtime server is deployed.
export default function handleRequest(request,status,headers,context) {
  return new Promise((resolve,reject)=>{
    const body=new PassThrough();
    let timeout;
    const {pipe,abort}=renderToPipeableStream(<ServerRouter context={context} url={request.url}/>,{
      onAllReady(){
        headers.set('Content-Type','text/html; charset=utf-8');
        resolve(new Response(createReadableStreamFromReadable(body),{status,headers}));
        pipe(body);
      },
      onShellError(error){clearTimeout(timeout);reject(error);},
      onError(error){status=500;console.error(error);},
    });
    timeout=setTimeout(abort,10000);
    body.on('end',()=>clearTimeout(timeout));
    body.on('close',()=>clearTimeout(timeout));
  });
}
