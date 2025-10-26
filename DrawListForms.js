//DRAW LIST FORMS
//31/03/2024

/*
  PER GESTIRE E DISEGNARE FORME CURVE PARTENDO DA LISTE - DRAW, CALC
  
  -drawPoly - Disegna poligono con bordi smussati/curvi o spigolosi a partire da lista di vertici
  
  -drawLine - Disegna linea spezzata e non chiusa (smussata o spigolosa) da partire da lista
  
  -drawPoints - Disegna punti a partire da lista

  -findPolygonRoundePoint - Restituisce nuova lista di valori con un maggior numero di punti che segue il perimetro della figura curva/smussata
  
  -calcDistListArray - Funzione che restituisce distanza complessiva della lista di coordinate
  
  -calcPointsCurve - Funzione che restituisce lista di coordinate che modellano la curva tra una lista di coordinate, lavora con un parametro di densita che determina la distanza dei punti sulla curva
  
  -calcPointsCurvePoint - Analogo alla funzione calcPointsCurve ma lavora su numero prefissato di segmenti come parametro di input
  
  -calcPuntiParalleli - prende in input un array di coordinate di una curva e restituisce un secondo array affiancato al primo e distanziato in base a distanza e anglo in input
  
  -calcPuntiParalleli_v2 - versione V2 prende in input un array di distanze e non una distanza fissa

  -calcArrayPuntiIntermedi - prende in input un array e restituisce un secondo array con il doppio di coordinate 
  
  -calcTraslaArray - prende in input un array e restituisce  un secondo array traslato (utile per lista ad anello/cerchio)
  
  -calcAddRandList - crea una nuova lista di coordinate aggiungendo random
  
  -calcShiftArrayRandom - funzione che prende in input un array e ne restituisce un secondo con i valori sfhiftati a partire da un punto casuale (es: 1,2,3,4,5 diventa 3,4,5,1,2) utile per figure a cerchio.
  

*/

//Funzione che disegna forma poligonale della lista di vertici ricevuti in input
//se f_curve = true allora i vertici sono smussati
function drawPoly(verticiPoly,f_curve,panel,f_fig)
{
  
    panel.beginShape();
    if(f_curve)
    {
      if(f_fig)
      {
        
        for(let k=0; k<verticiPoly.length;k++)
          panel.curveVertex(verticiPoly[k].x,verticiPoly[k].y);

        panel.endShape(CLOSE);   
      }
      else
      {
        panel.curveVertex(verticiPoly[verticiPoly.length-2].x,verticiPoly[verticiPoly.length-2].y);
        panel.curveVertex(verticiPoly[verticiPoly.length-1].x,verticiPoly[verticiPoly.length-1].y);
        for(let k=0; k<verticiPoly.length;k++)
          panel.curveVertex(verticiPoly[k].x,verticiPoly[k].y);
        panel.curveVertex(verticiPoly[0].x,verticiPoly[0].y);
        panel.endShape(); 
      }
    }
    else
    {
      for(let k=0; k<verticiPoly.length;k++)
        panel.vertex(verticiPoly[k].x,verticiPoly[k].y);
      
       panel.endShape(CLOSE);
    }

    
}

//drawLine - Disegna linea spezzata e non chiusa (smussata o spigolosa) da partire da lista
function drawLine(verticiPoly,f_curve,panel)
{
  
    if(verticiPoly.length>0)
     {
      panel.beginShape();
      if(f_curve)
      {
        panel.curveVertex(verticiPoly[0].x,verticiPoly[0].y);
        for(let k=0; k<verticiPoly.length;k++)
          panel.curveVertex(verticiPoly[k].x,verticiPoly[k].y);
        panel.curveVertex(verticiPoly[verticiPoly.length-1].x,
                          verticiPoly[verticiPoly.length-1].y);
        panel.endShape(OPEN);   
      }
      else
      {
        for(let k=0; k<verticiPoly.length;k++)
          panel.vertex(verticiPoly[k].x,verticiPoly[k].y);

         panel.endShape(OPEN);
      }
  }
    
}

//drawPoints - Disegna punti a partire da lista
function drawPoints(verticiPoly,panel)
{
      for(let k=0; k<verticiPoly.length;k++)
        panel.point(verticiPoly[k].x,verticiPoly[k].y)

}

//drawPoints - Disegna punti a partire da lista
function drawPointsDim(verticiPoly,panel,p_min_dim,p_max_dim)
{
      for(let k=0; k<verticiPoly.length;k++)
      {
        panel.strokeWeight(int(randomHash(p_min_dim,p_max_dim)));
        panel.point(verticiPoly[k].x,verticiPoly[k].y)
      }

}

//Funzione che restituisce una nuova lista di vertici partendo da elenco di vertici che rappresentano una figura poligonale
//smussata. Questa funzione è utile per tracciare i contorni e i bordi con tratti differenti rispetto a linee semplici
function findPolygonRoundePoint(verticiPoly,p_step,panel)
{
    let verticiPolyRet=[];
    let i=0;
    for(k=0; k<verticiPoly.length;k++)
    {
      
       for(let t=p_step; t<1; t=t+p_step)
        {
           let x = curvePoint(verticiPoly[k].x, verticiPoly[(k+1)%verticiPoly.length].x, 
                        verticiPoly[(k+2)%verticiPoly.length].x, verticiPoly[(k+3)%verticiPoly.length].x, t);
           let y = curvePoint(verticiPoly[k].y, verticiPoly[(k+1)%verticiPoly.length].y, 
                        verticiPoly[(k+2)%verticiPoly.length].y, verticiPoly[(k+3)%verticiPoly.length].y, t);
         verticiPolyRet[i]=createVector(x,y);
         i++;
        }
    }
   return verticiPolyRet;
}

//FUNZIONE che restituisce una array di coordinate della curva che passa 
//tra il punto p1 e il punto p2 con precedente punto di controllo p1c 
//e successivo punto di conttrollo p2c
//se p1=p1c e p2=p2c allora è una retta
//il parametro densita' gestisce la distanza tra le coordinate della curva
//densita=1 è il massimo valore di densità e significa che per ogni pixel sarà registrata una coordinata
function calcPointsCurveStep(p1c,p1,p2,p2c,p_densita,p_max_rand)
{ 
     let coord_output=[];
     let distp1p2=calcDistPuntiCoord(p1,p2)

     //Il passo dipende dalla densita
     let p_passo=distp1p2/(distp1p2*p_densita);
     let p_index=0;
  
     //ciclo in cui ci si sposta sulla curva per registrare x e y in base alla densita
       for(let i=0;i<distp1p2;i=i+p_passo)
       {
         let t= i / distp1p2;
         let x = curvePoint(p1c.x, p1.x, p2.x, p2c.x, t)
                +randomHash(-p_max_rand,p_max_rand);
         let y = curvePoint(p1c.y, p1.y,  p2.y, p2c.y, t)
                 +randomHash(-p_max_rand,p_max_rand);
         coord_output[p_index]=new VarCoord(x,y);
         p_index++;
       }
  
     return coord_output;
}

//FUNZIONE che restituisce un array di coordinate che modellano la curva passante per l'array di coordinate prese in input
//quindi dato array in input viene modellata la curva passante per quei punti e restituito un secondo array di coordinate con maggiore densità (in base al parametro) che modella una curva
function calcPointsCurve(list_v,p_densita,p_max_rand)
{
    let c_out=[];
    let c_out2;
    let n_punti=list_v.length;

    if(n_punti==2)
    {
        c_out=calcPointsCurveStep(list_v[0],list_v[0],list_v[1],list_v[1],
                            p_densita,p_max_rand);
    }
    if(n_punti==3)
    {
        c_out=calcPointsCurveStep(list_v[0],list_v[0],list_v[1],list_v[2],
                            p_densita,p_max_rand);
        c_out2=calcPointsCurveStep(list_v[0],list_v[1],list_v[2],list_v[2],
                            p_densita,p_max_rand);
      
        c_out= c_out.concat(c_out2);
    }
    if(n_punti>3)
    {
       
       c_out=calcPointsCurveStep(list_v[0],list_v[0],list_v[1],list_v[2],
                            p_densita,p_max_rand);
       for(let k=0;k<n_punti-3;k++)
       {
           c_out2=calcPointsCurveStep(list_v[k],list_v[k+1],
                                            list_v[k+2],list_v[k+3],
                            p_densita,p_max_rand);
           c_out= c_out.concat(c_out2);
       }
        c_out2=calcPointsCurveStep(list_v[n_punti-3],list_v[n_punti-2],
                                   list_v[n_punti-1],list_v[n_punti-1],
                            p_densita,p_max_rand);
        c_out= c_out.concat(c_out2);
      
   
     }
     
     return c_out;
  
}


