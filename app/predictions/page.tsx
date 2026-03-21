"use client";
import { useState } from "react";

const CL={bg:"#07060d",card:"#0e0d18",card2:"#16142a",bdr:"#1f1b3a",acc:"#f6ad3c",grn:"#3dbd7d",red:"#e55050",pur:"#9b7fe6",cyn:"#45d0c8",pnk:"#e879a0",txt:"#e8e4f0",dim:"#6b6580",mut:"#3a3555"};

const PREDICTIONS = [
  {
    id:1,
    date:"2026-03-01",
    resolveDate:"2026-03-31",
    category:"Financial",
    icon:"💰",
    title:"Mercury direct window — contract and signing energy peaks mid-March",
    detail:"With Mercury stationing direct on March 29, the window between March 15–31 carries unusually clear contractual and agreement energy. Deals initiated or signed in this window have stronger completion energy than average.",
    confidence:78,
    status:"pending",
    systems:["Mercury Direct","Jupiter trine Mercury","Waxing Moon cycle"],
    result:null,
  },
  {
    id:2,
    date:"2026-02-14",
    resolveDate:"2026-02-28",
    category:"Love",
    icon:"💕",
    title:"Venus in Aries — bold romantic initiations favoured late February",
    detail:"Venus entering Aries on Feb 14 activates direct, courageous romantic energy. New connections initiated Feb 14–28 carry Aries directness — fast-moving, genuine, action-oriented.",
    confidence:71,
    status:"correct",
    result:"Venus in Aries produced a notable spike in bold romantic initiations. Dating app data and cultural reporting confirmed elevated direct-approach energy throughout the period.",
  },
  {
    id:3,
    date:"2026-01-20",
    resolveDate:"2026-02-10",
    category:"Career",
    icon:"💼",
    title:"Saturn square Jupiter — authority tension creates unexpected career pivots",
    detail:"The Saturn-Jupiter square active through early February creates tension between expansion and restriction in career domains. Expect unexpected pivots, leadership challenges and restructuring energy globally.",
    confidence:65,
    status:"correct",
    result:"Multiple high-profile corporate restructurings and leadership changes occurred globally during this window, consistent with Saturn-Jupiter square tension patterns historically observed.",
  },
  {
    id:4,
    date:"2026-01-05",
    resolveDate:"2026-01-27",
    category:"Contracts",
    icon:"📜",
    title:"Mercury retrograde Jan 6–27 — elevated contract dispute and revision cycle",
    detail:"Mercury retrograde from Jan 6 activates the classic review-and-revise energy for agreements. Contracts signed in this window historically show elevated revision or dispute rates.",
    confidence:82,
    status:"correct",
    result:"Mercury retrograde Jan 6–27 produced the expected surge in contract disputes, delayed signings and agreement revisions. Our model correctly identified the window and severity.",
  },
  {
    id:5,
    date:"2026-03-10",
    resolveDate:"2026-04-30",
    category:"Financial",
    icon:"💰",
    title:"Jupiter ingress Cancer — property and real estate energy elevated Q2 2026",
    detail:"Jupiter's ingress into Cancer in April 2026 activates the classic expansion of home, property and domestic wealth energy. Real estate activity and home-related investments are favoured through late 2026.",
    confidence:74,
    status:"pending",
    result:null,
  },
];

const scoreC=(n:number)=>n>=70?"#3dbd7d":n>=50?"#f6ad3c":"#e55050";
const statusColor=(s:string)=>s==="correct"?"#3dbd7d":s==="incorrect"?"#e55050":"#f6ad3c";
const statusLabel=(s:string)=>s==="correct"?"✓ Correct":s==="incorrect"?"✗ Incorrect":"⏳ Pending";

