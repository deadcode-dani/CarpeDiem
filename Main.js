/*
    SCRIPT DOVE GESTIRE TUTTI PARAMETRI IN INGRESSO, LE FEATURES E LA SCELTA DEI PARAMETRI CASUALI e LE VARIABILI DI APPOGGIO
*/

//***PARAMETRI CANVAS
//dimensione canvas su cui costruire l'immagine
let w = 3500;
let h = 3500;

//nome del file da utilizzare in fase di salvataggio
let name_file="Deadcode";

//se canvas_dinamico=true viene usata la dimensione effettiva del frame --> windowWidth, windowHeight
//se canvas non è dinamico viene istanziata la dimenensione del canvas pari a quella dell'immagine. 
//In questo caso l'eventuale scaling dinamico viene gestito dal CSS (vedere style.css)
let canvas_dinamico=false;
//colore sfondo di riempimento in caso di canvas dinamico
let canvas_background=[80,80,80];
let canvas_eff_background=[250,250,250];

//Attivare preload e impostare il numero di cicli del disegno live
let preloadActive=false; //attivare la barra di preload. il tempo di preload va sempre da 0 a 100
let time_draw_end=30000000; //IMPOSTARE I CICLI DI DISEGNO LIVE

//***FINE PARAMETRI CANVAS
//CANVAS EFFETTIVO e CANVAS VISUALIZZATO
//il Canvas effettivo è quello della dimensione effettiva dell'immagine
//il Canvas visualizzato corrisponde alla dimensione effettiva del frame a disposizione
//se canvas_dinamico=false il canvas visualizzato è uguale a quello effettivo
let canvas_effettivo;
let canvas_visualizzato;

//differenza x,y da utilizzare per centrare il canvas effettivo
let diff_x=0, diff_y=0, scale_val=1;

//tempo preload
let time_preload=0; //il tempo di preload va sempre da 0 a 100
let time_draw=0;

//******VARIABILI
//COLORI
let colorRed=[220,0,0,220];
let colorWhite=[255,255,255];
let colorBlack=[0,0,0];
let colorGrey=[100,100,100];


//IL SEED VIENE SETTATO IN INDEX.HTML


//FUNZIONE CHE RESTITUISCE UN VALORE RANDOMICO HASH RIPORTANDOLO NELL' INTERVALLO DI VALORI INIZIO FINE
//RESTITUISCE UN VALORE RANDOMICO CONTINUO NELL'INTERVALLO
function randomHash(inizio,fine)
{
    diff=fine-inizio;
    return inizio+randomDec()*diff;
}

//Funzione che restituisce un valore decimale tra 0 e 1
function randomDec() 
{ 
  return random();
}

//Funzione che restiuscie un elemento dell'array in modo casuale
//utile per la scelta di parametri casuali con distribuzione omogena delle probabilità come palette di colori 
//o array con molti elementi
function randomHashArray(arr) 
{ 
  return arr[Math.floor(randomDec() * arr.length)] 
}

//Funzione che prende in input un array di array. il primo elemento sel sottoarray è la probabilità con cui può essere 
//scelto il valore di quel sottoarray
function radomProbArray(arr)
{ 
  let ndec=randomDec();
  let tprob=0;
  for(let i=0;i<arr.length;i++)
  {  
      tprob=tprob+arr[i][0];
      if(tprob>ndec)
        return arr[i][1];
  }
  return null;
}

//FUNZIONE CHE RESTITUISCE UN VALORE RANDOMICO DISCRETO NELL' INTERVALLO DI VALORI INIZIO FINE
//ES: randomHashCoef(10,20, 1) restituisce i valori 10,11,12,13...20
//ES: randomHashCoef(100,200, 0.1) restituisce i valori 10.1,10.2,10.3,10.4...20
function randomHashCoef(inizio,fine, x = 1) 
{ 
    return Math.floor(randomDec() * (fine - inizio + 1) + inizio) * x;
}

//FUNZIONE CHE RESTITUISCE UN VALORE RANDOMICO BOOLEANO, VERO O FALSO
function randomBoolean()
{
    if(randomDec()<0.5)
      return true;
    else
      return false;
}

function setup(){
  //angleMode(RADIANS);

  //CREA IL CANVAS IN MODO DINAMICO
  setup_canvas(); 
  //canvas_visualizzato.parent('canvas'); //DA RIATTIVARE CON USO PAGINA INDEX2
  
  let seed= 12345;
  //console.log(dedacode_hashkey)
  //console.log(seed)
  
  randomSeed(seed);
  noiseSeed(seed)

  //randomSetup();


}