function calcPointsCurveCircle(list_v,p_densita,p_max_rand)
{
    let c_out=[];
    let c_out2;
    let n_punti=list_v.length;

    {
       
       c_out=calcPointsCurveStep(list_v[n_punti-1],list_v[0],list_v[1],list_v[2],
                            p_densita,p_max_rand);
       for(let k=0;k<n_punti-3;k++)
       {
           c_out2=calcPointsCurveStep(list_v[k],list_v[k+1],
                                            list_v[k+2],list_v[k+3],
                            p_densita,p_max_rand);
           c_out= c_out.concat(c_out2);
       }
        c_out2=calcPointsCurveStep(list_v[n_punti-3],list_v[n_punti-2],
                                   list_v[n_punti-1],list_v[0],
                            p_densita,p_max_rand);
        c_out= c_out.concat(c_out2);
      
       c_out2=calcPointsCurveStep(list_v[n_punti-2],list_v[n_punti-1],
                                   list_v[0],list_v[1],
                            p_densita,p_max_rand);
      
      c_out= c_out.concat(c_out2);
   
     }
     
     return c_out;
  
}

//FUNZIONE CHE RESTITUISCE DISTANZA COMPLESSIVA DELLA LISTA DI COORDINATE
function calcDistListArray(list_v)
{
    let total_dist=0;
    for(let k=0;k<list_v.length-1;k++)
      total_dist=total_dist+calcDistPuntiCoord(list_v[k],list_v[k+1]);
  
    return total_dist;
}

//FUNZIONE analoga a calcPointsCurve ma che permette di lavorare con una dimensione/distanza predefinita
function calcPointsCurveStepDist(p1c,p1,p2,p2c,p_dist_step, p_start_step,p_max_rand)
{ 
     let coord_output=[];
     let distp1p2=calcDistPuntiCoord(p1,p2)

     //Il passo dipende dalla densita
     let p_passo=int(distp1p2/p_dist_step);
     let p_index=0;
  
     let p_resto,p_next;
     p_next=Math.abs(distp1p2-p_start_step);
     if((p_resto>=1)&&(p_next>distp1p2))
       return [[],p_resto]
  
     //ciclo in cui ci si sposta sulla curva per registrare x e y in base alla densita
       for(let i=p_start_step;i<=distp1p2;i=i+p_dist_step)
       {
         let t= i / distp1p2;
         let x = curvePoint(p1c.x, p1.x, p2.x, p2c.x, t)
                +randomHash(-p_max_rand,p_max_rand);
         let y = curvePoint(p1c.y, p1.y,  p2.y, p2c.y, t)
                 +randomHash(-p_max_rand,p_max_rand);
         coord_output[p_index]=new VarCoord(x,y);
         p_index++;
       }
  
     p_resto=((distp1p2-p_start_step)-((p_index-1)*p_dist_step));
     p_next=(p_dist_step-p_resto);
     return [coord_output,p_next];
}

//FUNZIONE analoga a calcPointsCurve ma che permette di suddividere la curva in un numero predefinito di segmenti/tratti
function calcPointsCurvePoint(list_v,p_num_points,p_max_rand)
{
    let c_out=[];
    let n_punti=list_v.length;
  
    let distTot=calcDistListArray(list_v);
    let passo=int(distTot/p_num_points);

     //c_out[0]=list_v[0]

    if(n_punti==2)
    {
        let c_out_c=calcPointsCurveStepDist(list_v[0],list_v[0],list_v[1],list_v[1],
                            passo,0,p_max_rand);
        c_out=c_out_c[0];
    }
    if(n_punti==3)
    {
    
        let c_out_c=calcPointsCurveStepDist(list_v[0],list_v[0],list_v[1],list_v[2],
                            passo,0,p_max_rand);
      
        c_out= c_out.concat(c_out_c[0]);
      
        let c_out_c2=calcPointsCurveStepDist(list_v[0],list_v[1],list_v[2],list_v[2],
                            passo,c_out_c[1],p_max_rand);

      c_out= c_out.concat(c_out_c2[0]);

    }
  
    if(n_punti>3)
    {

       let c_out_c=calcPointsCurveStepDist(list_v[0],list_v[0],list_v[1],list_v[2],
                            passo,0,p_max_rand);
       let p_next=c_out_c[1];
       c_out= c_out.concat(c_out_c[0]);
      
      
       for(let k=0;k<n_punti-3;k++)
       {
           c_out_c=calcPointsCurveStepDist(list_v[k],list_v[k+1],
                                            list_v[k+2],list_v[k+3],
                            passo,p_next,p_max_rand);
         
           p_next=c_out_c[1];
           c_out= c_out.concat(c_out_c[0]);
       }
        c_out_c=calcPointsCurveStepDist(list_v[n_punti-3],list_v[n_punti-2],
                                   list_v[n_punti-1],list_v[n_punti-1],
                            passo,p_next,p_max_rand);
         p_next=c_out_c[1];
         c_out= c_out.concat(c_out_c[0]);
      
   
     }
     
     return c_out;
  
}


//FUNZIONE che prende in input un array di una curva e restiuisce un secondo array
//che rappresenta una curva che si affiancherà alla prima in base alla distanza e all'angolo
function calcPuntiParalleli(list_v,dist_r,angle,p_max_rand)
{
   let out_c=[];
   let raggio=dist_r

   v12P=findPoints(list_v[0],list_v[1], raggio,angle)
   out_c[0]=v12P[0];
   k=0;
  
   out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
  
   let vPrec=v12P[1];
   for(let k=1; k<list_v.length-1; k++)
   {
       //calcola primo angolo rispetto alla retta vk vk-1
       vka1=calcolaAngolo(list_v[k], vPrec)
     
       vk_p=findPoints(list_v[k],list_v[k+1], raggio,angle)    
        //calcola angolo rispetto retta vk-vk+1
       vka2=calcolaAngolo(list_v[k], vk_p[0]);
      
       v2af=findPointsRetta(list_v[k], raggio,vka1+distAngolare(vka1,vka2)/2);
       out_c[k]=v2af;
       out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
       vPrec=vk_p[1];
   }

  out_c[list_v.length-1]=vPrec;
  k=list_v.length-1;
  out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
  
  return out_c;
  
}


//FUNZIONE che prende in input un array di una curva e restiuisce un secondo array
//che rappresenta una curva che si affiancherà alla prima in base alla distanza e all'angolo
//versione v2, prende in input array con distanza e non un valore fisso
function calcPuntiParalleli_v2(list_v,dist_r,v_dist_add,angle,p_max_rand)
{
   let out_c=[];

   v12P=findPoints(list_v[0],list_v[1], dist_r[0],angle)
   v12P_1=findPoints(list_v[0],list_v[1], dist_r[1],angle)
   out_c[0]=v12P[0];
    k=0;
   out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
  
   let vPrec=v12P;
   let vPrec_1=v12P_1;
   for(let k=1; k<list_v.length-1; k++)
   {
       //calcola primo angolo rispetto alla retta vk vk-1
       vka1=calcolaAngolo(list_v[k], vPrec[1])
     
       vk_p=findPoints(list_v[k],list_v[k+1], dist_r[k],angle)    
       vk_p_1=findPoints(list_v[k],list_v[k+1], dist_r[k+1],angle) 
        //calcola angolo rispetto retta vk-vk+1
       vka2=calcolaAngolo(list_v[k], vk_p[0]);
     /*
       v2af=findPointsRetta(list_v[k],
        dist_r[k]+v_dist_add,abs(subtractAngles(vka1,distAngolare(vka1,vka2)/2)));
     
       v2af=findPointsRetta(list_v[k],
                            dist_r[k]+v_dist_add,vka1+distAngolare(vka2,vka1)/2);
     */
            v2af=findPointsRetta(list_v[k],
                            dist_r[k]+v_dist_add,vka1);

         out_c[k]=v2af;

       vPrec=vk_p;
       vPrec_1=vk_p_1;
   }
 
  out_c[list_v.length-1]=vPrec;
  k=out_c.length-1;
  
  vk_p=findPoints(list_v[k-1],list_v[k], dist_r[k],angle)   
  out_c[k]=vk_p[1]

       out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
                           


  return out_c;
  
}



