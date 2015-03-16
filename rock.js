/*
 * Author: James Gowdy
 * https://github.com/gowdo/rock
 * License: MIT license
 */

(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return factory(global, global.document);
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(global, global.document);
  } else {
    global.RockGame = factory(global, global.document);
  }
}(typeof window !== 'undefined' ? window : this, function(window, document) {
  function $$(id) {
    return document.getElementById(id);
  }
  function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }
  var HAND = {ROCK:0,PAPER:1,SCISSORS:2};

  function RockGame(options) {

    this.options = {};
    this.buttons = [];
    this.userHand = 0;
    this.shakeCount = 0;
    this.hands = [
      {
        name:"Rock", 
        pic: "images/rock.png"
      },
      {
        name:"Paper", 
        pic: "images/paper.png"
      },
      {
        name:"Scissors", 
        pic: "images/scissors.png"
      }];

    if(typeof options === "object") {
      for (var i in options) {
        if (options.hasOwnProperty(i)) {
          this.options[i] = options[i];
        }
      }
    }
    this.init();
  }

  RockGame.prototype.init = function(){
    var that = this;
    var buttons = $$("buttons_container").getElementsByTagName("div");
    for(var b=0;b<buttons.length;b++){
      //buttons[b].addEventListener("click", (function(bIn){
      buttons[b].addEventListener("touchstart", (function(bIn){
                                                            return (function(){
                                                              that.buttonPress(bIn);
                                                            });
                                                          })(b));
      this.buttons.push(buttons[b]);
    }

    var myShakeEvent = new Shake({
        threshold: 5,
        timeout: 200
    });
    myShakeEvent.start();
    window.addEventListener('shake', this.shake.bind(this), false);

  };

  RockGame.prototype.buttonPress = function(b){
    //console.log(b);
    this.userHand = b;
    for(var i=0;i<this.buttons.length;i++){
      this.buttons[i].className = "button"+i+" button";
    }
    this.buttons[b].className = "button"+b+"_pressed button button_pressed";
    $$("you_result").innerHTML = "<div class='button"+this.userHand+" button' />"
    //this.displayResult(2,2);
  };

  RockGame.prototype.shake = function(){
    this.shakeCount++;
    var txt = "";
    txt += this.shakeCount;
    if(this.shakeCount > 2){
      this.shakeCount = 0;
      this.finish();
    }
    else{
      $$("npc_result").innerHTML = "?";
      //$$("you_result").innerHTML = "?";
      $$("game_result_text").innerHTML = this.shakeCount;
    }
  };


  RockGame.prototype.finish = function(){
    var npc = this.getNPCsHand();
    var win = 0;
    //txt += "NPC: "+this.hands[npc].name+"<br />";
    //txt += "You: "+this.hands[this.userHand].name+"<br />";

    if(typeof this.userHand === "undefined"){
    }
    else if(npc === this.userHand){
    }
    else if(npc === HAND.ROCK && 
            this.userHand === HAND.PAPER) {
      win = 1;
    }
    else if(npc === HAND.ROCK && 
            this.userHand === HAND.SCISSORS) {
      win = 1;
    }

    else if(npc === HAND.PAPER && 
            this.userHand === HAND.ROCK) {
      win = 2;
    }
    else if(npc === HAND.PAPER && 
            this.userHand === HAND.SCISSORS) {
      win = 1;
    }

    else if(npc === HAND.SCISSORS && 
            this.userHand === HAND.ROCK) {
      win = 1;
    }
    else if(npc === HAND.SCISSORS && 
            this.userHand === HAND.PAPER) {
      win = 2;
    }
    this.displayResult(npc, this.userHand, win);
  };

  RockGame.prototype.getNPCsHand = function(){
    return randomIntFromInterval(0,2);
  };

  RockGame.prototype.displayResult = function(npc, you, win){
    //$$("npc_result").innerHTML = "<img src='"+this.hands[npc].pic+"' />"
    //$$("you_result").innerHTML = "<img src='"+this.hands[you].pic+"' />"
    $$("npc_result").innerHTML = "<div class='button"+npc+" button' />"
    $$("you_result").innerHTML = "<div class='button"+you+" button' />"
    var txt = "";
    if(win === 0){
      txt = "Draw";
    }
    else if(win === 1){
      txt = "You Win";
    }
    else if(win === 2){
      txt = "You Lose";
    }
    $$("game_result_text").innerHTML = txt;
  };


return RockGame;
}));