let questionNo = 0;
let questionUrls = ["sicily.png", "kentucky.png"];
let Q_COUNT;
let imgs = [];
let answers = [[]]
let WIDTH;
let HEIGHT;

let questionData;

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
  WIDTH = windowWidth;
  HEIGHT = windowHeight;
  

}

function draw() {
  background("#222");
  imageMode(CENTER);
  
  showQuestionNumber();


  showButtons();

  showPhoto();


}



function showQuestionNumber(){
  textSize(28);  
  textAlign(CENTER);  
  fill("#FFF")
  text("Question " + (questionNo + 1), windowWidth / 2, windowHeight/5);

}
function showPhoto(){
  image(imgs[questionNo], WIDTH/2, HEIGHT/2, 300, 200);
}

function showButtons(){
  console.log(questionData.labelCount);
  // for(let i = 0; i < questionData.labelCount; i++){

  // }
  let name = "";
  for(let i = 0; i < questionData.labelCount; i++){
    name = questionData.photos[questionNo].LABELS[i];
    createButton(name, "label" + i)
      .position(0, i * 50)
      .mousePressed(changeImg(i))
    console.log(i);
  }
}


function changeImg(id){
  // questionNo++;
  console.log(id);
  // clear();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}