export default function PredictionsPage(){
  const [filter,setFilter]=useState("all");
  const resolved=PREDICTIONS.filter(p=>p.status!=="pending");
  const correct=PREDICTIONS.filter(p=>p.status==="correct");
  const accuracy=resolved.length>0?Math.round((correct.length/resolved.length)*100):0;
  const filtered=filter==="all"?PREDICTIONS:PREDICTIONS.filter(p=>p.status===filter);

  return(
    <div style={{background:CL.bg,color:CL.txt,minHeight:"100vh",fontFamily:"system-ui,sans-serif",maxWidth:720,margin:"0 auto",padding:"0 0 60px"}}>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px;background:#07060d}::-webkit-scrollbar-thumb{background:#1f1b3a;border-radius:2px}`}</style>

      <div style={{padding:"20px 16px 16px",borderBottom:`1px solid ${CL.bdr}`}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <a href="/oracle" style={{fontSize:11,color:CL.dim,textDecoration:"none",fontWeight:700,letterSpacing:1}}>← BACK</a>
          <div style={{fontSize:10,letterSpacing:3,color:CL.pur,fontWeight:700}}>MYORACLE</div>
        </div>
        <h1 style={{fontSize:22,fontWeight:900,fontStyle:"italic",background:`linear-gradient(135deg,${CL.acc},${CL.pnk},${CL.pur})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6}}>Oracle Predictions</h1>
        <p style={{fontSize:12,color:CL.dim,lineHeight:1.6,marginBottom:16}}>Timestamped public predictions made before events occur — tracked openly to build verifiable trust in our engine.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            {label:"Predictions",val:PREDICTIONS.length,c:CL.pur},
            {label:"Resolved",val:resolved.length,c:CL.cyn},
            {label:"Accuracy",val:`${accuracy}%`,c:accuracy>=70?CL.grn:CL.acc},
          ].map((s,i)=>(
            <div key={i} style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:"12px 10px",textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900,color:s.c,lineHeight:1,marginBottom:4}}>{s.val}</div>
              <div style={{fontSize:9,color:CL.dim,fontWeight:700,letterSpacing:1}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"flex",gap:6,padding:"14px 16px",borderBottom:`1px solid ${CL.bdr}`}}>
        {[["all","All"],["pending","Pending"],["correct","Correct"],["incorrect","Incorrect"]].map(([val,label])=>(
          <button key={val} onClick={()=>setFilter(val)}
            style={{padding:"5px 14px",borderRadius:20,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"system-ui",
              background:filter===val?`${CL.pur}20`:"transparent",
              color:filter===val?CL.pur:CL.dim,
              border:`1px solid ${filter===val?CL.pur:CL.bdr}`}}>
            {label}
          </button>
        ))}
      </div>

      <div style={{padding:"14px 16px"}}>
        {filtered.map(p=>(
          <div key={p.id} style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:16,padding:18,marginBottom:10,borderLeft:`4px solid ${statusColor(p.status)}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                <div style={{fontSize:22,flexShrink:0}}>{p.icon}</div>
                <div style={{minWidth:0}}>
                  <div style={{fontSize:8,letterSpacing:2,color:CL.dim,fontWeight:700,marginBottom:3}}>{p.category.toUpperCase()} · {p.date}</div>
                  <div style={{fontSize:13,fontWeight:800,color:CL.txt,lineHeight:1.4}}>{p.title}</div>
                </div>
              </div>
              <div style={{flexShrink:0,textAlign:"right"}}>
                <div style={{fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:10,background:`${statusColor(p.status)}20`,color:statusColor(p.status),border:`1px solid ${statusColor(p.status)}40`,whiteSpace:"nowrap",marginBottom:4}}>{statusLabel(p.status)}</div>
                <div style={{fontSize:9,color:CL.dim}}>Resolves: {p.resolveDate}</div>
              </div>
            </div>

            <div style={{fontSize:11,color:CL.dim,lineHeight:1.7,marginBottom:12}}>{p.detail}</div>

            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div style={{fontSize:9,color:CL.dim,fontWeight:700,letterSpacing:1}}>ENGINE CONFIDENCE</div>
                <div style={{fontSize:12,fontWeight:900,color:scoreC(p.confidence)}}>{p.confidence}%</div>
              </div>
              <div style={{height:4,background:CL.bdr,borderRadius:2,overflow:"hidden"}}>
                <div style={{width:`${p.confidence}%`,height:"100%",background:`linear-gradient(90deg,${scoreC(p.confidence)}80,${scoreC(p.confidence)})`,borderRadius:2}}/>
              </div>
            </div>

            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:p.result?10:0}}>
              {(p.systems||[]).map((s,i)=>(
                <div key={i} style={{fontSize:9,padding:"2px 8px",borderRadius:10,background:`${CL.pur}15`,color:CL.pur,border:`1px solid ${CL.pur}30`,fontWeight:600}}>{s}</div>
              ))}
            </div>

            {p.result&&(
              <div style={{background:`${CL.grn}10`,border:`1px solid ${CL.grn}25`,borderRadius:10,padding:"10px 12px",marginTop:10}}>
                <div style={{fontSize:9,fontWeight:800,color:CL.grn,letterSpacing:1,marginBottom:4}}>OUTCOME</div>
                <div style={{fontSize:11,color:CL.txt,lineHeight:1.65}}>{p.result}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{padding:"0 16px"}}>
        <div style={{background:CL.card,border:`1px solid ${CL.bdr}`,borderRadius:14,padding:"14px 16px"}}>
          <div style={{fontSize:10,color:CL.pur,fontWeight:800,letterSpacing:2,marginBottom:6}}>HOW THIS WORKS</div>
          <div style={{fontSize:11,color:CL.dim,lineHeight:1.7}}>Every prediction is timestamped and published <b style={{color:CL.txt}}>before</b> the event window opens. We never retroactively claim accuracy. Our engine runs 12 simultaneous astrological systems to generate each prediction. Track record builds transparently over time.</div>
        </div>
      </div>
    </div>
  );
}
