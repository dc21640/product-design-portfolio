// Images live in the user's browser, not on the portfolio host. IndexedDB is
// better suited to original-resolution image blobs than localStorage.
const DB='exposure-photo-vault-v1'; const STORE='images';
function openVault():Promise<IDBDatabase>{
  return new Promise((resolve,reject)=>{
    if(typeof indexedDB==='undefined') return reject(new Error('This browser does not support local image storage.'));
    const request=indexedDB.open(DB,1);
    request.onupgradeneeded=()=>{const db=request.result; if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE);};
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error??new Error('Could not open local image storage.'));
  });
}
async function transact<T>(mode:IDBTransactionMode,action:(store:IDBObjectStore,success:(result:T)=>void)=>void):Promise<T>{
  const db=await openVault();
  return new Promise((resolve,reject)=>{
    const tx=db.transaction(STORE,mode);const store=tx.objectStore(STORE);let output:T;
    action(store, (v)=>{output=v;});
    tx.oncomplete=()=>{db.close();resolve(output);};
    tx.onerror=()=>{db.close();reject(tx.error??new Error('Image storage error.'));};
    tx.onabort=()=>{db.close();reject(tx.error??new Error('Image storage aborted.'));};
  });
}
export async function putPhoto(id:string,blob:Blob):Promise<void>{
  return transact<void>('readwrite',(store,done)=>{store.put(blob,id);done();});
}
export async function getPhoto(id:string):Promise<Blob|null>{
  return transact<Blob|null>('readonly',(store,done)=>{
    const req=store.get(id);req.onsuccess=()=>done((req.result as Blob|undefined)??null);
  });
}
export async function deletePhoto(id:string):Promise<void>{
  return transact<void>('readwrite',(store,done)=>{store.delete(id);done();});
}
