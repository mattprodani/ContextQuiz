let questionNo = 0;
let questionUrls = ["sicily.png", "kentucky.png"];
let Q_COUNT;
let imgs = [];
let answers = [[]]
let score = 0;
let responses = [];
let resultTable = [];
let quizMode = true;

let htmlResults;


let questionData;
let buttons = [];

function preload(){
  questionData = loadJSON("src/questions.json", getImages);

}

function getImages(){
  Q_COUNT = questionData.photos.length;
  for(let i = 0; i < Q_COUNT; i++){
    imgs[i] = loadImage("src/" + questionData.photos[i].FILENAME);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  makeButtons();
  

}

function draw() {
  background("#222");
  if(quizMode){
    showQuiz();
  }else{
    showResults();
  }


}


function showResults(){

  textSize(28);  
  textAlign(CENTER);  
  fill("#FFF")
  text("Your Results", windowWidth / 2, windowHeight/10);
}


function parseResult(){
  let content = "";
  for(let i = 0; i < resultTable.length; i++){
    content += "<p><strong>Question " + (i + 1) + ": " + resultTable[i][0] + "<\/strong><\/p>\r\n<p>Correct answer: " + resultTable[i][1] + 
    "<\/p>\r\n<p>Your answer: " + resultTable[i][2] + "<\/p>\r\n<p>&nbsp;<\/p>";
  }
  htmlResults = content;
  let div = createDiv(htmlResults);
  div.position(0, windowHeight / 5);
  console.log(htmlResults);

}

function showQuiz(){
  imageMode(CENTER);
  
  showScore();

  showQuestionNumber();


  showButtons();

  showPhoto();
}


function showScore(){
  textAlign(CENTER);
  textSize(23);  
  fill("#FFF");
  text("Score: " + score, 50, 50);
}

function showQuestionNumber(){
  textSize(28);  
  textAlign(CENTER);  
  fill("#FFF")
  text("Question " + (questionNo + 1), windowWidth / 2, windowHeight/10);

  textSize(22);
  text("Pick the most appropriate caption", windowWidth / 2, windowHeight / 2 + windowHeight/20);

}
function showPhoto(){
  let height = windowHeight/10 * 3;
  let start = windowHeight / 5;
  image(imgs[questionNo], windowWidth/2, start + height / 2, height * (3/2), height);
}

function showButtons(hide = false){
  for(let i = 0; i < buttons.length; i++){
    if(hide){
      buttons[i].hide();
    }else{
    buttons[i].show();}
  }
}

function refresh(){
  //BUTTONS
  console.log("CALLED");
  let label = "";
  for(let i = 0; i < buttons.length; i++){
    buttons[i].html(questionData.photos[questionNo].LABELS[i]);
    buttons[i].center('horizontal');
  }
}

function makeButtons(){
  let name = "";
  for(let i = 0; i < questionData.labelCount; i++){
    name = questionData.photos[questionNo].LABELS[i];
    buttons[i] = createButton(name, "label" + i)
      .position(windowWidth/2, windowHeight / 20 * (14 + i))
      .mouseClicked(function(){ changeImg(i); }).center('horizontal');
  }
}



function changeImg(id){
  let correct = "INCORRECT";
  let correctId = questionData.photos[questionNo].CORRECT;
  if(id == correctId){
    score++;
    correct = "CORRECT";
  }
  resultTable[questionNo] = [correct, questionData.photos[questionNo].LABELS[correctId], questionData.photos[questionNo].LABELS[id]];
  responses[questionNo] = id;

  if(questionNo == Q_COUNT - 1){
    quizMode = false;
    showButtons(true);
    console.log(resultTable);
    parseResult();
  }else{
    questionNo++;
    refresh();}

  clear();
  
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for(let i = 0; i < buttons.length; i++){
    buttons[i].position(windowWidth/2, windowHeight / 20 * (14 + i)).center('horizontal');
  }
}