//FUNZIONE che prende in input un array di una curva e restiuisce un secondo array
//che rappresenta una curva che si affiancherà alla prima in base alla distanza e all'angolo
//versione v3, permette di shiftare i nodi centrali (no primo e ultimo) di un angolo ulteriore con anche un ulteriore angolo casuale
function calcPuntiParalleli_v3(list_v,dist_r,v_dist_add,
                                angle,p_max_rand,
                                p_angle_shift,p_angle_rand)
{
   let out_c=[];

   v12P=findPoints(list_v[0],list_v[1], dist_r[0],angle)
   v12P_1=findPoints(list_v[0],list_v[1], dist_r[1],angle)
   out_c[0]=v12P[0];
    k=0;
   out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
  
   let vPrec=v12P;
   let vPrec_1=v12P_1;
   for(let k=1; k<list_v.length-1; k++)
   {
       //calcola primo angolo rispetto alla retta vk vk-1
       vka1=calcolaAngolo(list_v[k], vPrec[1])
     
       vk_p=findPoints(list_v[k],list_v[k+1], dist_r[k],angle)    
       vk_p_1=findPoints(list_v[k],list_v[k+1], dist_r[k+1],angle) 
        //calcola angolo rispetto retta vk-vk+1
       vka2=calcolaAngolo(list_v[k], vk_p[0]);
     /*
       v2af=findPointsRetta(list_v[k],
        dist_r[k]+v_dist_add,
        subtractAngles(vka1,distAngolare(vka1,vka2)/2)+
                            p_angle_shift
                            +randomHash(-p_angle_rand,p_angle_rand)
       );
     */
     
            v2af=findPointsRetta(list_v[k],
                            dist_r[k]+v_dist_add,vka1+distAngolare(vka2,vka1)/2);
         out_c[k]=v2af;

       vPrec=vk_p;
       vPrec_1=vk_p_1;
   }
 
  out_c[list_v.length-1]=vPrec;
  k=out_c.length-1;
  
  vk_p=findPoints(list_v[k-1],list_v[k], dist_r[k],angle)   
  out_c[k]=vk_p[1]

       out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
                           


  return out_c;
  
}

//FUNZIONE IN USO
function calcPuntiParalleliP_v4(list_v,dist_r,v_dist_add,angle,p_max_rand)
{
   let out_c=[];

   let v12P=findPoints(list_v[0],list_v[1], dist_r[0],angle)
   let v12P_1=findPoints(list_v[0],list_v[1], dist_r[1],angle)
   out_c[0]=v12P[0];
    k=0;
   out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
  
   let vPrec=v12P;
   let vPrec_1=v12P_1;
  
   for(let k=1; k<list_v.length-1; k++)
   {
       //calcola primo angolo rispetto alla retta vk vk-1
       vka1=calcolaAngolo(list_v[k], vPrec[1])
     
       vk_p=findPoints(list_v[k],list_v[k+1], dist_r[k],angle)    
       vk_p_1=findPoints(list_v[k],list_v[k+1], dist_r[k+1],angle) 
        //calcola angolo rispetto retta vk-vk+1
       vka2=calcolaAngolo(list_v[k], vk_p[0]);
     

       v2af=findPointsRetta(list_v[k],
                            dist_r[k]+v_dist_add,vka1+distAngolare(vka2,vka1)/2);
         out_c[k]=v2af;

       

     
       vPrec=vk_p;
       vPrec_1=vk_p_1;
   }

  out_c[list_v.length-1]=vPrec;
  k=list_v.length-1;
  
  vk_p=findPoints(list_v[k-1],list_v[k], dist_r[k],angle)   
  out_c[k]=vk_p[1]
       out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )

  

  return out_c;
  
}

//FUNZIONE che prende in input un array e restituisce un secondo array con il doppio di coordinate perchè inserisce in mezzo anche il punto che si trova in mezzo alla retta tra i due punti consecutivi del primo array
function calcArrayPuntiIntermedi(list_v)
{
   let out_c=[];
   let i=0;
   out_c[0]=list_v[0]
   i++;
   for(let k=1; k<list_v.length; k++)
   {
      //calcola distanza tra i due punti
      let dist_punti=calcDistPuntiCoord(list_v[k-1],list_v[k]);
      let pC=calcPuntoRettaCoord(list_v[k-1],list_v[k],dist_punti/2)
      out_c[i]=pC;
      i++;
      out_c[i]=list_v[k];
      i++;
   }
  
  return out_c;
  
}

//FUNZIONE che prende in input array di coordinate e restituisce un nuovo array con le coordinate traslate di un certo angolo
function calcTraslaArray(list_v,dist_r,angle,p_max_rand)
{
    let out_c=[];
    let raggio=dist_r;
  
    if(p_max_rand==null)
      p_max_rand=0;
  
    for(let k=0; k<list_v.length;k++)
    {
      out_c[k]=findPointsRetta(list_v[k], dist_r,angle);
      out_c[k]=new VarCoord(out_c[k].x+randomHash(-p_max_rand,+p_max_rand),
                            out_c[k].y+randomHash(-p_max_rand,+p_max_rand)
                           )
    }
  
    return out_c;
}

//FUNZIONE DI CALCOLO UTILE PER SCORRERE IN PARALLELO DUE LISTE DI DIMENSIONE DIFFERENTE
function calcIndexListCompareInt(list_v1_length,list_v2_length,i1)
{
    let i2;
    i2=Math.floor((list_v2_length*i1)/list_v1_length);
    if(i2>=list_v2_length)
      i2=list_v2_length-1;
  
    return i2;
}

//FUNZIONE CHE PRENDE IN INPUT UN ARRAY DI COORDINATE e RESTITUISCE UN SECONDO ARRAY CON CORDINATE TRASLATE DI UN VALORE RANDOM
function calcAddRandList(p_list,p_rand_max)
{
    let p_list_output=[];
    
    for(let k=0;k<p_list.length;k++)
    {
        let coord=new VarCoord(p_list[k].x+randomHash(-p_rand_max,+p_rand_max),
                               p_list[k].y+randomHash(-p_rand_max,+p_rand_max))
        p_list_output[k]=coord;
        
    }
  
    return p_list_output;
}

//FUNZIONE CHE PRENDE IN INPUT UN ARRAY E RESTITUISCE UN NUOVO ARRAY SHIFTATO IN MODO CASUALE
function calcShiftArrayRandom(p_array)
{
    let out_array=[];
    let i=int(randomHash(0,p_array.length-1));
    for(let k=0;k<p_array.length;k++)
    {
        out_array[k]=p_array[i];
        i++;
        if(i>=p_array.length-2)
          i=0;
           
    }
    return out_array;
}


//FUNZIONE CHE CALCOLA VALORE PROPROZIONE TRA 0 e 1 RISPETTO ALLA DIMENSUIONE DEL QUADRILATERO
function calcProp(p1,p2,p3,p4,p_value)
{
    let dimM=(calcDistPuntiCoord(p1,p2)+calcDistPuntiCoord(p3,p4))/2;
    return p_value/dimM;
}

//funzione che prende in input due punti e restiuisce una lista di coordinate posizionate sulla retta tra i due punti
function calcListTwoPoint(p1,p2,n_punti)
{
   let outArray=[];
   let distp1p2=calcDistPuntiCoord(p1,p2);
   let passo=distp1p2/n_punti;
   
   for(let k=0;k<=n_punti;k++)
      outArray[k]=calcPuntoRettaCoord(p1,p2,passo*k)
  
   return outArray;
}

//genera un array segnale con valori tra 0 e 1prendendo in input l'array di coordinate
function genArrayDelta(pArray,p_coef,p_time,p_coef_time)
{
   let outArray=[];
   for(let k=0;k<pArray.length;k++)
   {
       outArray[k]=map(noise(pArray[k].x*p_coef,pArray[k].y*p_coef,p_time*p_coef_time),0,1,-1,1);
   }
   
   if(p_coef==0)
   for(let k=0;k<pArray.length;k++)
   {
       outArray[k]=0;
   }
  
   return outArray;
} 

