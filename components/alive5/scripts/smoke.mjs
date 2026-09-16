import assert from 'node:assert/strict';
import http from 'node:http';
import app from '../alive5.app.mjs';
import send from '../actions/send-sms/send-sms.mjs';
import source from '../sources/new-sms-received/new-sms-received.mjs';
const api=Object.assign({$auth:{api_key:'test-key'}}, app.methods);
const adapter=(body)=>async(config)=>({data:body,status:200,statusText:'OK',headers:{},config});
await assert.rejects(api._request({adapter:adapter({data:{}})}),/rejected/);
await assert.rejects(api._request({adapter:adapter({code:200,data:{error:{message:'failed'}}})}),/rejected/);
assert.deepEqual(await api._request({adapter:adapter({code:200,error:{},data:{Items:[]}})}),{Items:[]});
await assert.rejects(send.run.call({smsLine:'channel|+14155550100',to:'+14155550123',message:'  '},{$:{export(){}}}),/text/);
let subscription={id:'owned-test-hook',phoneNumber:'+14155550100',deliveryToken:'test-delivery-token'};
const ctx={db:{get:()=>subscription,set:(_,v)=>{subscription=v}},alive5:{async deleteSubscription(){throw Error('temporary failure')}}};
ctx._getSubscription=source.methods._getSubscription;
ctx._setSubscription=source.methods._setSubscription;
await assert.rejects(source.hooks.deactivate.call(ctx),/temporary failure/);
assert.ok(subscription,'Failed cleanup must retain the owned subscription');
const emitted=[];const responses=[];
const sourceCtx={db:{get:()=>subscription},_getSubscription:source.methods._getSubscription,http:{respond(value){responses.push(value)}},$emit:(data,meta)=>emitted.push({data,meta})};
const body={event_id:'11111111-1111-4111-8111-111111111111',direction:'inbound',message:'test',from_phone:'+14155550123',business_line:'+14155550100',received_at:'2026-09-12T20:02:55.000Z',channel_id:'test-channel',thread_id:'test-thread',media_url:null,private_field:'omit-me'};
const event={method:'POST',headers:{'X-Alive5-Relay-Token':subscription.deliveryToken},body};
await source.run.call(sourceCtx,event);await source.run.call(sourceCtx,event);
assert.equal(emitted[0].meta.id,emitted[1].meta.id);
assert.equal(emitted[0].data.received_at,'2026-09-12T20:02:55.000Z');
await source.run.call(sourceCtx,{...event,body:{...body,event_id:'22222222-2222-4222-8222-222222222222'}});
assert.equal(source.dedupe,'unique');
assert.equal(source.version,'0.0.2');
assert.notEqual(emitted[0].meta.id,emitted[2].meta.id);
assert.deepEqual(emitted[0].data,emitted[2].data);
assert.deepEqual(Object.keys(emitted[0].data).sort(),['message','from_phone','business_line','channel_id','thread_id','direction','received_at','media_url'].sort());
for(const headers of [{},{'x-alive5-relay-token':'wrong'},{'x-alive5-relay-token':'x'.repeat(subscription.deliveryToken.length)},{'x-alive5-relay-token':'é'.repeat(subscription.deliveryToken.length)},{'x-alive5-relay-token':[subscription.deliveryToken]}]){
  await source.run.call(sourceCtx,{...event,headers});
  assert.equal(responses.at(-1).status,401);
}
await source.run.call(sourceCtx,{...event,method:'GET'});
assert.equal(responses.at(-1).status,405);
for(const invalid of [{...body,direction:'outbound'},{...body,event_id:''},{...body,message:' '},{...body,received_at:'invalid'},null,[]]){
  await source.run.call(sourceCtx,{...event,body:invalid});
  assert.equal(responses.at(-1).status,400);
}
assert.equal(emitted.length,3);
const relayCalls=[];
const relayApi={...api,async _request(options){
  return api._request({...options,adapter:async(config)=>{
    relayCalls.push(config);
    return adapter(config.method==='post'?subscription:{ok:true})(config);
  }});
}};
assert.deepEqual(await relayApi.createSubscription({phoneNumber:subscription.phoneNumber,url:'https://example.com/private-capability'}),subscription);
assert.deepEqual(await relayApi.deleteSubscription({id:'owned/test-hook'}),{ok:true});
assert.equal(relayCalls[0].baseURL,'https://alive5-connectors-relay.raghav-ojha-14122.workers.dev');
assert.deepEqual(JSON.parse(relayCalls[0].data),{target:'https://example.com/private-capability',phoneNumber:subscription.phoneNumber});
assert.equal(relayCalls[1].url,'/subscriptions/owned%2Ftest-hook');
assert.equal(relayCalls[0].headers['X-A5-APIKEY'],'test-key');
assert.ok(relayCalls.every(config=>config.maxRedirects===0));
for(const result of [{},null,{ok:false}]){
  ctx.alive5.deleteSubscription=(args)=>app.methods.deleteSubscription.call({_request:async()=>result},args);
  await assert.rejects(source.hooks.deactivate.call(ctx),/confirm subscription cleanup/);
  assert.ok(subscription,'Unconfirmed cleanup must retain the subscription');
}
ctx.alive5.deleteSubscription=(args)=>app.methods.deleteSubscription.call({_request:()=>api._request({relay:true,adapter:async()=>{throw {response:{status:404}}}})},args);
await assert.rejects(source.hooks.deactivate.call(ctx),/404/);
assert.ok(subscription,'Failed HTTP cleanup must retain the subscription');
const owned={...subscription};
ctx.alive5.deleteSubscription=async({id})=>{assert.equal(id,owned.id);return {ok:true}};
await source.hooks.deactivate.call(ctx);
assert.equal(subscription,null);
await source.run.call(sourceCtx,event);
assert.equal(responses.at(-1).status,401);
ctx.smsLine='test-channel|+14155550100';
ctx.http={endpoint:'https://example.com/private-capability'};
ctx.alive5.createSubscription=async(args)=>{assert.deepEqual(args,{phoneNumber:owned.phoneNumber,url:ctx.http.endpoint});return owned};
await source.hooks.activate.call(ctx);
assert.deepEqual(subscription,owned);
await assert.rejects(source.hooks.activate.call(ctx),/already exists/);
const redirectRequests=[];
const redirectServer=http.createServer((request,response)=>{
  redirectRequests.push({path:request.url,apiKey:request.headers['x-a5-apikey']});
  if(request.url==='/redirect'){
    response.writeHead(302,{Location:'/target'});
  }else if(request.url==='/target'){
    response.writeHead(200);
  }else{
    response.writeHead(404);
  }
  response.end();
});
await new Promise((resolve,reject)=>{
  redirectServer.once('error',reject);
  redirectServer.listen(0,'127.0.0.1',resolve);
});
try{
  const {port}=redirectServer.address();
  for(const relay of [false,true]){
    await assert.rejects(api._request({relay,maxRedirects:10,baseURL:`http://127.0.0.1:${port}`,url:'/redirect'}),/Alive5 HTTP request failed \(302\)/);
  }
  assert.deepEqual(redirectRequests.map(({path})=>path),['/redirect','/redirect']);
  assert.equal(redirectRequests[0].apiKey,'test-key');
  assert.equal(redirectRequests.find(({path})=>path==='/target')?.apiKey,undefined);
}finally{
  await new Promise((resolve,reject)=>redirectServer.close(error=>error?reject(error):resolve()));
}
await assert.rejects(app.methods.createSubscription.call({async _request(){return {}}}, {
  phoneNumber:'+14155550100',url:'https://example.com/private-capability',
}), error => !error.message.includes('private-capability'));
const secret='private-capability-test-key-delivery-token';
const sanitized=error=>!error.message.includes(secret)&&!error.cause&&!error.config;
const rejectedAdapter=body=>async()=>{throw {message:secret,config:{url:secret},cause:Error(secret),response:{status:'401',data:body}}};
const guidance='The Alive5 API key is invalid. Reconnect your account.';
await assert.rejects(api._request({adapter:rejectedAdapter({error:{message:'Invalid token'}})}),error=>
  error.message===`Alive5 HTTP request failed (401). ${guidance}`&&sanitized(error)&&!('response' in error));