//IL SEED VIENE SETTATO IN INDEX.HTML


//FUNZIONE CHE RESTITUISCE UN VALORE RANDOMICO HASH RIPORTANDOLO NELL' INTERVALLO DI VALORI INIZIO FINE
//RESTITUISCE UN VALORE RANDOMICO CONTINUO NELL'INTERVALLO
function randomHash(inizio,fine)
{
    diff=fine-inizio;
    return inizio+randomDec()*diff;
}

//Funzione che restituisce un valore decimale tra 0 e 1
function randomDec() 
{ 
  return random();
}

//Funzione che restiuscie un elemento dell'array in modo casuale
//utile per la scelta di parametri casuali con distribuzione omogena delle probabilità come palette di colori 
//o array con molti elementi
function randomHashArray(arr) 
{ 
  return arr[Math.floor(randomDec() * arr.length)] 
}

//Funzione che prende in input un array di array. il primo elemento sel sottoarray è la probabilità con cui può essere 
//scelto il valore di quel sottoarray
function radomProbArray(arr)
{ 
  let ndec=randomDec();
  let tprob=0;
  for(let i=0;i<arr.length;i++)
  {  
      tprob=tprob+arr[i][0];
      if(tprob>ndec)
        return arr[i][1];
  }
  return null;
}

//FUNZIONE CHE RESTITUISCE UN VALORE RANDOMICO DISCRETO NELL' INTERVALLO DI VALORI INIZIO FINE
//ES: randomHashCoef(10,20, 1) restituisce i valori 10,11,12,13...20
//ES: randomHashCoef(100,200, 0.1) restituisce i valori 10.1,10.2,10.3,10.4...20
function randomHashCoef(inizio,fine, x = 1) 
{ 
    return Math.floor(randomDec() * (fine - inizio + 1) + inizio) * x;
}

//FUNZIONE CHE RESTITUISCE UN VALORE RANDOMICO BOOLEANO, VERO O FALSO
function randomBoolean()
{
    if(randomDec()<0.5)
      return true;
    else
      return false;
}

function draw(){
  //SETUP CANVAS DINAMICO

  
  
  draw_setup_canvas(); 
  
  
  //BARRA DI PRELOAD
  if(preloadActive)
    if(time_preload<=100)
    {
      clear();
      preload_canvas(canvas_effettivo)
      draw_barra_caricamento(this,w/2-(w/4),h/2,w/2,h/10,10,colorWhite,canvas_background,time_preload);
    }
  
  //PULISCE LO SCHERMO DOPO LA BARRA DI PRELOAD
  if((time_preload==101)&&(preloadActive))
  {
    clear();
    background(canvas_background);
  }
  

  
  //DISEGNO EFFETTIVO LIVE
  if(((time_preload>100)&&(time_draw<time_draw_end))||(!preloadActive))
  {  
    
    draw_scene(canvas_effettivo)
    //VISUALIZZA CANVAS EFFETTIVO IN CANVAS VISUALIZZATO
    image(canvas_effettivo,0,0)
  
  }
  
  //ARRIVATI AL TEMPO MASSIMO DI DISEGNO LIVE IMPOSTA noLoop()
  if(time_draw>=time_draw_end)
  { 
    noLoop();
    
  }
  
}

//funzione da richiamare all'inizio di setup() per istanziare canvas effettivo e visualizzato
function setup_canvas()
{
   if(canvas_dinamico)
   {
      canvas_visualizzato=createCanvas(windowWidth, windowHeight);
     
      proporzione_effettivo=w/h;
      proporzione_visualizzato=windowWidth/windowHeight;
     
      //SE PROPORZIONE EFFETTIVO >1 SIGNIFICA CHE L'IMMAGINE DI PARTENZA HA UN FORMATO ORIZZONTALE
      let v_flag_oriz=true
      
      if(proporzione_effettivo<1)
        v_flag_oriz=false;
     
      //Se l'immagine iniziale è orizzontale ma la proporzione della finestra di visualizzazione è ancora piu' orizzontale come proporzione allora utilizza il lato verticale per proporzionare
      if((proporzione_effettivo<proporzione_visualizzato)&&(proporzione_effettivo>=1))
        v_flag_oriz=false;
     
      //se l'immagine iniziale è verticale ma la proporzione della finestra di visualizzazione è ancora piu' verticale come proporzione allora utilizza il lato orizzontale per proporzionare
      if((proporzione_effettivo>=proporzione_visualizzato)&&(proporzione_effettivo<1))
        v_flag_oriz=true;
     
      if(v_flag_oriz)
      {
        scale_val=windowWidth/w;
        diff_x=0;
        diff_y=(windowHeight-(h*scale_val))/2;
      }
      else
      {
        scale_val=windowHeight/h;
        diff_x=(windowWidth-(w*scale_val))/2;
        diff_y=0;
      }
      canvas_effettivo = createGraphics(w, h);
     
      background(canvas_background);
   }
   else
   {
     canvas_visualizzato=createCanvas(w, h);
     canvas_effettivo = createGraphics(w, h);
   }
}

