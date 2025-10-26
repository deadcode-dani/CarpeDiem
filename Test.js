
w = 600;
h = 900;

let panel2, panel3; //panel2 come layer di appoggio

let ringExt=[];
let fpsHistory = [];

let ring=[];
let font;
let startTime;
let endTime=new Date("2026-02-15T20:00:00");  //15 febbraio 1564 data nascita galileo galilei
let timeStep=2;
let dimCiclo=(33426748355*timeStep*1000);

let symbols=[];

symbols[0] = ["M", "a", "b", "c", "d"];
symbols[1]  = ["E", "A","B", "C", "D", "F", "G"];
symbols[2] = ["I", "A", "B", "C", "D", "E", "F", "G","H","J","L"];
symbols[3] = ["D", "A", "B", "C", "D", "E", "F", "G","H","I","J","K","L"];
symbols[4] = ["E", "A", "B", "C", "D", "F", "G","H","I","J","K","L","M","N","O","P","Q"];
symbols[5] = ["P", "A", "B", "C", "E", "F", "G","H","I","J","K","L","M","N","O","P","Q","R","S"];
symbols[6] = ["R", "A", "B", "C", "D","E", "F", "G","H","J","K","L","M","N","O","P","Q","R","S","T","U","V","W"];
symbols[7] = ["A", "A", "B", "C", "D", "F", "G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3"];
 symbols[8] = ["C", "A", "B", "C", "D","E", "F", "G","H","I","J","K","L","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","1","2","3","4","5"];