//prende in inpur un array di coordinate e due array di segnali tra 1 e  0 e calcola nuovo array distanziato
function calcApplicaDelta(pArrayCurve,pArrayDeltaX,pArrayDeltaY,pDist,fmod)
{
   let outArray=[];
   outArray[0]=pArrayCurve[0];
  
   let p1=pArrayCurve[0];
   let p2=pArrayCurve[pArrayCurve.length-1];
   let distp1p2=calcDistPuntiCoord(p1,p2);
   let passo=distp1p2/(pArrayCurve.length-1);
   let pAngolo=calcolaAngolo(p1,p2);
   
  if(!fmod)
     for(let k=1;k<pArrayCurve.length-1;k++)
     {  
        let newp=new VarCoord(pArrayCurve[k].x+(pArrayDeltaX[k]*pDist),
                                pArrayCurve[k].y+(pArrayDeltaY[k]*pDist))
        outArray[k]=newp;
     }
   else
     for(let k=1;k<pArrayCurve.length-1;k++)
     {  
        let newp=calcPuntoRettaCoord(p1,p2,(passo*k)+(pArrayDeltaX[k]*passo/3))
        let newp2=findPointsRetta(newp, pArrayDeltaY[k]*pDist,pAngolo+PI/2)
        outArray[k]=newp2;
     }
   outArray[pArrayCurve.length-1]=pArrayCurve[pArrayCurve.length-1]
   return outArray;
}

//
function calcArrayIntermedi(vList1,vList2,n_array,p_noise_coef)
{
    let oArray=[];
  
    let vMatrix=[];
    for(let k=0;k<vList1.length;k++)
    {
        let p_passo=calcDistPuntiCoord(vList1[k],vList2[k])/n_array;
        vMatrix[k]=[];
        for(let j=0;j<=n_array;j++)
        {
            let p_rand=0;
            if(p_noise_coef!=0)
              if((j>0)&&(j<n_array-1))
              p_rand=map(noise(calcPuntoRettaCoord(vList1[k],vList2[k],j*p_passo).y*0.004)
                        ,0,1,-p_passo/2,p_passo);
          
          
           vMatrix[k][j]=calcPuntoRettaCoord(vList1[k],vList2[k],j*p_passo+p_rand)
            
        }
    }
    
  
    for(let j=0;j<=n_array;j++)
    {
        oArray[j]=[];
        for(let k=0;k<vMatrix.length;k++)
        {
           oArray[j].push(vMatrix[k][j]);
        }
    }
  
   return oArray;
}

//conatena due liste invertendo la seconda in modo da creare un oggetto poligonale
//va bene per tutte liste con punti paralleli o quasi
function calcConcatListReverse(vList1,vList2)
{ 
    let oArray=[];
    let s=vList1.length;
     for(let k=0;k<=vList1.length-1;k++)
    {
        oArray[k]=vList1[k];
    }
    for(let k=0;k<=vList2.length-1;k++)
    {
        oArray[k+s]=vList2[vList2.length-1-k];
    }
   return oArray;
}

//conatena due liste 
function calcConcatList(vList1,vList2)
{ 
    let oArray=[];
    let s=vList1.length;
     for(let k=0;k<=vList1.length-1;k++)
    {
        oArray[k]=vList1[k];
    }
    for(let k=0;k<=vList2.length-1;k++)
    {
        oArray[k+s]=vList2[k];
    }
   return oArray;
}
  
//calcola sotto array togliendo a sx e dx lo stesso numero di punti
function calcSottoArray(vList1,n_points_delete)
{
    let oArray=[];
    let i=0;
    for(let k=n_points_delete;k<vList1.length-n_points_delete;k++,i++)
    {
        oArray[i]=vList1[k];
    }
   return oArray;
}


///calcola distanza media tra due array con stesso numero di punti
function calDistMediaArray(vList1,vList2)
{
    let oMedia=0;
    for(let k=0;k<vList1.length;k++)
       oMedia=oMedia+calcDistPuntiCoord(vList1[k],vList2[k]);
  
   return oMedia/vList1.length;
   
}