//funzione da richiamare all'inizio di draw per effettuare il setup
function draw_setup_canvas()
{
    if(canvas_dinamico)
    {
      translate(diff_x,diff_y);
      scale(scale_val);
    }
}

//funzione per estire salvataggio file dimensioni effettive PNG
function keyPressed() {
  if (key == 's') {
      //saveCanvas(canvas_effettivo, '_deadcode_'+name_file+'.png');
    saveCanvas(canvas_effettivo, '_Lustri_'+dedacode_hashkey+'.png');
    
  }
}

//Funzione di preload. Calcola e prepara eventuali oggetti e strutture e/o disegna alcuni livelli grafici
function preload_canvas(panel)
{
     //INSERISCI QUI LE FUNZIONI DI PRELOAD PASSANDO IL TEMPO CHE DEVE ESSERE AVANZATO AD OGNI AZIONE O GRUPPO DI AZIONI
    //***INIZIO***
    //drawMainTest_001(panel,time_preload);
    //***FINE***
  
    time_preload++;
}


function draw_scene(panel)
{ 
  //if(time_draw==0)
    //panel.background(canvas_eff_background);
  //INSERISCI QUI LE FUNZIONI DI PRELOAD PASSANDO IL TEMPO CHE DEVE ESSERE AVANZATO AD OGNI AZIONE O GRUPPO DI AZIONI
  //***INIZIO***
  drawMainTest_002(panel,time_draw);
  //***FINE***
  time_draw++;
  

}

//Funzione che disegna la barra di caricamento iniziale da usare nel preload
function draw_barra_caricamento(panel,x,y,lunghezza,larghezza,spessore,c1,c2,p_time)
{
   //Disegna contorno esterno della barra
   panel.background(c2);
   panel.noFill();
   panel.stroke(c1)
   panel.strokeWeight(spessore)
   panel.rect(x, y, lunghezza, larghezza, 20);
  
   //Disegna riempimento interno della barra
   panel.fill(c1);
   panel.stroke(c2);
   rap_x=(lunghezza-(spessore*2))/lunghezza;
   let lunghezza_int=(p_time/100)*lunghezza*rap_x;
   d_y=(larghezza-(larghezza*0.9))/2
   panel.rect(x+spessore, y+d_y, lunghezza_int, larghezza*0.9, 20);
  
}

//EFFETTO CARTA 1 - effetto "grana" formato da un disturbo perlin noise complesso che permette di creare un effetto carta naturale con grana dei rilievi del foglio
function drawEffettoCarta01(panel,p1,h1,w1,c1,
                            p_grana,
                            p_intensita,
                            p_riempimento)
{
    let p_r=red(c1);
    let p_g=green(c1);
    let p_b=blue(c1);

    let panel3=createGraphics(w/2, h/2);
    panel3.loadPixels();
  
    /*
    let p_grana=0.4; //tra 0 e 1. 0=grana larga 1=grana fine
    let p_intensita=0.1; //tra 0 e 1. 0=poco intenso 1=massima intensita
    let p_riempimento=0.7; //tea 0 e 1. 0=poco pieno(molti spazi vuoti) 1=pieno
    */
  
    let scale1=0.70756756;
    let scale2=0.071013+p_grana/2;
    let scale3=0.10467+p_grana;
    let scale4=0.6301312;

  
    for (let x = p1.x; x < w/2; x += 1) {
      let randomOffset_x=randomHash(0,10000);
      let randomOffset_y=randomHash(0,10000);
      for (let y = p1.y; y < h/2; y += 1) {


        let num_livelli=12;
        let delta_tot=(50/num_livelli)*p_intensita;

        //MIX DI 4 noise per rendere il pattern meno ripetitivo
        let noise1=noise(x*scale1,y*scale1*0.56,x*0.01);
        let noise2=noise(x*scale2*0.51,y*scale2*0.97,x*0.01);

        //noise 3 e noise 4 hanno un offset casuale per rendere meno ripetitivo il pattern
        let noise3=noise((randomOffset_x+x)*scale3,
                               (randomOffset_y+y)*scale3*0.95);
        let noise4=noise((randomOffset_x+x)*scale4,
                         (randomOffset_y+y)*scale4*scale3*0.99);

        //calcola il noise combinato dei 4 pattern
        let combined_noise=(noise1+noise2+noise3+noise4)/4;

        let factor=1/num_livelli;
        let p_livello=int(combined_noise/factor);
        let p_value=p_livello*delta_tot;

        if(combined_noise>(0.55-(0.20*p_riempimento)))
        panel3.set(x, 
                   y, [p_r,p_g,p_b,5+(10*p_intensita)+p_value]);
      }
  }
  
    panel3.updatePixels();
    panel.image(panel3,0,0,w,h)
  
}