function formatDate(ms) {
  let d = new Date(ms);

  // Parti della data
  let day = String(d.getDate()).padStart(2, '0');
  let month = String(d.getMonth() + 1).padStart(2, '0'); // i mesi vanno da 0 a 11
  let year = d.getFullYear();

  let hours = String(d.getHours()).padStart(2, '0');
  let minutes = String(d.getMinutes()).padStart(2, '0');
  let seconds = String(d.getSeconds()).padStart(2, '0');

  // Offset del fuso orario in minuti (es. +120 per GMT+2)
  let tzOffsetMinutes = d.getTimezoneOffset(); // differenza da UTC in minuti (negativo per fusi +)
  let tzOffsetHours = -tzOffsetMinutes / 60;   // trasformo in ore
  let sign = tzOffsetHours >= 0 ? "+" : "-";

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

function ceil5(n) {
  // moltiplichiamo per 1e5 (100 000), applichiamo ceil, poi torniamo alla scala originale
  return Math.ceil(n * 1e6) / 1e6;
  // In uno sketch p5.js potresti usare anche ceil() di p5:
  // return ceil(n * 1e5) / 1e5;
}

function calcCerchioImperfetto2(pC,p_raggio,p_rand,p_num_point)
{
   let passo=ceil5(TWO_PI/p_num_point);
   let v_list=[];
   let i=0;
   for(let k=0; k<TWO_PI; k=k+passo,i++)
   {
       let k_rand=randomHash(0,passo*0.25)
       let x1=pC.x+cos(k+k_rand)*p_raggio+randomHash(-p_rand,p_rand);
       let y1=pC.y+sin(k+k_rand)*p_raggio+randomHash(-p_rand,p_rand);
       v_list[i]=new VarCoord(x1,y1);
   }
  
   return v_list;
}

class Ring2 {
  constructor(numPoints, radius, symbols, p_altezza, p_larghezza, p_elementi, pgSize = 800) {
    this.numPoints = numPoints;
    this.radius = radius;
    this.symbols = symbols;
    this.pgSize = pgSize;

    // Prepara il buffer per disegnare l'anello
    this.buffer = createGraphics(pgSize, pgSize);
    this.bufferfinal = createGraphics(pgSize, pgSize);
    this.buffer.textAlign(CENTER, CENTER);
    this.buffer.textSize(24);
    this.buffer.textFont('Helvetica');
    this.buffer.translate(pgSize / 2, pgSize / 2);
    this.buffer.noFill();
     /*
    this.buffer.circle(0,0,(radius*2)-18)
    */
         let pC=new VarCoord(0,0);
     let p_num_lati=12;
     let v_list=calcCerchioImperfetto2(pC,(radius)-12,1,p_num_lati);

    this.angleStep = TWO_PI / this.numPoints;

    // Disegno statico dell’anello con simboli già orientati
    for (let i = 0; i < this.numPoints; i++) {
      let angle = i * this.angleStep - HALF_PI; // orientamento tipo orologio
      
      let x = this.radius * cos(angle);
      let y = this.radius * sin(angle);
      this.buffer.fill(255)
      
      this.buffer.push();
      this.buffer.translate(x, y);
      this.buffer.rotate(angle + HALF_PI); // orientamento verticale simboli
      this.buffer.fill(0)
      let dim_font=p_altezza;

      
      let c1=new VarCoord(0,-dim_font);
      let c2=new VarCoord(0,dim_font);

      this.buffer.fill([139,125,107,160])
      this.buffer.noStroke();
      drawLinesParallel(this.buffer,c1,c2,1, p_elementi, p_larghezza, 1)


      this.buffer.pop();
    
      
    }
  }

  // Calcola l'angolo di rotazione in base al tempo
  getRotation(startTime, currentTime, stepTime) {
    let elapsed = (currentTime - startTime) / 1000; // secondi trascorsi
    let fullRotationTime = stepTime * this.numPoints;
    let phase = (elapsed % fullRotationTime) / fullRotationTime; // [0,1)
    return phase * TWO_PI;
  }
  
  getCurrentSymbol(startTime, currentTime, stepTime) {
    let elapsed = (currentTime - startTime) / 1000; 
    let stepIndex = floor(elapsed / stepTime); 
    let progress = (elapsed % stepTime) / stepTime;

    // indice effettivo su ore 12, corretto per la rotazione oraria
    let currentSymbolIndex = (this.numPoints - (stepIndex % this.numPoints)) % this.numPoints;
    let symbol = this.symbols[currentSymbolIndex];

    let aligned = (progress === 0);

    return {
      index: currentSymbolIndex,
      symbol: symbol,
      aligned: aligned,
      progress: progress
    };
   }
  // Disegna l’anello al centro della canvas con la rotazione corretta
  draw(x, y, startTime, currentTime, stepTime,panel) {
    let rotation = this.getRotation(startTime, currentTime, stepTime);
 
    panel.push();
    
    panel.translate(x, y);
    panel.rotate(rotation);
    panel.imageMode(CENTER);
    panel.image(this.buffer, 0, 0);
    this.bufferfinal.clear();
    this.bufferfinal.push();
        this.bufferfinal.translate(x, y);
    this.bufferfinal.rotate(rotation);
    this.bufferfinal.imageMode(CENTER);
    this.bufferfinal.image(this.buffer, 0, 0);
    this.bufferfinal.pop();
    panel.pop();
   
  }
  
}


class Ring {
  constructor(numPoints, radius, symbols, pgSize = 800) {
    this.numPoints = numPoints;
    this.radius = radius;
    this.symbols = symbols;
    this.pgSize = pgSize;

    // Prepara il buffer per disegnare l'anello
    this.buffer = createGraphics(pgSize, pgSize);
    this.buffer.textAlign(CENTER, CENTER);
    this.buffer.textSize(24);
    this.buffer.textFont('Helvetica');
    this.buffer.translate(pgSize / 2, pgSize / 2);
    this.buffer.noFill();
  
     let pC=new VarCoord(0,0);
     let p_num_lati=12;
     let v_list=calcCerchioImperfetto2(pC,(radius)-12,1,p_num_lati);
    
     //drawPoly(v_list,true,this.buffer,false)
    let v_list2=calcPointsCurveCircle(v_list,0.8,1);
     this.buffer.stroke([139,125,107,180])
     //drawPointsDim(v_list2,this.buffer,1,2);
    
      v_list=calcCerchioImperfetto2(pC,(radius)-15,1,p_num_lati);
     
     //drawPoly(v_list,true,this.buffer,false)
      v_list2=calcPointsCurveCircle(v_list,0.6,0);
     this.buffer.stroke([139,125,107,255])
     drawPointsDim(v_list2,this.buffer,1,3);
    
    
     v_list2=calcPointsCurveCircle(v_list,0.3,1);
     this.buffer.stroke([139,125,107,160])
     drawPointsDim(v_list2,this.buffer,1,4);
     
    
     v_list=calcCerchioImperfetto2(pC,(radius)+12,1,p_num_lati);

     v_list2=calcPointsCurveCircle(v_list,0.1,0);
     this.buffer.stroke([139,125,107,180])
     drawPointsDim(v_list2,this.buffer,4,4);
    
    this.buffer.fill(255)

    this.angleStep = TWO_PI / this.numPoints;

    // Disegno statico dell’anello con simboli già orientati
    for (let i = 0; i < this.numPoints; i++) {
      let angle = i * this.angleStep - HALF_PI; // orientamento tipo orologio
      
      let x = this.radius * cos(angle);
      let y = this.radius * sin(angle);
      this.buffer.fill(255)
      //this.buffer.circle(x,y,28)

      this.buffer.push();
      this.buffer.translate(x, y);
      this.buffer.rotate(angle + HALF_PI); // orientamento verticale simboli
      
      

      if(i==0)
      {
        this.buffer.strokeWeight(7)
        this.buffer.textSize(26);
        this.buffer.stroke([220,0,0,180])
        this.buffer.strokeJoin(ROUND);
        this.buffer.text(this.symbols[i % this.symbols.length], 0, 4);
        this.buffer.strokeWeight(0)
        this.buffer.fill(255)
        this.buffer.text(this.symbols[i % this.symbols.length], 0, 4);
      }
      else
      {  
        let dim_font=11;
        this.buffer.strokeJoin(BEVEL); 
        let fig="AS7_";
        let letter_fig=fig.concat(i);
        let coord1=new VarCoord(dim_font,-dim_font);
        let coord2=new VarCoord(-dim_font,-dim_font);
        let coord3=new VarCoord(-dim_font,dim_font);
        let coord4=new VarCoord(dim_font,dim_font);

        this.buffer.strokeWeight(4)
        drawElementPanel(coord1,coord2,coord3,coord4,
                        0, //0=no distortion
                        0, //0 no scale
                        6,5,5,[50,50,50,180],letter_fig,this.buffer)
        this.buffer.erase();
        this.buffer.strokeWeight(0)
        drawElementPanel(coord1,coord2,coord3,coord4,
                        0, //0=no distortion
                        0, //0 no scale
                        3,1,1,255,letter_fig,this.buffer)    
        this.buffer.noErase();
      }
      this.buffer.pop();
    
      
    }
  }

  // Calcola l'angolo di rotazione in base al tempo
  getRotation(startTime, currentTime, stepTime) {
    let elapsed = (currentTime - startTime) / 1000; // secondi trascorsi
    let fullRotationTime = stepTime * this.numPoints;
    let phase = (elapsed % fullRotationTime) / fullRotationTime; // [0,1)
    return phase * TWO_PI;
  }
  
  getCurrentSymbol(startTime, currentTime, stepTime) {
    let elapsed = (currentTime - startTime) / 1000; 
    let stepIndex = floor(elapsed / stepTime); 
    let progress = (elapsed % stepTime) / stepTime;

    // indice effettivo su ore 12, corretto per la rotazione oraria
    let currentSymbolIndex = (this.numPoints - (stepIndex % this.numPoints)) % this.numPoints;
    let symbol = this.symbols[currentSymbolIndex];

    let aligned = (progress === 0);

    return {
      index: currentSymbolIndex,
      symbol: symbol,
      aligned: aligned,
      progress: progress
    };
   }
  // Disegna l’anello al centro della canvas con la rotazione corretta
  draw(x, y, startTime, currentTime, stepTime,panel) {
    let rotation = this.getRotation(startTime, currentTime, stepTime);

    panel.push();
    panel.translate(x, y);
    panel.rotate(rotation);
    panel.imageMode(CENTER);
    panel.image(this.buffer, 0, 0);
    panel.pop();
    
    
  }
  

}

function drawLinesParallel(panel,c1,c2,p_spessore, p_num_elem, p_max_dim, p_rand)
{
    //calcola punti paralleli da c1 e c2 a distanza p_max_dim
    let pUp=findPoints(c1,c2, p_max_dim,PI/2);
    let pDown=findPoints(c1,c2, p_max_dim,-PI/2);
  
    let dimUp=calcDistPuntiCoord(pUp[0],pUp[1]);
    let dimDown=calcDistPuntiCoord(pDown[0],pDown[1]);
  
    let passoUp=dimUp/p_num_elem;
    let passoDown=dimDown/p_num_elem;
  
    for(let k=0;k<p_num_elem;k++)
    {  
       let p1=calcPuntoRettaCoord(pUp[0],pUp[1],
                                  (k*passoUp)+randomHash(-p_rand,p_rand));
       let p2=calcPuntoRettaCoord(pDown[0],pDown[1],
                                  (k*passoDown)+randomHash(-p_rand,p_rand));
      
       //accorcia la lina in modo casuale
       let p_accorcia=randomHash(0,p_max_dim/4);
       
       let p1_n=calcPuntoRettaCoord(p1,p2,p_accorcia);
       let p2_n=calcPuntoRettaCoord(p2,p1,p_accorcia);
      
       let points1=findPoints(p1_n,p2_n, p_spessore,PI/2);
       let points2=findPoints(p1_n,p2_n, p_spessore,-PI/2);
      
       drawPoly([points1[0],points1[1],points2[1],points2[0]],false,panel,false)
    }
}
function drawMainTest_002(panel,p_time)
{   
  frameRate(120)
  let fps = frameRate();
    fpsHistory.push({time: millis(), fps: frameRate()});

  // Tengo solo i valori degli ultimi 500 ms
  let cutoff = millis() - 500;
  fpsHistory = fpsHistory.filter(d => d.time >= cutoff);

  // Calcolo media degli fps negli ultimi 500ms
  let avgFps = fpsHistory.reduce((sum, d) => sum + d.fps, 0) / fpsHistory.length;
  
  panel.background("#FDF5E6");
  if(p_time==0)
  {
      
      let num_primi=[5,7,11,13,17,19,23,29,31]
      panel2=createGraphics(w, h);
      panel3=createGraphics(w, h);
      let dim_anello=32; //32
      //disegna anelli interni 
      for(let k=0;k<9;k++)
          ring[k]= new Ring(num_primi[k], 30+(dim_anello*k), symbols[k],20+(dim_anello*(k+1))*2);

      //disegna anelli esterni solo decorativi
      ringExt[0]=new Ring2(60, 30+(dim_anello*11), symbols[0],55,10,30,900);
      ringExt[1]=new Ring2(35, 30+(dim_anello*15), symbols[0],30,40,7,1100);
      //ringExt[2]=new Ring2(196, 30+(dim_anello*16), symbols[0],55,4,24,900);
    
      startTime =endTime.getTime()-(dimCiclo);
      
      //su panel 2 disegna la carta dello sfondo e la riga centrale
      drawEffettoCarta01(panel2,new VarCoord(0,0),
                       h,w,210,
                       0.45,//grana
                       0.9,//intensita
                       0.2 //riempimento
                      );
    
      let c1= new VarCoord(w/2,h*0.8)
      let c2= new VarCoord(w/2,0)
      panel2.stroke([40,40,40,120])
      drawRigaPoint(c1, //COORDINATA PUNTO 1 
                          c2, //COORDINATA PUNTO 2
                          0.7, //DENSITA PUNTI RETTA (VALORE)
                          1, //DIMENSIONE MINIMA DEI PUNTI
                          3, //DIMENSIONE MASSIMA DEI PUNTI
                          1, 
                          panel2
                         )
      panel2.fill([240,240,240,120])
      panel2.circle(w / 2,h*0.8,10)
    
      let p_bordo=5;
      panel3.noStroke();
      panel3.fill(0)
      panel3.rect(0,0,w,p_bordo)
      panel3.rect(0,h-p_bordo,w,p_bordo)
      panel3.rect(0,0,p_bordo,h)
      panel3.rect(w-p_bordo,0,p_bordo,h)
    
      
  }  
   panel.image(panel2,0,0)
  let currentTime = Date.now();


  panel.fill(0)
  for(let k=0;k<9;k++)
  {
    ring[k].draw(w / 2, h*0.8, startTime, currentTime, timeStep,panel)
  }
  if(avgFps>24)
  {
    ringExt[0].draw(w /2, h*0.8, startTime, currentTime, timeStep*9,panel)
    ringExt[1].draw(w /2, h*0.8, startTime, currentTime, timeStep*6,panel)
  }
  else
  { 
    panel.image(ringExt[0].bufferfinal,0,0)
    panel.image(ringExt[1].bufferfinal,0,0)

  }
  panel.textSize(30) 

  //INIZIO CICLO ATTUALE
  panel.textSize(10)

  let startCurrentCiclo=new Date(startTime);
  let endCurrentCiclo=endTime;
  if(currentTime>endTime)
  {  
      startCurrentCiclo=endTime;
      endCurrentCiclo=new Date(startCurrentCiclo.getTime()+dimCiclo);
  }  
  panel.text("INIZIO CICLO ATTUALE: "+formatDate(startCurrentCiclo), 60, 40);
  panel.text("FINE CICLO ATTUALE  : "+formatDate(endCurrentCiclo), 330, 40);
  panel.text("CONTO ALLA ROVESCIA : "+Math.trunc((endCurrentCiclo.getTime()-currentTime)/1000), 330, 60);
  //panel.text("FPS : "+int(avgFps), 60, 60);
  panel.image(panel3,0,0)
}   

