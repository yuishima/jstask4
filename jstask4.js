"use strict";
//id取得
const headLine = document.getElementById("headLine");
const gameStartButton = document.getElementById("start");
const genreElement = document.getElementById("genre");
const difficultyElement = document.getElementById("difficulty");
const containerElement = document.getElementById("container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const resultElement = document.getElementById("result");
const restartButton = document.getElementById("restart");
//API URL
const apiUrl = "https://opentdb.com/api.php?amount=10";
//"以下のボタンをクリック"を表示
containerElement.hidden = true;
questionElement.textContent = "以下のボタンをクリック";
restartButton.hidden = true;
//クリックしたらクイズ情報の取得をする
gameStartButton.addEventListener('click', () => {
  const test = new QuizData(apiUrl);
});
//Restartボタンが押されたらクイズをもう一回初めからやる
restartButton.addEventListener('click', () => {
  const test = new QuizData(apiUrl);
});

//gameArrayオブジェクト
//quizes 取得した問題のデータを入れている配列達
//index　今何問目？
//correctAnswerCount正解数カウント
class QuizData {
  gameArray = {
    quizes: [],
    index: 0,
    correctAnswerCount: 0,
  };
  constructor(apiUrl){
    headLine.textContent = "取得中・・・";
    questionElement.textContent = "少々お待ちください";
    resultElement.textContent = "";
    restartButton.hidden = true;
    gameStartButton.hidden = true;
    console.log(apiUrl);
    this.apiUrl = apiUrl;
    //API取得
    fetch(apiUrl)
      .then((response) => response.json())
      .then((quizData) => {
        //クイズデータの取得、gameArrayの中身リセット
        this.gameArray.quizes = quizData.results;
        this.gameArray.index = 0;
        this.gameArray.correctAnswerCount = 0;
        console.log(this.gameArray);
        this.countQuiz();
      })
      .catch((error) => console.log(error));
  };
  //クイズがいま何問目かを判断し10問目以下なら出題ファンクション、10問目以上だったらリザルト画面を表示するゾッド
  countQuiz() {
    if (this.gameArray.quizes.length > this.gameArray.index) {
      questionElement.hidden = false;
      questionElement.textContent = this.gameArray.quizes[this.gameArray.index].question;
      this.setQuiz();
    } else {
      this.finishQuiz();
    };
  };
  //表示要素を表示　makeQuizの呼び出し
  setQuiz() {
    containerElement.hidden = false;
    questionElement.hidden = false;
    genreElement.hidden = false;
    difficultyElement.hidden = false;
    const countQuestion = this.gameArray.index + 1;
    headLine.textContent = "問題" + countQuestion;
    questionElement.textContent = this.gameArray.quizes[this.gameArray.index].question;
    genreElement.textContent ="[ジャンル]" + this.gameArray.quizes[this.gameArray.index].category;
    difficultyElement.textContent ="[難易度]" + this.gameArray.quizes[this.gameArray.index].difficulty;
    this.makeAnswer(this.gameArray.quizes);
  };
  makeAnswer(quizLength) {
    const correctAnswer = quizLength[this.gameArray.index].correct_answer;
    const incorrectAnswers = quizLength[this.gameArray.index].incorrect_answers;
    const answers = incorrectAnswers.concat(correctAnswer);
    this.suffleAnswers(answers);
    //配列数の分だけ解答ボタンを作る
    for (let i = 0; i < answers.length; i++) {
      const liElement = document.createElement("li");
      const buttonElement = document.createElement("button");
      buttonElement.textContent = answers[i];
      answersElement.appendChild(buttonElement);
      answersElement.appendChild(liElement);
      //解答の正偽判定
      buttonElement.addEventListener("click", (event) => {
        if (event.target.textContent === quizLength[this.gameArray.index].correct_answer) {
          this.gameArray.correctAnswerCount++;
        };
        this.gameArray.index++;
        this.removeAnswers();
      });
    };
  };
  //次の問題に行くときに　前の問題の回答欄を消す
  removeAnswers() {
    while (answersElement.firstChild) {
      answersElement.removeChild(answersElement.firstChild);
    };
    this.countQuiz();
  };
  //10問目が終わったら表示されるリザルト画面
  finishQuiz() {
    headLine.textContent = "あなたの正当数は" + this.gameArray.correctAnswerCount + "です！！";
    containerElement.hidden = true;
    restartButton.hidden = false;
    questionElement.textContent = "再チャレンジしたい場合は以下をクリック！";
    genreElement.hidden = true;
    difficultyElement.hidden = true;
  };
  //配列の中身をランダムソートする
  //参考記事
  //https://www.nxworld.net/tips/js-array-shuffle.html
  suffleAnswers(answers) {
    for (let i = answers.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    };
    return answers;
  };
};