//EFFETTO CARTA 2 - effetto "reticolo" formato da diverse righe curve e dritte sovrapposte
//se con basso riempimento forma un reticolo o delle righe che spezzano
function drawEffettoCarta02(panel,p1,h1,w1,c1,
                            p_grana,
                            p_intensita,
                            p_riempimento)
{
    let p_r=red(c1);
    let p_g=green(c1);
    let p_b=blue(c1);
  
    let p_dim_tratto=10*p_grana;
    let p_intensita_tratto=50*p_intensita;
    let p_factor_riemp=15*p_riempimento;

    let padfactor = w1*2;
    let tot = h1*p_factor_riemp;
  
    for (let k=0; k<tot;k++){

      panel.push()
      
      panel.strokeWeight(randomHash(1,p_dim_tratto))
      panel.stroke(p_r, p_g, p_b, randomHash(1, p_intensita_tratto))
      panel.noFill()
      panel.bezier(
        p1.x+randomHash(-padfactor, w1 + padfactor),
        p1.y+randomHash(-padfactor, h1 + padfactor),
        p1.x+randomHash(-padfactor, w1 + padfactor),
        p1.y+randomHash(-padfactor, h1 + padfactor),
        p1.x+randomHash(-padfactor, w1 + padfactor),
        p1.y+randomHash(-padfactor, h1 + padfactor),
        p1.x+randomHash(-padfactor, w1 + padfactor),
        p1.y+randomHash(-padfactor, h1 + padfactor)
      );
      
      panel.pop();
    }
    
}

//EFFETTO CARTA 3 - effetto "sporcizia" e imperfezioni per simulare carta riciclata
function drawEffettoCarta03(panel,p1,h1,w1,c1,
                            p_grana,
                            p_intensita,
                            p_riempimento)
{
    let p_r=red(c1);
    let p_g=green(c1);
    let p_b=blue(c1);

    let panel3=createGraphics(w/2, h/2);
    panel3.loadPixels();
    
  
    let scale1=0.01256756+(p_grana*0.1)/2;
    let scale2=0.0071013+(p_grana*0.1);
        
    let scale3=0.200467;
    let scale4=0.73301312;
  
    for (let x = p1.x; x < w/2; x += 1) {
      for (let y = p1.y; y < h/2; y += 1) {

        let num_livelli=18;
        let delta_tot=(120/num_livelli)*p_intensita;
        
        let randomOffset_x=0//noise(x*scale3,y*scale3)*100;
        let randomOffset_y=0 //noise(x*scale4,y*scale4)*100;

        //MIX DI 4 noise per rendere il pattern meno ripetitivo
        let noise1=noise((randomOffset_x+x)*scale1,
                         (randomOffset_y+y)*scale1,x*0.001);
        let noise2=noise(x*scale2,y*scale2,y*0.001);

        //noise 3 e noise 4 hanno un offset casuale per rendere meno ripetitivo il pattern
        let noise3=noise((randomOffset_x+x)*scale3,
                               (randomOffset_y+y)*scale3*0.98);
        let noise4=noise((randomOffset_x+x)*scale4,
                         (randomOffset_y+y)*scale4*scale3*0.99);

        //calcola il noise combinato dei 4 pattern
        let combined_noise=(noise1+noise2)/2;

        let factor=1/num_livelli;
        let p_livello=int(combined_noise/factor);
        let p_value=p_livello*delta_tot;

        if(combined_noise>  (0.65-(0.10*p_riempimento)))
          panel3.set(x, 
                   y, [p_r,p_g,p_b,100*p_intensita]);
        

      }
  }
  
    panel3.updatePixels();
    
    panel.image(panel3,0,0,w,h)
  
}