for(const body of [{error:{message:'Invalid token'}},{error:' Invalid token '},{data:{error:{message:'Invalid token'}}},{data:{error:'Invalid token'}}]){
  await assert.rejects(api._request({adapter:adapter({code:'401',...body})}),error=>
    error.message===`Alive5 rejected the request (code 401). ${guidance}`&&sanitized(error));
}
for(const message of [secret,`Invalid token ${secret}`,'toString','constructor','__proto__']){
  for(const body of [{error:{message}},{error:message},{data:{error:{message}}},{data:{error:message}},message]){
    for(const httpError of [false,true]){
      const requestAdapter=httpError?rejectedAdapter(body):adapter({code:401,...(typeof body==='object'?body:{message:body})});
      const expected=httpError?'Alive5 HTTP request failed (401).':'Alive5 rejected the request (code 401). Check your API key and input values.';
      await assert.rejects(api._request({adapter:requestAdapter}),error=>error.message===expected&&sanitized(error));
    }
  }
}
for(const [message,detail] of [
  ['Could not create subscription','Alive5 could not create the webhook subscription. Check your API key and that the selected line is still active.'],
  ['Could not delete subscription','Alive5 could not delete the webhook subscription. Retry cleanup before discarding the source.'],
  ['Subscription not found; retry after propagation or reconcile','The Alive5 webhook subscription was not found. Retry after propagation, or reconcile the subscription manually.'],
]){
  await assert.rejects(api._request({relay:true,adapter:rejectedAdapter({error:message})}),error=>
    error.message===`Alive5 HTTP request failed (401). ${detail}`&&sanitized(error));
}
await assert.rejects(api._request({adapter:adapter({code:secret,error:{message:secret}})}),sanitized);
await assert.rejects(api._request({adapter:adapter({code:200,data:{code:secret,error:secret}})}),sanitized);
for(const relay of [false,true]){
  await assert.rejects(api._request({relay,adapter:async()=>{throw {message:secret,config:{url:secret},response:{status:secret,data:secret}}}}),sanitized);
}
console.log('PASS: relay lifecycle, bare responses, authenticated normalized events, retry IDs, distinct identical messages, cleanup retention, HTTP redirect blocking, sanitized errors');
