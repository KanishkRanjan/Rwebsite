const potd = document.querySelector("#potd"); 
const archive = document.querySelector("#archive"); 

const  createProblemRow = async (problemData) => {
  console.log(problemData);

  const tr = document.createElement("tr");

  const problemCell = document.createElement("td");
  problemCell.className = "problem";
  const problemLink = document.createElement("a");
  problemLink.href = problemData.link;
  problemLink.textContent = problemData.name;
  problemCell.appendChild(problemLink);
  tr.appendChild(problemCell);


  const info = document.createElement("td") ;
  info.className = "info"
  info.innerText = "Loading"
  info.id = `problem-${problemData._id}`
  tr.appendChild(info)
  const tagsCell1 = document.createElement("td");
  tagsCell1.className = "tags";

  problemData.tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.textContent = tag;
    tagsCell1.appendChild(span);
  });
  tr.appendChild(tagsCell1);

  const tagsCell2 = document.createElement("td");
  tagsCell2.className = "tags";
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = problemData.difficulty;
  tagsCell2.appendChild(span);
  tr.appendChild(tagsCell2);

  return tr;
}

// const data = await sendFetchRequest("/problems/getproblems/450005");

(async ()=>{
  let potdlist = []
  let archivelist = []



  for(let i =0  ;i < data.length ; i++){
    elem = data[i];
    const tmpRow = await createProblemRow(elem)
    if(elem.date == getFormatedDate(new Date()) ){
      potdlist.push(tmpRow);
    }
    else archivelist.push(tmpRow);
  }
  
  // potdlist.ad

  potd.innerHTML = "";
  archive.innerHTML = "";

  potdlist.forEach(elem=>{
    potd.appendChild(elem);
  })

  archivelist.forEach(elem=>{
    archive.appendChild(elem);
  })
  
  if(potdlist.length == 0){
    potd.innerHTML = (`<tr><td colspan="3">No Question</td><tr>`);
  }
  if(archivelist.length == 0){
    archive.innerHTML = (`<tr><td colspan="3">No Question</td><tr>`);
  }
  console.log("this is beta");
  
})().then( async ()=>{
  for(let i = 0 ; i < data.length ; i++){
    const statics = await sendFetchRequest(`/problems/getsolvecount?contestId=${data[i].contestId}&problemIndex=${data[i].problemIndex}`)
    document.querySelector(`#problem-${data[i]._id}`).innerText = `${statics.totalSolve-statics.participantSolve}/${statics.participantSolve}/${statics.totalSolve}`    
  }
})
