/*
 * Author: James Gowdy
 * https://github.com/gowdo/rock
 * License: MIT license
 */

define(["shake", "mobilecheck"], function(Shake, mobilecheck){
  /* quick element selector */
  function $$(id) {
    return document.getElementById(id);
  }

  /* so we can keep track of what these numbers mean */
  var HAND = {ROCK:0, PAPER:1, SCISSORS:2};

  /* game contructor */
  function RockGame(options) {
    /* we don't have any options, but it's good practice*/
    this.options = {};
    if(typeof options === "object") {
      for (var i in options) {
        if (options.hasOwnProperty(i)) {
          this.options[i] = options[i];
        }
      }
    }

    /* vars */
    this.buttons = [];
    this.userHand = -1;
    this.shakeCount = 0;

    /* we don't want this working on a desktop.
       Future version could have a timer,
       but for now we just want mobile shakes to power it. */
    if(!window.mobilecheck()){
      $$("mobilecheck_pane").style.display = "block";
    }else {
      /* display the welcome pane */
      $$("help_pane").style.display = "block";
      $$("ok_container").addEventListener("click", (function(){
                                                      this.reset();
                                                      this.start();
                                                    }).bind(this));
      $$("play_again_container").addEventListener("click", (function(){
                                                      this.reset();
                                                    }).bind(this));
    }
  }

  RockGame.prototype.reset = function(){
    $$("help_pane").style.display = "none";
    $$("game_pane").style.display = "block";
    $$("play_again_container").style.display = "none";
    $$("npc_result").innerHTML = "?";
    $$("you_result").innerHTML = "?";
    $$("game_result_text").innerHTML = "<br />Hold a hand and shake";
    this.buttonPress(-1);
  };

  /* on PLAY click we can contruct the game */
  RockGame.prototype.start = function(){
    var that = this;
    var buttons = $$("buttons_container").getElementsByTagName("div");
    /*  loop over each button, adding a touchstart event.
        using this rather than click because it behaves better on mobile. 
        using a closure to trap the button index in the call to the buttonPress function */
    for(var b=0;b<buttons.length;b++){
      buttons[b].addEventListener("touchstart", (function(bIn){
                                                            return (function(){
                                                              that.buttonPress(bIn);
                                                            });
                                                          })(b));
      this.buttons.push(buttons[b]);
    }

    /* instantiate a new Shake object.
       this brillant function (courtesy of Alex Gibson) captures the shaking events */
    var myShakeEvent = new Shake({
        threshold: 5,
        timeout: 200
    });
    myShakeEvent.start();
    /* on a shake, call our shake function, binding to our this */
    window.addEventListener('shake', this.shake.bind(this), false);

  };

  /* when a hand is chosen, change the class to show a grey version.
     we can't use :hover or :active here because we're using a touchstart event */
  RockGame.prototype.buttonPress = function(b){
    //console.log(b);
    this.userHand = b;
    for(var i=0;i<this.buttons.length;i++){
      this.buttons[i].className = "button"+i+" button";
    }
    if(this.userHand >= 0){
      this.buttons[b].className = "button"+b+"_pressed button button_pressed";
      $$("you_result").innerHTML = "<div class='button"+this.userHand+" button' />";
      $$("npc_result").innerHTML = "?";
      this.shakeText();
    }
  };

  /* when the phone is shaken increment a counter. if it's the third shake, finish the game. */
  RockGame.prototype.shake = function(){
    if(this.userHand >=0){
      this.shakeCount++;
      var txt = "";
      txt += this.shakeCount;
      if(this.shakeCount > 2){
        this.shakeCount = 0;
        this.finish();
      }
      else{
        $$("npc_result").innerHTML = "?";
        this.shakeText();
      }
    }
  };

  /* as the shakes increment, colour the text to show which count we're on */
  RockGame.prototype.shakeText = function() {
    var txt =  "";
    if(false&&this.shakeCount === 0){
      txt += "<span style='color:#FF0000'>Shake: </span>";
    }
    else{
      txt += "Shake: ";
    }
    for(var i=1;i<=3;i++){
      if(this.shakeCount === i){
        txt += "<span style='color:#FF0000;font-weight:bold;'>"+i+"</span>";
      }else{
        txt += i;
      }
      txt += "..";
    }
    $$("game_result_text").innerHTML = txt;
  };

  /* on the third shake, run this function to work our who the winner is. */
  RockGame.prototype.finish = function(){
    /* get a random number between 0 and 2 for the computer's choice*/
    var npc = this.getNPCsHand();
    var winner = 0;

    if(typeof this.userHand === "undefined"){
    }
    else if(npc === this.userHand){
      /* it's a draw, leave the winner as 0*/
    }
    else if(npc === HAND.ROCK && 
            this.userHand === HAND.PAPER) {
      winner = 1;
    }
    else if(npc === HAND.ROCK && 
            this.userHand === HAND.SCISSORS) {
      winner = 2;
    }

    else if(npc === HAND.PAPER && 
            this.userHand === HAND.ROCK) {
      winner = 2;
    }
    else if(npc === HAND.PAPER && 
            this.userHand === HAND.SCISSORS) {
      winner = 1;
    }

    else if(npc === HAND.SCISSORS && 
            this.userHand === HAND.ROCK) {
      winner = 1;
    }
    else if(npc === HAND.SCISSORS && 
            this.userHand === HAND.PAPER) {
      winner = 2;
    }
    this.displayResult(npc, this.userHand, winner);
  };

  /* random number generator used for the computers choice */
  RockGame.prototype.getNPCsHand = function(){
    var min = 0,
        max = 2;
    return Math.floor(Math.random()*(max-min+1)+min);
  };

  /* display the two hand choices and some result text.*/
  RockGame.prototype.displayResult = function(npc, you, winner){
    $$("npc_result").innerHTML = "<div class='button"+npc+" button' />";
    $$("you_result").innerHTML = "<div class='button"+you+" button' />";
    var txt = "";
    if(winner === 0){
      txt = "Draw";
    }
    else if(winner === 1){
      txt = "You Win!";
    }
    else if(winner === 2){
      txt = "You Lose";
    }
    $$("game_result_text").innerHTML = txt;
    $$("play_again_container").style.display = "block";
    this.userHand = -1;
  };
return RockGame;
});