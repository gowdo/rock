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
  window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

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
    if(!window.mobilecheck()){
      alert("This is a mobile game.");
    }
    $$("help_pane").style.display = "block";
    $$("ok_container").addEventListener("click", (function(){
                                                    $$("help_pane").style.display = "none";
                                                    $$("game_pane").style.display = "block";
                                                    this.start();
                                                  }).bind(this));
    //this.start();
  }

  RockGame.prototype.start = function(){
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