//FUNZIONE PER DISEGNARE UNA STRISCIA CON BORDI STRAPPATI
function drawTornEdgesPanel(coord1, coord2, coord3, coord4, 
                       dimBordo,
                       n_elements,
                       rand,
                       side, //numero del lato da strappare (1 alto, 2 dx, 3 basso, 4 sx)
                       colorPaper,
                       shadow, //OMBRA YES/NO
                       shadowOffsetX, shadowOffsetY, shadowBlur,
                       panel
  )
{
    
    if(shadow=="YES")
    {
      panel.drawingContext.shadowOffsetX = shadowOffsetX;
      panel.drawingContext.shadowBlur =  shadowBlur;
      panel.drawingContext.shadowColor = 'black';
      panel.drawingContext.shadowOffsetY = shadowOffsetY; 
    }
  
    panel.fill(colorPaper);
    panel.stroke(colorPaper);
    panel.strokeWeight(5);
    
   coordBordo1=new VarCoord(0,0);
   coordBordo2=new VarCoord(0,0);
   //ALTO
   //if(side==1)
   {  
       calcPuntoRetta(coord1.x,coord1.y,coord4.x,coord4.y,-dimBordo,coordBordo1);
       calcPuntoRetta(coord2.x,coord2.y,coord3.x,coord3.y,-dimBordo,coordBordo2);
       bordo=matrixCoordEdge(coordBordo1,coordBordo2,coord2,coord1,n_elements,1,rand);

      panel.fill(colorPaper);
      panel.beginShape();
      panel.vertex(coord1.x,coord1.y);
          for(let i=1;i<n_elements;i++)
        {
           panel.vertex(bordo[i].x,bordo[i].y);
        } 
      //panel.vertex(coordBordo2.x,coordBordo2.y);
      panel.vertex(coord2.x,coord2.y);
      panel.vertex(coord1.x,coord1.y);
      panel.endShape();
     
   }
   //DX
   //if(side==2)
   {  
       calcPuntoRetta(coord2.x,coord2.y,coord1.x,coord1.y,-dimBordo,coordBordo1);
       calcPuntoRetta(coord3.x,coord3.y,coord4.x,coord4.y,-dimBordo,coordBordo2);
     
       bordo=matrixCoordEdge(coord2,coordBordo1,coordBordo2,coord3,n_elements,2,rand);

      panel.fill(colorPaper);
      panel.beginShape();
      panel.vertex(coord2.x,coord2.y);
      //panel.vertex(coordBordo1.x,coordBordo1.y);
        for(let i=1;i<n_elements;i++)
        {
           panel.vertex(bordo[i].x,bordo[i].y);
        } 
      panel.vertex(coord3.x,coord3.y);
      panel.endShape();
   }
     //BASSO
   //if(side==3)
   {  
       calcPuntoRetta(coord4.x,coord4.y,coord1.x,coord1.y,-dimBordo,coordBordo1);
       calcPuntoRetta(coord3.x,coord3.y,coord2.x,coord2.y,-dimBordo,coordBordo2);
       bordo=matrixCoordEdge(coord4,coord3,coordBordo2,coordBordo1,n_elements,3,rand);

      panel.fill(colorPaper);
      panel.beginShape();
      panel.vertex(coord4.x,coord4.y);
      panel.vertex(coord3.x,coord3.y);
     panel.vertex(coordBordo2.x,coordBordo2.y);
        for(let i=1;i<n_elements;i++)
        {
           panel.vertex(bordo[n_elements-1-i].x,bordo[n_elements-1-i].y);
        } 
      panel.endShape();
     
   }
   //SX
   //if(side==4)
   {  
       calcPuntoRetta(coord1.x,coord1.y,coord2.x,coord2.y,dimBordo,coordBordo1);
       calcPuntoRetta(coord4.x,coord4.y,coord3.x,coord3.y,dimBordo,coordBordo2);
     
       bordo=matrixCoordEdge(coordBordo1,coord1,coord4,coordBordo2,n_elements,4,rand);

      panel.fill(colorPaper);
      panel.beginShape();
      panel.vertex(coord1.x,coord1.y);
      panel.vertex(coord4.x,coord4.y);
        for(let i=1;i<n_elements;i++)
        {
           panel.vertex(bordo[n_elements-1-i].x,bordo[n_elements-1-i].y);
        } 
      panel.endShape();
   }

  
    //AZZERA OMBRA
    if(shadow=="YES")
    {
      panel.drawingContext.shadowOffsetX = 0;
      panel.drawingContext.shadowOffsetY = 0;
      panel.drawingContext.shadowBlur =0;
    }
  
    drawQuadPanel(coord1,coord2,coord3,coord4,panel);
}

  
function drawElementPanel(coord1,coord2,coord3,coord4,
                      distortion, //0=no distortion
                      scale, //0 no scale
                      strkBig,strkMed,strkSmall,col,letter,panel)
{
  
    if(letter=="AS7_3")//MATRIX 7x7 //CANCELLETTO
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA ORIZ. SOPRA
        drawLineQuadPanel(matrix[3][0],matrix[3][6],strkCur/2,panel);  //BARRA ORIZ. IN MEZZO
        drawLineQuadPanel(matrix[6][0],matrix[6][6],strkCur/2,panel);  //BARRA ORIZ. SOTTO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[6][1],panel); //BARRA VERT. SX
       drawLineNormPanel(matrix[0][3],matrix[6][3],panel); //BARRA VERT. CENTRALE
       drawLineNormPanel(matrix[0][5],matrix[6][5],panel); //BARRA VERT. DX
    }
  
     if(letter=="AS7_1")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); 
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); 
      
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); 
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); 
      
       drawLineQuadPanel(matrix[0][3],matrix[6][3],strkCur/2,panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[6][1],panel); //BARRA VERT. SX
       drawLineNormPanel(matrix[0][5],matrix[6][5],panel); //BARRA VERT. DX
    }
  
     if(letter=="AS7_2")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); 
        drawLineQuadPanel(matrix[6][0],matrix[6][3],strkCur/2,panel); 
      
        drawLineQuadPanel(matrix[0][3],matrix[0][6],strkCur/2,panel); 
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); 
      
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[0][1],matrix[2][1],matrix[5][3],matrix[6][3],panel);
       drawCurve4Panel(matrix[0][3],matrix[2][3],matrix[5][5],matrix[6][5],panel);
      

    }
  
       if(letter=="AS7_0")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[2][0],matrix[2][6],strkCur/2,panel); //BARRA ORIZZONTALE SOPRA
        drawLineQuadPanel(matrix[4][0],matrix[4][6],strkCur/2,panel); //BARRA ORIZZONTALE SOTTO
      
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); //PIEDE SX
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); //PIEDE DX
       
      //PER PUNTI
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][3],panel); //TESTA
      
       panel.stroke(col);
       panel.noFill();
       panel.strokeWeight(strkCur);
      
       drawLineNormPanel(matrix[0][0],matrix[2][0],panel); //BARRA VERTICALE SX ALTO
       drawLineNormPanel(matrix[4][0],matrix[6][0],panel); //BARRA VERTICALE SX BASSO
      
       drawLineNormPanel(matrix[0][6],matrix[2][6],panel); //BARRA VERTICALE SX ALTO
       drawLineNormPanel(matrix[4][6],matrix[6][6],panel); //BARRA VERTICALE SX BASSO
      
       drawLineNormPanel(matrix[4][3],matrix[1][3],panel); //BARRA VERTICALE SX BASSO
       
      
       //FRECCIE SMUSSATE
       strkCur=strkBig/2;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.stroke(col);
       drawTrianglePanel(matrix[0][0],matrix[0][1],strkCur/2,"ROUND",panel); //FRECCIA MANO A SX
       drawTrianglePanel(matrix[0][6],matrix[0][5],strkCur/2,"ROUND",panel); //FRECCIA MANO A DX
      
       

    }
  

    if(letter=="AS7_4")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);

      
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();

       drawCurve4Panel(matrix[6][1],matrix[5][1],matrix[1][2],matrix[0][2],panel);
       drawCurve4Panel(matrix[6][3],matrix[5][3],matrix[1][4],matrix[0][4],panel);
       drawCurve4Panel(matrix[6][5],matrix[5][5],matrix[1][6],matrix[0][6],panel);

       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][0],panel); 
    
      
    }
    if(letter=="AS7_5")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
       drawLineQuadPanel(matrix[0][0],matrix[4][0],strkCur/2,panel);
       drawLineQuadPanel(matrix[0][6],matrix[4][6],strkCur/2,panel);
      
       drawLineQuadPanel(matrix[3][3],matrix[6][3],strkCur/2,panel);
      //FRECCIE A PUNTA
      strkCur=strkBig*1.7;
      panel.strokeWeight(strkCur);
      panel.noStroke();
      drawTrianglePanel(matrix[4][0],matrix[6][0],strkCur/2,"NO",panel); //PUNTA BASSA SX
      drawTrianglePanel(matrix[4][6],matrix[6][6],strkCur/2,"NO",panel); //PUNTA BASSA DX
      
      //PER PUNTI
            strkCur=strkBig;
      panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[1][3],panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
      drawLineNormPanel(matrix[4][0],matrix[4][6],panel);
      

    }
  
    if(letter=="AS7_6")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
      
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); //PIEDE SX ALTO
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); //PIEDE SX BASSO
      
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); //PIEDE DX ALTO
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); //PIEDE DX BASSO
      
       drawLineQuadPanel(matrix[0][3],matrix[1][3],strkCur/2,panel); //BARRA CENTRALE ALTA
       drawLineQuadPanel(matrix[4][3],matrix[6][3],strkCur/2,panel); //BARRA CENTRALE BASSA
      
       panel.stroke(col);
       panel.noFill();
       drawCurve3Panel(matrix[4][1],matrix[3][2],matrix[4][3],panel);
       drawCurve3Panel(matrix[4][3],matrix[3][4],matrix[4][5],panel);
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[1][1],panel); //BARRA VERT. SX ALTA
       drawLineNormPanel(matrix[4][1],matrix[6][1],panel); //BARRA VERT. SX BASSA
      
       drawLineNormPanel(matrix[0][5],matrix[1][5],panel); //BARRA VERT. DX ALTA
       drawLineNormPanel(matrix[4][5],matrix[6][5],panel); //BARRA VERT. DX BASSA
       
       drawLineNormPanel(matrix[1][1],matrix[1][5],panel); //BARRA ORIZZ. ALTA
    
    }
    if(letter=="AS7_7")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
      
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); //PIEDE SX ALTO
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); //PIEDE SX BASSO
      
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); //PIEDE DX ALTO
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); //PIEDE DX BASSO
      
       drawLineQuadPanel(matrix[0][3],matrix[2][3],strkCur/2,panel); //BARRA CENTRALE VERT ALTA
       drawLineQuadPanel(matrix[4][3],matrix[6][3],strkCur/2,panel); //BARRA CENTRALE VERT BASSA
      
       drawLineQuadPanel(matrix[2][0],matrix[2][6],strkCur/2,panel); //BARRA CENTRALE ORIZ ALTA
       drawLineQuadPanel(matrix[4][0],matrix[4][6],strkCur/2,panel); //BARRA CENTRALE ORIZ BASSA
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[2][1],panel); //BARRA VERT. SX ALTA
       drawLineNormPanel(matrix[4][1],matrix[6][1],panel); //BARRA VERT. SX BASSA
      
       drawLineNormPanel(matrix[0][5],matrix[2][5],panel); //BARRA VERT. DX ALTA
       drawLineNormPanel(matrix[4][5],matrix[6][5],panel); //BARRA VERT. DX BASSA
      
    } 
  
      if(letter=="AS7_8")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
      
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); //PIEDE SX BASSO
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); //PIEDE DX BASSO
      
        drawLineQuadPanel(matrix[1][3],matrix[6][3],strkCur/2,panel); //BARRA CENTRALE
      
       panel.stroke(col);
       panel.noFill();
       drawCurve3Panel(matrix[1][1],matrix[0][2],matrix[1][3],panel);
       drawCurve3Panel(matrix[1][3],matrix[0][4],matrix[1][5],panel);
       
      panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[1][1],matrix[6][1],panel); //BARRA VERT. SX 
      drawLineNormPanel(matrix[1][5],matrix[6][5],panel); //BARRA VERT. DX
      
    
    }
     if(letter=="AS7_9")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
      
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); //PIEDE SX ALTO
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); //PIEDE DX ALTO
      
        drawLineQuadPanel(matrix[0][3],matrix[6][3],strkCur/2,panel); //BARRA CENTRALE
  
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[1][1],matrix[6][2],matrix[6][4],matrix[1][5],panel);
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[1][1],panel); //BARRA VERT. SX 
      drawLineNormPanel(matrix[0][5],matrix[1][5],panel); //BARRA VERT. DX
   }
  
    if(letter=="AS7_10")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
      
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); //PIEDE SX BASSO
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); //PIEDE DX BASSO
      
        drawLineQuadPanel(matrix[3][3],matrix[6][3],strkCur/2,panel); //BARRA CENTRALE
       drawLineQuadPanel(matrix[0][0],matrix[6][0],strkCur/2,panel); //BARRA SX
       drawLineQuadPanel(matrix[2][6],matrix[6][6],strkCur/2,panel); //BARRA DX
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][6],panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[3][3],panel); //BARRA OBLIQ. SX 
       drawLineNormPanel(matrix[3][3],matrix[2][6],panel); //BARRA OBLIQ. DX 
  
   }
    if(letter=="AS7_11")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
      
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); //PIEDE SX BASSO
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); //PIEDE DX BASSO
      
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); //PIEDE SX ALTO
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); //PIEDE DX ALTO
      
        drawLineQuadPanel(matrix[2][1],matrix[2][5],strkCur/2,panel); //BARRA ORIZ. SOPRA
        drawLineQuadPanel(matrix[4][1],matrix[4][5],strkCur/2,panel); //BARRA ORIZ. SOTTO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[2][1],panel); //BARRA SX ALTO
       drawLineNormPanel(matrix[4][1],matrix[6][1],panel); //BARRA SX BASSO
      
       drawLineNormPanel(matrix[0][5],matrix[2][5],panel); //BARRA DX ALTO
       drawLineNormPanel(matrix[4][5],matrix[6][5],panel); //BARRA DX BASSO
      
   }
      if(letter=="AS7_12")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); //PIEDE SX ALTO
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); //PIEDE DX ALTO
      
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[5][3],panel); 
      
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[0][1],matrix[2][2],matrix[2][4],matrix[0][5],panel);
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkSmall;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[2][3],matrix[6][3],panel); //BARRA CENTRALE
       drawLineNormPanel(matrix[5][2],matrix[5][4],panel); //BARRA CENTRALE
      
   }
  
    if(letter=="AS7_13")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col);
       panel.noStroke();
        drawLineQuadPanel(matrix[1][0],matrix[3][0],strkCur/2,panel); //PIEDE SX ALTO
        drawLineQuadPanel(matrix[0][6],matrix[1][6],strkCur/2,panel); //PIEDE DX ALTO
      
        drawLineQuadPanel(matrix[5][0],matrix[6][0],strkCur/2,panel); //PIEDE SX BASSO
        drawLineQuadPanel(matrix[3][6],matrix[5][6],strkCur/2,panel); //PIEDE DX BASSO
      
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][0],panel); 
       drawPointPanel(matrix[6][6],panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[3][0],matrix[1][6],panel); //BARRA OBLIQ SOPRA
       drawLineNormPanel(matrix[5][0],matrix[3][6],panel); //BARRA OBLIQ SOTTO
      
    }
  
    if(letter=="AS7_14")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); //PIEDE SX ALTO
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); //PIEDE DX ALTO
    
        drawLineQuadPanel(matrix[6][0],matrix[6][1],strkCur/2,panel); //PIEDE SX BASSO
        drawLineQuadPanel(matrix[6][5],matrix[6][6],strkCur/2,panel); //PIEDE DX BASSO
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[0][1],matrix[2][2],matrix[2][4],matrix[0][5],panel); //CURVA ALTA
       drawCurve4Panel(matrix[6][1],matrix[4][2],matrix[4][4],matrix[6][5],panel); //CURVA BASSA
      
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkSmall;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[1][3],matrix[5][3],panel); //BARRA CENTRALE SOTTILE
      
       drawLineNormPanel(matrix[2][0],matrix[2][6],panel); //BARRA ALTA SOTTILE
       drawLineNormPanel(matrix[4][0],matrix[4][6],panel); //BARRA BASSA SOTTILE
      
    }
  
    if(letter=="AS7_15")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[5][0],matrix[6][0],strkCur/2,panel); //PIEDE SX BASSO
        drawLineQuadPanel(matrix[5][6],matrix[6][6],strkCur/2,panel); //PIEDE DX BASSO
      
        drawLineQuadPanel(matrix[1][3],matrix[5][3],strkCur/2,panel); //BARRA CENTRALE
      
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[0][0],matrix[2][1],matrix[2][5],matrix[0][6],panel); //CURVA ALTA
      
        //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][3],panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[5][0],matrix[5][6],panel); //BARRA ORIZ SOTTO
      
    }
  
    if(letter=="AS7_16")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
      
        panel.beginShape();
        panel.curveVertex(matrix[6][0].x,matrix[6][0].y);
        panel.curveVertex(matrix[6][0].x,matrix[6][0].y);
        panel.curveVertex(matrix[2][0].x,matrix[2][0].y);
        panel.curveVertex(matrix[0][1].x,matrix[0][1].y);
        panel.curveVertex(matrix[0][5].x,matrix[0][5].y);
        panel.curveVertex(matrix[2][6].x,matrix[2][6].y);
        panel.curveVertex(matrix[5][6].x,matrix[5][6].y);
        panel.curveVertex(matrix[6][5].x,matrix[6][5].y);
        panel.curveVertex(matrix[6][3].x,matrix[6][3].y);
        panel.curveVertex(matrix[4][2].x,matrix[4][2].y);
        panel.curveVertex(matrix[3][2].x,matrix[3][2].y);
        panel.curveVertex(matrix[2][3].x,matrix[2][3].y);
        panel.curveVertex(matrix[2][3].x,matrix[2][3].y);
        panel.endShape();
      
       //PER FRECCIE
      //FRECCIE SMUSSATE
       strkCur=strkBig/2;
       panel.strokeWeight(strkCur+2);
       panel.fill(col) 
       panel.stroke(col);
       drawTrianglePanel(matrix[2][3],matrix[2][4],strkCur/4,"ROUND",panel); 
      } 
  
    if(letter=="AS7_17")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[6][0],matrix[6][6],strkCur/2,panel); //BARRA SOTTO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[6][0],panel); //BARRA SX
       drawLineNormPanel(matrix[0][6],matrix[6][6],panel); //BARRA SX
      
    } 
    if(letter=="AS7_18")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[5][0],matrix[5][6],strkCur/2,panel); //BARRA SOTTO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[6][0],panel); //BARRA SX
       drawLineNormPanel(matrix[0][6],matrix[6][6],panel); //BARRA SX
       drawLineNormPanel(matrix[0][3],matrix[6][3],panel); //BARRA SX
      
    } 
  
    if(letter=="AS7_19")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[6][0],matrix[6][6],strkCur/2,panel); //BARRA SOTTO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[6][1],panel); //BARRA SX
       drawLineNormPanel(matrix[0][5],matrix[6][5],panel); //BARRA DX
      

      
    } 
   
    if(letter=="AS7_20")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[3][1],matrix[3][5],strkCur/2,panel); //BARRA CENTRALE
        drawLineQuadPanel(matrix[6][1],matrix[6][5],strkCur/2,panel); //BARRA SOTTO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][1],matrix[3][1],panel); //BARRA SX
       drawLineNormPanel(matrix[0][5],matrix[3][5],panel); //BARRA DX
      
        strkCur=strkSmall;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[2][3],matrix[6][3],panel); //BARRA SOTTILE CENTRALE
      
      
    } 
  
    if(letter=="AS7_21")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[1][3],matrix[4][3],strkCur/2,panel); //BARRA CENTRALE
      
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[6][0],panel); 
       drawPointPanel(matrix[6][6],panel); 
      
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[0][0],matrix[2][1],matrix[2][5],matrix[0][6],panel); //CURVA ALTA
       drawCurve4Panel(matrix[5][0],matrix[3][1],matrix[3][5],matrix[5][6],panel); //CURVA BASSA
    } 
    if(letter=="AS7_22")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[2][3],matrix[4][3],strkCur/2,panel); //BARRA CENTRALE
      
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[1][0],matrix[2][1],matrix[2][5],matrix[1][6],panel); //CURVA ALTA
       drawCurve4Panel(matrix[5][0],matrix[4][1],matrix[4][5],matrix[5][6],panel); //CURVA BASSA
      
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][0],panel); 
       drawPointPanel(matrix[0][6],panel); 
       drawPointPanel(matrix[6][6],panel);
       drawPointPanel(matrix[6][0],panel);
    } 
  
    if(letter=="AS7_23")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[2][2],matrix[5][2],strkCur/2,panel); //BARRA SX
        drawLineQuadPanel(matrix[2][4],matrix[5][4],strkCur/2,panel); //BARRA DX
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][3],panel); 

      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[2][2],panel); //BARRA OBBLIQ ALTO SX
       drawLineNormPanel(matrix[0][6],matrix[2][4],panel); //BARRA OBBLIQ ALTO DX
      
       drawLineNormPanel(matrix[6][0],matrix[5][2],panel); //BARRA OBBLIQ BASSO SX
       drawLineNormPanel(matrix[5][4],matrix[6][6],panel); //BARRA OBBLIQ BASSO DX
   } 
  
    if(letter=="AS7_24")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[1][0],strkCur/2,panel); //DENTE SX ALTO
        drawLineQuadPanel(matrix[3][0],matrix[6][0],strkCur/2,panel); //DENTE SX BASSO
      
        drawLineQuadPanel(matrix[0][3],matrix[1][3],strkCur/2,panel); //DENTE CENTRALE ALTO
        drawLineQuadPanel(matrix[3][3],matrix[6][3],strkCur/2,panel); //DENTE CENTRALE BASSO     
      
        drawLineQuadPanel(matrix[0][6],matrix[1][6],strkCur/2,panel); //DENTE SX ALTO
        drawLineQuadPanel(matrix[3][6],matrix[6][6],strkCur/2,panel); //DENTE SX BASSO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[0][6],panel); //BARRA SOPRA
       drawLineNormPanel(matrix[6][0],matrix[6][6],panel); //BARRA SOTTO
      
    } 
  
    if(letter=="AS7_25")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[6][0],matrix[6][6],strkCur/2,panel); //BARRA SOTTO
      
      //FRECCIE A PUNTA
      strkCur=strkBig*1.4;
      panel.strokeWeight(strkCur);
      panel.noStroke();
      drawTrianglePanel(matrix[5][3],matrix[3][3],strkCur/2,"NO",panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[6][0],panel); //BARRA SX
       drawLineNormPanel(matrix[0][6],matrix[6][6],panel); //BARRA SX
      
    } 
  
    if(letter=="AS7_26")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][1],strkCur/2,panel); //BARRA SOPRA SX
        drawLineQuadPanel(matrix[0][5],matrix[0][6],strkCur/2,panel); //BARRA SOPRA DX
        drawLineQuadPanel(matrix[6][3],matrix[6][5],strkCur/2,panel); //BARRA SOTTO
      
        panel.stroke(col);
       panel.noFill();
       drawCurve3Panel(matrix[0][1],matrix[3][2],matrix[3][5],panel); //CURVA ALTA
      
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[6][1],panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][5],matrix[6][5],panel); //BARRA DX
    } 
  
    if(letter=="AS7_27")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[6][0],matrix[6][6],strkCur/2,panel); //BARRA SOTTO
       
      //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[3][3],panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[6][0],panel); //BARRA SX
       drawLineNormPanel(matrix[0][6],matrix[6][6],panel); //BARRA SX
      
       strkCur=strkSmall;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[6][6],panel); //LINEA OBBLIQ SOTTILE
      
    } 
  
    if(letter=="AS7_28")//MATRIX 7x7 
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[2][0],matrix[2][6],strkCur/2,panel); //BARRA SOPRA
      
        drawLineQuadPanel(matrix[4][0],matrix[6][0],strkCur/2,panel); //PIEDE SX
        drawLineQuadPanel(matrix[4][3],matrix[6][3],strkCur/2,panel); //PIEDE CENTRALE
        drawLineQuadPanel(matrix[4][6],matrix[6][6],strkCur/2,panel); //PIEDE DX
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[2][0],matrix[0][2],matrix[0][4],matrix[2][6],panel); //CURVA ALTA
      
    } 
  
    if(letter=="AS7_29")//MATRIX 7x7 E' il ROVESCIO DI AS7_28
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[4][0],matrix[4][6],strkCur/2,panel); //BARRA SOTTO
      
        drawLineQuadPanel(matrix[0][0],matrix[2][0],strkCur/2,panel); //PIEDE SX
        drawLineQuadPanel(matrix[0][3],matrix[2][3],strkCur/2,panel); //PIEDE CENTRALE
        drawLineQuadPanel(matrix[0][6],matrix[2][6],strkCur/2,panel); //PIEDE DX
       panel.stroke(col);
       panel.noFill();
       drawCurve4Panel(matrix[4][0],matrix[6][2],matrix[6][4],matrix[4][6],panel); //CURVA ALTA
      
    } 
  
    if(letter=="AS7_30")//MATRIX 7x7 E' il ROVESCIO DI AS7_28
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
      
        drawLineQuadPanel(matrix[0][0],matrix[2][0],strkCur/2,panel); //PIEDE SX
        drawLineQuadPanel(matrix[0][3],matrix[2][3],strkCur/2,panel); //PIEDE CENTRALE
        drawLineQuadPanel(matrix[0][6],matrix[2][6],strkCur/2,panel); //PIEDE DX
      
      //FRECCIE A PUNTA
      strkCur=strkBig*1.2;
      panel.strokeWeight(strkCur);
      panel.noStroke();
      drawTrianglePanel(matrix[4][0],matrix[6][0],strkCur/2,"NO",panel); //PUNTA BASSA SX
      drawTrianglePanel(matrix[4][6],matrix[6][6],strkCur/2,"NO",panel); //PUNTA BASSA DX
      
    } 
    //CARPE DIEM
    if(letter=="CD7_00")//MATRIX 7x7 //C
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][4],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[6][4],matrix[6][6],strkCur/2,panel); //BARRA SOTTO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawCurve4Panel(matrix[6][6],matrix[5][0],matrix[1][0],matrix[0][6],panel); //CURVA ALTA
      
    } 
  
    if(letter=="CD7_01")//MATRIX 7x7 //A
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[4][0],matrix[6][0],strkCur/2,panel); //BARRA SX
        drawLineQuadPanel(matrix[4][6],matrix[6][6],strkCur/2,panel); //BARRA DX
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawCurve4Panel(matrix[6][0],matrix[0][1],matrix[0][5],matrix[6][6],panel); //CURVA ALTA
       strkCur=strkMed;
       panel.strokeWeight(strkCur);
      drawLineNormPanel(matrix[5][0],matrix[5][6],panel);
      
    } 
    if(letter=="CD7_02")//MATRIX 7x7 //R
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[5][0],strkCur/2,panel); //BARRA SX
      
        strkCur=strkMed;
        panel.strokeWeight(strkCur);
        drawLineQuadPanel(matrix[6][4],matrix[6][6],strkCur/2,panel);

  
       panel.stroke(col);
       panel.noFill();
       strkCur=strkMed;
       panel.strokeWeight(strkCur);
       drawCurve4Panel(matrix[0][0],matrix[0][6],matrix[3][6],matrix[4][0],panel); //CURVA ALTA
       drawCurve3Panel(matrix[4][0],matrix[4][3],matrix[6][6],panel); //CURVA BASSA
      
      
    } 
    if(letter=="CD7_10")//MATRIX 7x7 //P
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[6][0],strkCur/2,panel); //BARRA SX
  
       panel.stroke(col);
       panel.noFill();
       strkCur=strkMed;
       panel.strokeWeight(strkCur);
       drawCurve4Panel(matrix[0][0],matrix[0][6],matrix[3][6],matrix[4][0],panel); //CURVA ALTA
      
    } 
  
    if(letter=="CD7_11")//MATRIX 7x7 //E
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkMed;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[6][0],matrix[6][6],strkCur/2,panel); //BARRA SOTTO
        drawLineQuadPanel(matrix[3][0],matrix[3][4],strkCur/2,panel); //BARRA IN MEZZO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawCurve3Panel(matrix[0][0],matrix[3][1],matrix[6][0],panel); //CURVA ALTA
      
    } 
    
    if(letter=="CD7_12")//MATRIX 7x7 //D
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkMed;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[6][0],strkCur/2,panel); //BARRA SX

      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawCurve4Panel(matrix[0][0],matrix[2][6],matrix[4][6],matrix[6][0],panel); //CURVA
    } 
  
    if(letter=="CD7_20")//MATRIX 7x7 //I
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[3][3],matrix[6][3],strkCur/2,panel); //BARRA CENTRALE
      
       //PER PUNTI
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.stroke(col);
       panel.noFill();
       drawPointPanel(matrix[0][3],panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkSmall;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[6][0],matrix[6][6],panel);
    } 
    if(letter=="CD7_21")//MATRIX 7x7 //E
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkMed;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[0][6],strkCur/2,panel); //BARRA SOPRA
        drawLineQuadPanel(matrix[6][0],matrix[6][6],strkCur/2,panel); //BARRA SOTTO
        drawLineQuadPanel(matrix[3][0],matrix[3][4],strkCur/2,panel); //BARRA IN MEZZO
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       drawCurve3Panel(matrix[0][0],matrix[3][1],matrix[6][0],panel); //CURVA ALTA
      
    } 
  
    if(letter=="CD7_22")//MATRIX 7x7 //M
    {
       matrix=defMatrix(coord1,coord2,coord3,coord4,6,distortion,scale);
       strkCur=strkBig;
       panel.strokeWeight(strkCur);
       panel.fill(col) 
       panel.noStroke();
        drawLineQuadPanel(matrix[0][0],matrix[6][0],strkCur/2,panel); //BARRA SX
        drawLineQuadPanel(matrix[0][6],matrix[4][6],strkCur/2,panel); //BARRA DX
       
       strkCur=strkSmall;
       panel.strokeWeight(strkCur);
        drawLineQuadPanel(matrix[5][4],matrix[5][6],strkCur/2,panel); 
      
       panel.stroke(col);
       panel.noFill();
       strkCur=strkMed;
       panel.strokeWeight(strkCur);
       drawLineNormPanel(matrix[0][0],matrix[3][3],panel); 
       drawLineNormPanel(matrix[3][3],matrix[0][6],panel); 
      
    }
  

}

