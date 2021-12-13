let questionNo = 0;
let Q_COUNT;
let imgs = [];
let score = 0;
let responses = [];
let resultTable = [];
let quizMode = true;

let htmlResults;


let questionData;
let buttons = [];

var database;

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
  
  const firebaseConfig = {
    apiKey: "AIzaSyBxX3SNpcAL4K7ozvNJaDLb9rf56N2dFxw",
    authDomain: "contextquiz.firebaseapp.com",
    projectId: "contextquiz",
    storageBucket: "contextquiz.appspot.com",
    messagingSenderId: "663231691504",
    appId: "1:663231691504:web:9cdeee86d9f3d8ea32e035",
    databaseURL: "https://contextquiz-default-rtdb.firebaseio.com/"
  };
  firebase.initializeApp(firebaseConfig);
  console.log(firebase);

  database = firebase.database();

}

function draw() {
  background("#fff");
  if(quizMode){
    showQuiz();
  }else{
    showResults();
  }


}


function showResults(){

  textSize(28);  
  textAlign(CENTER);  
  fill("#89867e")
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


function pushResults(){
  let dbScore = 0;
  let dbData = {};
  let q = {};
  for(let i = 0; i < resultTable.length; i++){
    q['correct'] = resultTable[i][0];

    q['correct_answer'] = resultTable[i][1];
    q['chosen_answer'] = resultTable[i][2];

    q['correct_id'] = questionData.photos[i].CORRECT;
    q['chosen_id'] = responses[i];

    if(q['correct_id'] == responses[i]){
      dbScore++;
    }

    dbData['Question ' + i] = q;
    q = {};
  }


  dbData['score'] = dbScore;
  database.ref('results').push(dbData);
}

function showQuiz(){

  imageMode(CENTER);
  
  showScore();

  showQuestionNumber();

  line(windowWidth*.25, windowHeight/10 * 4.25 + windowHeight/6, .75 * windowWidth, windowHeight/10 * 4.25 + windowHeight/6)

  showButtons();

  showPhoto();
}


function showScore(){
  textAlign(CENTER);
  textSize(23);  
  fill("#89867e");
  text("Score: " + score, 50, 50);
}

function showQuestionNumber(){
  textSize(28);  
  textAlign(CENTER);  
  fill("#89867e")
  text("Question " + (questionNo + 1), windowWidth / 2, windowHeight/10);

  textSize(22);
  text("Pick the most appropriate caption", windowWidth / 2, windowHeight / 2 + 1.5* windowHeight/10);

}
function showPhoto(){
  let height = windowHeight/10 * 4;
  let start = windowHeight / 6;
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
      .position(windowWidth/2, windowHeight / 10 * (7 + i))
      .mouseClicked(function(){ changeImg(i); }).size(windowWidth / 1.5 , windowHeight/15).center('horizontal');
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
    pushResults();
  }else{
    questionNo++;
    refresh();}

  clear();
  
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for(let i = 0; i < buttons.length; i++){
    buttons[i].position(windowWidth/2, windowHeight / 10 * (7 + i)).center('horizontal');
  }
}