//EFFETTO CARTA 4 - effetto "gesso". Effetto muro di getto con reticolo
function drawEffettoCarta04(panel,p1,h1,w1,c1,
                            p_grana,
                            p_intensita,
                            p_riempimento)
{
    let p_r=red(c1);
    let p_g=green(c1);
    let p_b=blue(c1);

    let panel3=createGraphics(w/2, h/2);
    panel3.loadPixels();
  
    let grana_xy=map(p_grana,0,1,0.03,0.2)
  
    //let scale1=0.00056756;
    //let scale2=0.0081013;
    let scale1=randomHash(0.0005,0.009);
    let scale2=randomHash(0.001,0.004);
        
    let scale3=0.200467;
    let scale4=0.73301312;
  
    for (let x = p1.x; x < w/2; x += 1) {
      for (let y = p1.y; y < h/2; y += 1) {

        let num_livelli=14;
        let delta_tot=(120/num_livelli)*p_intensita;
        
        let randomOffset_x=0//noise(x*scale3,y*scale3)*100;
        let randomOffset_y=0 //noise(x*scale4,y*scale4)*100;

        //MIX DI 4 noise per rendere il pattern meno ripetitivo
        let noise1=noise((randomOffset_x+x)*scale1,
                         (randomOffset_y+y)*scale1,x*grana_xy);
        let noise2=noise(x*scale2,y*scale2,y*grana_xy);

        //noise 3 e noise 4 hanno un offset casuale per rendere meno ripetitivo il pattern
        let noise3=noise((randomOffset_x+x)*scale3,
                               (randomOffset_y+y)*scale3*0.98);
        let noise4=noise((randomOffset_x+x)*scale4,
                         (randomOffset_y+y)*scale4*scale3*0.99);

        //calcola il noise combinato dei 4 pattern
        let combined_noise=(noise1+noise2)/2;

        let factor=1/num_livelli;
        let p_livello=int(combined_noise/factor);
        let p_value=p_livello*delta_tot;

        if(combined_noise>  (0.65-(0.20*p_riempimento)))
          panel3.set(x, 
                   y, [p_r,p_g,p_b,100*p_intensita]);
        

      }
  }
  
    panel3.updatePixels();
    panel.image(panel3,0,0,w,h)
  
}

//RIGA EFFETTO SPAGO
function drawRigaPoint(coord1, //COORDINATA PUNTO 1 
                        coord2, //COORDINATA PUNTO 2
                        densita, //DENSITA PUNTI RETTA (VALORE)
                        dim_minima, //DIMENSIONE MINIMA DEI PUNTI
                        dim_massima, //DIMENSIONE MASSIMA DEI PUNTI
                        rand_factor, //FATTORE RANDOM (INDICA DISTANZA MASSIMA DEI PUNTI RISPETTO ALLA RETTA TEORICA TRA COORD 1 e COORD 2. se impostato a zero significa nessun effetto randomico e tutti i punti sono allineati)
                        panel
                       )
{
  distXY=calcDistPunti(coord1.x,coord1.y,coord2.x,coord2.y);
  
  num_punti=distXY*densita;
  passoXY=distXY/num_punti;
  
  
  coordPoint=new VarCoord(0,0);
  for(let i=0;i<num_punti;i++)
  {
    calcPuntoRetta(coord1.x,coord1.y,coord2.x,coord2.y,passoXY*i,
                   coordPoint);
    panel.strokeWeight(randomHash(dim_minima,dim_massima))
    panel.point(coordPoint.x+randomHash(0,rand_factor),
          coordPoint.y+randomHash(0,rand_factor));
  }
  
}

//disegna riga spago con due colori
function drawRigaElementP(coord1,coord2,c1,c2,dim,panel)
{
  panel.stroke(c1)
  
  drawRigaPoint(coord1,coord2,0.4,dim*0.7,dim,1,panel);
  panel.strokeWeight(dim*1.3)
  panel.point(coord1.x,coord1.y)
  panel.point(coord2.x,coord2.y)
  panel.stroke(c2)
   drawRigaPoint(coord1,coord2,0.4,dim*0.25,dim*0.45,0,panel);
}

//Versione del 04/02/2024 