//DISEGNA LINEA CURVA CHE PASSA PER LE TRE COORDINATE
function drawCurve3Panel(coord1,coord2,coord3,panel)
{
        panel.beginShape();
        panel.curveVertex(coord1.x,coord1.y);
        panel.curveVertex(coord1.x,coord1.y);
        panel.curveVertex(coord2.x,coord2.y);
        panel.curveVertex(coord3.x,coord3.y);
        panel.curveVertex(coord3.x,coord3.y);
        panel.endShape();
  
}

//DISEGNA LINEA CURVA CHE PASSA PER LE QUATTRO COORDINATE
function drawCurve4Panel(coord1,coord2,coord3,coord4,panel)
{
        panel.beginShape();
        panel.curveVertex(coord1.x,coord1.y);
        panel.curveVertex(coord1.x,coord1.y);
        panel.curveVertex(coord2.x,coord2.y);
        panel.curveVertex(coord3.x,coord3.y);
        panel.curveVertex(coord4.x,coord4.y);
        panel.curveVertex(coord4.x,coord4.y);
        panel.endShape();
  
}

//DISEGNA QUADRILATERO
function drawQuadPanel(coord1,coord2,coord3,coord4,panel)
{
    panel.beginShape();
       panel.vertex(coord1.x,coord1.y);
       panel.vertex(coord2.x,coord2.y);
       panel.vertex(coord3.x,coord3.y);
       panel.vertex(coord4.x,coord4.y);
    panel.endShape(CLOSE);
  
}

