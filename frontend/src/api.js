const BASE = "/api";
function authHeaders() { const token = localStorage.getItem("ecosort_token"); return token ? { Authorization: `Bearer ${token}` } : {}; }
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {...options, headers:{"Content-Type":"application/json",...authHeaders(),...(options.headers||{})}});
  if(res.status===204) return null;
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}
export const api={
 signup:(name,email,password)=>request("/auth/signup",{method:"POST",body:JSON.stringify({name,email,password})}),
 login:(email,password)=>request("/auth/login",{method:"POST",body:JSON.stringify({email,password})}),
 classify:(item)=>request("/classify",{method:"POST",body:JSON.stringify({item})}),
 getHistory:()=>request("/history"), deleteHistoryItem:id=>request(`/history/${id}`,{method:"DELETE"}), clearHistory:()=>request("/history",{method:"DELETE"}),
 getImpact:()=>request("/impact"), getDashboard:()=>request("/dashboard"),
};