//FUNZIONE PER DEFINIRE LA STRUTTURA COORDINATE E MEMORIZZARE X e Y IN UNA SOLA VARIABILE
function makeStruct(names) {
  var names = names.split(' ');
  var count = names.length;
  function constructor() {
    for (var i = 0; i < count; i++) {
      this[names[i]] = arguments[i];
    }
  }
  return constructor;
}
let VarCoord = makeStruct("x y"); 
let VarCircle = makeStruct("x y r"); 

//CALCOLA DISTANZA TRA DUE PUNTI con Coordinate esplicite
function calcDistPunti(x1,y1,x2,y2)
{
    return sqrt(pow(x2-x1,2)+pow(y2-y1,2));
}

//CALCOLA DISTANZA TRA DUE PUNTI
function calcDistPuntiCoord(c1,c2)
{
    return abs(sqrt(pow(c2.x-c1.x,2)+pow(c2.y-c1.y,2)));
}

//TROVA PUNTI PARALLELI O PERPENDICOLARI AD UNA RETTA IN BASE ALL'ANGOLO
function findPoints(c1,c2, dist,angle)
{
    v1= createVector(c1.x,c1.y);
    v2= createVector(c2.x,c2.y);
    
    v3=p5.Vector.sub(v1, v2);
    angle_h = v3.heading();
    LX = dist*cos(angle_h+angle);  LY = dist*sin(angle_h+angle);
    RX = dist*cos(angle_h-angle);  RY = dist*sin(angle_h-angle);
  
    let output_c=[];
  
    output_c[0]=new VarCoord(v1.x+LX+cos(angle_h),v1.y+LY+sin(angle_h));
 
    output_c[1]=new VarCoord(v2.x+LX+cos(angle_h),v2.y+LY+sin(angle_h));
  
  return output_c;
  
}

//FUNZIONE PER CALCOLARE L'ANGOLO DELLE RETTA TRA DUE PUNTI
function calcolaAngolo(coord1, coord2) {
  const deltaX = coord2.x - coord1.x;
  const deltaY = coord2.y - coord1.y;
  
  // Calcolo dell'angolo in gradi utilizzando la funzione atan2()
  const angle = atan2(deltaY, deltaX);
  
  return angle;
}


//TROVA PUNTI PARALLELI O PERPENDICOLARI IN BASE ALL'ANGOLO
function findPointsRetta(c1, dist,angle)
{
    v1= createVector(c1.x,c1.y);
    LX = dist*cos(angle);  LY = dist*sin(angle);
  
    let output_c=new VarCoord(v1.x+LX+cos(angle),v1.y+LY+sin(angle));
  
  return output_c;
  
}

//CALCOLA I PUNTI SU UNA RETTA AD UNA CERTA DISTANZA DAL PUNTO c1.x,c1.y
function calcPuntoRettaCoord(c1,c2,
                             dist //DISTANZA-RAGGIO DAL PUNTO DI RIFERIMENTO x1,y1
    )
{
  angle=calcolaAngolo(c1,c2);
  return findPointsRetta(c1, dist,angle)
}


//CALCOLA I PUNTI SU UNA RETTA AD UNA CERTA DISTANZA DAL PUNTO X1,y1
function calcPuntoRetta(x1,y1,x2,y2,
                        dist, //DISTANZA-RAGGIO DAL PUNTO DI RIFERIMENTO x1,y1
                        coord //COORDINATE PUNTO DISTANTE DA x1,Y1
    )
{
    let m;
    let q;
    let segno=1;
    x1=Math.trunc(x1);
    y1=Math.trunc(y1);
    x2=Math.trunc(x2);
    y2=Math.trunc(y2);
    
    if((x2<=x1)&&(y2<=y1))
  segno=-1;

        if(y1==y2)
        {
            coord.x=x1+dist*segno;
            coord.y=y1;
        }
        else
        {
            if(x1!=x2)
            {
                  m=(y1-y2)/(x1-x2);
                  q=((x2*y1)-(x1*y2))/(x2-x1);
              
                  if((m<0)&&(y1<y2))
                    segno=-1;

                  coord.x=((x1*sqrt(1+pow(m,2)))+dist*segno)/(sqrt(1+pow(m,2)));
                  coord.y=m*coord.x+q;

            }
            else
            {
                coord.x=x1;
                coord.y=y1+dist*segno;
            }
    }

}

//Restituisce TRUE se la coordinata x,y è contenuta nel poligono
function pointInside(x,y,vertici){
  
  var risp=false;
  var p=0;
  for(var k=0;k<vertici.length;k++)
  {
    if(p<vertici.length-1)
      p++;
    else 
      p=0;
    
     f_valuta=((vertici[p].x-vertici[k].x)*(y-vertici[k].y)/(vertici[p].y-vertici[k].y))+vertici[k].x;
    
    if((vertici[k].y>=y && vertici[p].y<y|| vertici[k].y<y && vertici[p].y>=y)) 
       if(x<f_valuta)
          risp=!risp;
  }
  return risp;

}