//DISEGNA LINEA QUADRATA
function drawLineQuadPanel(coord1,coord2,strk,panel)
{
      coord=calcPuntParalleli(coord1.x,coord1.y,coord2.x,coord2.y,strk);
      drawQuadPanel(coord[0],coord[1],coord[2],coord[3],panel);
  
}

//DISEGNA LINEA TONDA
function drawLineNormPanel(coord1,coord2,panel)
{
      panel.line(coord1.x,coord1.y,coord2.x,coord2.y);
}

//DISEGNA PUNTO
function drawPointPanel(coord,panel)
{
   panel.point(coord.x,coord.y);
}

function drawDoubleElementPanel(coord1,coord2,coord3,coord4,
                                 dist,scale,
                      strkBig,strkMed,strkSmall,delta_strk,col1,col2,letter,panel)
{
      drawElementPanel(coord1,coord2,coord3,coord4,
                       dist,scale,
            strkBig,strkMed,strkSmall,col1,letter,panel);

panel.erase();
      drawElementPanel(coord1,coord2,coord3,coord4,
                        dist,scale,
            strkBig-delta_strk,strkMed-delta_strk,strkSmall-delta_strk,col2,letter,panel);
panel.noErase();

}

//disegna triangolo con la punta in coord2
function drawTrianglePanel(coord1,coord2, strk,round,panel)
{
    coord=calcPuntParalleli(coord1.x,coord1.y,coord2.x,coord2.y,strk);
    if(round=="ROUND")
        panel.strokeJoin(ROUND);

  let coordP2=new VarCoord(0,0);
  
  calcPuntoRetta(coord2.x,coord2.y,coord1.x,coord1.y,+strk/2,coordP2)
  panel.triangle(coord[0].x,coord[0].y,coord[1].x,coord[1].y,coordP2.x,coordP2.y);
  calcPuntoRetta(coord2.x,coord2.y,coord1.x,coord1.y,-strk/2,coordP2)
  panel.triangle(coord[0].x,coord[0].y,coord[1].x,coord[1].y,coordP2.x,coordP2.y);
  panel.triangle(coord[0].x,coord[0].y,coord[1].x,coord[1].y,coord2.x,coord2.y);
}