//Funzione che calcola la distanza agolare tra due angoli
function distAngolare(angolo1, angolo2)
{
    let distanza = Math.abs(angolo1 - angolo2);
    if(distanza>PI)
      distanza=TWO_PI-distanza;
  
    return distanza;
}




//Funzione utile nell'uso degli array. Restituisce il valore se compreso tra r1 e r2, altrimenti prende r1 o r2
function insideRange(value,r1,r2)
{ 
    if(value<r1)
      return r1;
    if(value>r2)
      return r2;
  
    return value;
}  

//FUNZIONE CHE CALCOLA IL PUNTO DI INTERESEZIONE DI DUE RETTE
function intersect_point(point1, point2, point3, point4) 
{
   let ua = ((point4.x - point3.x) * (point1.y - point3.y) - 
             (point4.y - point3.y) * (point1.x - point3.x)) /
            ((point4.y - point3.y) * (point2.x - point1.x) - 
             (point4.x - point3.x) * (point2.y - point1.y));
  
   let ub = ((point2.x - point1.x) * (point1.y - point3.y) - 
             (point2.y - point1.y) * (point1.x - point3.x)) /
            ((point4.y - point3.y) * (point2.x - point1.x) - 
             (point4.x - point3.x) * (point2.y - point1.y));
  
   let x = point1.x + ua * (point2.x - point1.x);
   let y = point1.y + ua * (point2.y - point1.y);
  
   let out=new VarCoord(x,y)
   return out;
}

//TROVA IL PUNTO ALL'INTERNO DEL QUADRIALTERO USANDO x e y PERCENTUALE 
function calcCoordMatrix(p1,p2,p3,p4,px_perc,py_perc) 
{
    let dist_p1p2=calcDistPuntiCoord(p1,p2);
    let point_p1p2=calcPuntoRettaCoord(p1,p2,dist_p1p2*px_perc);
  
    let dist_p3p4=calcDistPuntiCoord(p4,p3);
    let point_p3p4=calcPuntoRettaCoord(p4,p3,dist_p3p4*px_perc);
  
    let dist_p2p3=calcDistPuntiCoord(p2,p3);
    let point_p2p3=calcPuntoRettaCoord(p2,p3,dist_p2p3*py_perc);

    let dist_p4p1=calcDistPuntiCoord(p1,p4);
    let point_p4p1=calcPuntoRettaCoord(p1,p4,dist_p4p1*py_perc);

    return intersect_point(point_p1p2,point_p3p4,point_p2p3,point_p4p1);
}

//calcola un numero che rappresenza la dimensione del quadilatero
//da usare per proporzionare quello che ci sta dentro
function calCoefDim(p1,p2,p3,p4)
{
   let dist_p1p3=calcDistPuntiCoord(p1,p3);
   let dist_p2p4=calcDistPuntiCoord(p2,p4);
  
   return dist_p1p3+dist_p2p4/2;
}  

function addCoord(p1,add_x,add_y)
{
    p1.x=p1.x+add_x;
    p1.y=p1.y+add_y;
}   
function calcPointsInside(p1,p2,p3,p4,p_perc)
{
  let oArray=[];
  oArray[0]=calcCoordMatrix(p1,p2,p3,p4,p_perc,p_perc);
  oArray[1]=calcCoordMatrix(p1,p2,p3,p4,1-p_perc,p_perc);
  oArray[2]=calcCoordMatrix(p1,p2,p3,p4,1-p_perc,1-p_perc);
  oArray[3]=calcCoordMatrix(p1,p2,p3,p4,p_perc,1-p_perc);
  
  return oArray;
}

//INDICA SE LE COORDINATE x,Y CADONO DENTRO UNO DEI CERCHI DELLA LISTA IN INPUT
function findCircleIntersect(list,x,y)
{
  let f_inter=false;
  for(let k=0;k<list.length;k++)
  {
      //calcola distanza di x,y rispetto a centro del cerchio
      let c_dist=calcDistPunti(list[k].x,list[k].y,x,y)
      if(c_dist<list[k].r)
          return f_inter=true;
  }
  
  return f_inter;
}




function calcPuntParalleli(x1,y1,x2,y2,
                        dist //DISTANZA-RAGGIO DAL PUNTO DI RIFERIMENTO               
    )
{
    let m,m_i;
    let q,q_i;
    let x,y;
    let segno;
    let coord=[]; //ARRAY OUTPUT
  
    x1=Math.trunc(x1);
    y1=Math.trunc(y1);
    x2=Math.trunc(x2);
    y2=Math.trunc(y2);

    coord[0]=new VarCoord(0,0);
    coord[1]=new VarCoord(0,0);
    coord[2]=new VarCoord(0,0);
    coord[3]=new VarCoord(0,0);
  
        x=x1;
        y=y1;
        segno=1;
  
        if(x1>x2)
            segno=-segno;

        //if(y1>y2)
          //  segno=-segno;

        if(x1!=x2)
        {
            m=(y1-y2)/(x1-x2);
            //q=y1-((y1-y2)/(x1-x2)*x1);
            q=((x2*y1)-(x1*y2))/(x2-x1);

            //CALCOLA IL VALORE DEL PUNTO MASSIMO CHE FUORIESCE DALLA LINEA IN BASE ALLO SPESSORE
            x=((x*sqrt(1+pow(m,2)))-segno*dist)/(sqrt(1+pow(m,2)));
            y=m*x+q

            //RETTA PERPENDICOLARE CHE PASSA PER IL PUNTO DI RIFERIMENTO( IN BASE AL TYPE)
            m_i=-1/m;
            q_i=y-(m_i*x);


            coord[0].x=((x*sqrt(1+pow(m_i,2)))-dist)/(sqrt(1+pow(m_i,2)));
            coord[0].y=m_i*coord[0].x+q_i;

            coord[1].x=((x*sqrt(1+pow(m_i,2)))+dist)/(sqrt(1+pow(m_i,2)));
            coord[1].y=m_i*coord[1].x+q_i;

        }
        
        //GESTISCI LINEE PERFETTAMENTE ORIZZONTALI E VERTICALI
        x=x1;
        y=y1;
        //PER LINEA ORIZZONTALE
        if((y1==y2)||(abs(y1-y2)<1))
        {

            coord[0].x=x-segno*dist;
            coord[0].y=y+dist;

            coord[1].x=x-segno*dist;
            coord[1].y=y-dist;

        }

        //PER LINEA VERTICALE
        if(x1==x2)
        {
          if(y1>y2)
            segno=-segno;
          coord[0].x=x+dist;
          coord[0].y=y-segno*dist;

          coord[1].x=x-dist;
          coord[1].y=y-segno*dist;
        }

        x=x2;
        y=y2;
        segno=-1;
  
        if(x1>x2)
            segno=-segno;
  
         //if(y1>y2)
           // segno=-segno;

        if(x1!=x2)
        {
            m=(y1-y2)/(x1-x2);
            //q=y1-((y1-y2)/(x1-x2)*x1);
            q=((x2*y1)-(x1*y2))/(x2-x1);

            //CALCOLA IL VALORE DEL PUNTO MASSIMO CHE FUORIESCE DALLA LINEA IN BASE ALLO SPESSORE
            x=((x*sqrt(1+pow(m,2)))-segno*dist)/(sqrt(1+pow(m,2)));
            y=m*x+q

            //RETTA PERPENDICOLARE CHE PASSA PER IL PUNTO DI RIFERIMENTO( IN BASE AL TYPE)
            m_i=-1/m;
            q_i=y-(m_i*x);


            coord[3].x=((x*sqrt(1+pow(m_i,2)))-dist)/(sqrt(1+pow(m_i,2)));
            coord[3].y=m_i*coord[3].x+q_i;

            coord[2].x=((x*sqrt(1+pow(m_i,2)))+dist)/(sqrt(1+pow(m_i,2)));
            coord[2].y=m_i*coord[2].x+q_i;

        }

        //GESTISCI LINEE PERFETTAMENTE ORIZZONTALI E VERTICALI
        x=x2;
        y=y2;
        //PER LINEA ORIZZONTALE
        if((y1==y2)||(abs(y1-y2)<1))
        {
            coord[3].x=x-segno*dist;
            coord[3].y=y+dist;

            coord[2].x=x-segno*dist;
            coord[2].y=y-dist;

        }
        //PER LINEA VERTICALE
        if(x1==x2)
        {
          coord[3].x=x+dist;
          coord[3].y=y-segno*dist;

          coord[2].x=x-dist;
          coord[2].y=y-segno*dist;
        }
  
      return coord;
  
}