function defMatrix(coord1,coord2,coord3,coord4,matrix,distortion,scale)
{
      //let coordMatrix;
      tscale=100;
      coordMatrixScale=matrixCoord(coord1,coord2,coord3,coord4,tscale);
  
          
      if(distortion!=0)
        coordMatrix=matrixCoordRand(coordMatrixScale[0+scale][0+scale], 
                                    coordMatrixScale[0+scale][tscale-scale], 
                                    coordMatrixScale[tscale-scale][tscale-scale],
                                    coordMatrixScale[tscale-scale][0+scale],
                                    matrix,distortion);
      else
                coordMatrix=matrixCoord(coordMatrixScale[0+scale][0+scale], 
                                    coordMatrixScale[0+scale][tscale-scale], 
                                    coordMatrixScale[tscale-scale][tscale-scale],
                                    coordMatrixScale[tscale-scale][0+scale],
                                    matrix);

      return coordMatrix;
}

function matrixCoord(coord1,coord2,coord3,coord4,matrix)
{
   let coord_out; //OGGETTO COORDINATE
   let coordMatrix=[]; //MATRICE OUTPUT
  
   //INIZIALIZZA MATRICE
   for(let i=0;i<matrix+1;i++)
   { 
      coordMatrix[i]=[];
    }
  
   //DEFINISCI I PUNTI DELLA MATRICE SUL LATO ALTO
   let dist_12 = calcDistPunti(coord1.x,coord1.y,coord2.x,coord2.y);
   let passo_12 = dist_12/(matrix);
    for(let j=0;j<matrix+1;j++)
    { 
      coord_out=new VarCoord(0,0);
      calcPuntoRetta(coord1.x,coord1.y,coord2.x,coord2.y,(passo_12*j),coord_out);
      coordMatrix[0][j]=coord_out;

    }    

    //DEFINISCI I PUNTI DELLA MATRICE SUL LATO BASSO
    let dist_34 = calcDistPunti(coord3.x,coord3.y,coord4.x,coord4.y);
    let passo_34 = dist_34/(matrix);
    for(let j=0;j<matrix+1;j++)
    { 
       coord_out=new VarCoord(0,0);
       //coord4 sta prima di coord3 nel piano quindi passo è negativo
       calcPuntoRetta(coord4.x,coord4.y,coord3.x,coord3.y,(passo_34*j),coord_out);
       coordMatrix[matrix][j]=coord_out;
    }
   
   //DEFINISCI GLI ALTRI PUNTI DELLA MATRICE UNENDO I PUNTI SUL LATO ALTO CON QUELLI SUL LATO BASSO
   for(let j=0;j<matrix+1;j++) 
   {  
       
       let dist_x = calcDistPunti(coordMatrix[0][j].x,coordMatrix[0][j].y,
                                  coordMatrix[matrix][j].x,coordMatrix[matrix][j].y);
       let passo_x = dist_x/(matrix);
     
      for(let i=1;i<matrix;i++)
       { 
         coord_out=new VarCoord(0,0);
         //coord4 sta prima di coord3 nel piano quindi passo è negativo
         calcPuntoRetta(coordMatrix[0][j].x,coordMatrix[0][j].y,
                                  coordMatrix[matrix][j].x,coordMatrix[matrix][j].y,
                                  (passo_x*i),coord_out);
         
         coordMatrix[i][j]=coord_out;
       }
   }
   
   return coordMatrix;
  
}

