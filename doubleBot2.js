/*
 * CSGO Double Bot
 * Author: Dominik Downarowicz
 *
 */
 
 //VAR
 
var baseBetPercentage = 0.05; //Betting Amount -> Percentage of your balance e.g. 2
var minAmount = 1; //Min Coins on your Account
var maxLoseStreak = 7; //Max Lose Streak
var antiBankruptcy = true;
var antiLoseStreak = true;
 
 
var currBetAmount = 0;
var currBetColor = 'r'; //Betting color -> 'r' - RED; 'b' - BLACK; 'g' - GREEN
var loseStreak = 0;
var skipBet = false;
var wonLastBet = true;
var running = false;
var status = 0;
var betOnThisRound = false;
var checkedIfWon = false;
var rolled = false;
var checkedIfWon = false;
 
var statusBanner = document.getElementById("banner");
var redBetButton = document.getElementsByClassName("betButton")[0];
var greenBetButton = document.getElementsByClassName("betButton")[1];
var blackBetButton = document.getElementsByClassName("betButton")[2];
var betAmountInput = document.getElementById("betAmount");
var balanceSpan = document.getElementById("balance");
 
//END
 
 
 
//AUTO RECONNECT
console.log('%c[dBOT] Autoverbinden geladen.!', 'color:green');
setInterval(function() {
  if (!WS) {
    console.log('Neuverbinden...');
    connect();
  }
}, 5000);
//END
 
 
//SETUP UI
 
var html = '<input type="button" class="btn btn-success" id="startBtn" value="Starten"><br/><input type="button" class="btn btn-danger" id="stopBtn" value="Stoppen"><hr/><input type="button" class="btn btn-info" id="redBtn" value="ROT"><input type="button" class="btn btn-info" id="blackBtn" value="SCHWARZ"><input type="button" class="btn btn-info" id="greenBtn" value="GRÜN">';
var ui = document.createElement('div');
 
 
 
ui.innerHTML = html;
 
var insert = document.getElementsByClassName("progress")[0];
insert.parentNode.insertBefore(ui, insert);
 
var startBtn = document.getElementById('startBtn');
var stopBtn = document.getElementById('stopBtn');
var redBtn = document.getElementById('redBtn');
var blackBtn = document.getElementById('blackBtn');
var greenBtn = document.getElementById('greenBtn');
 
//END
 
 
//LISTENER
startBtn.onclick = function() {
    if(!running){
        running = true;
        console.log('%c[dBOT] Der Bot wird gestartet!', 'color:green');
 
        redBtn.disable = true;
        blackBtn.disable = true;
        greenBtn.disable = true;
        startBtn.disable = true;
        stopBtn.disable = false;
 
    }
 
};
 
stopBtn.onclick = function(){
    if(running){
        running = false;
        console.log('%c[dBOT] Der Bot wird gestoppt!', 'color:green');
 
        redBtn.disable = false;
        blackBtn.disable = false;
        greenBtn.disable = false;
        startBtn.disable = false;
        stopBtn.disable = true;
 
        currBetAmount = 0;
        //currBetColor = 'r';
        loseStreak = 0;
        skipBet = false;
        wonLastBet = true;
        running = false;
        status = 0;
        betOnThisRound = false;
        checkedIfWon = false;
        rolled = false;
        checkedIfWon = false;
 
    }
};
 
redBtn.onclick = function(){
    if(!running){
        currBetColor = 'r';
        console.log('%c[dBOT] Farbe: ROT!', 'color:green');
    }else{
        console.log('%c[dBOT] Du musst den Bot zuerst stoppen!', 'color:green');       
    }
 
};
 
blackBtn.onclick = function(){
    if(!running){
        currBetColor = 'b';
        console.log('%c[dBOT] Farbe: SCHWARZ!', 'color:green');
    }else{
        console.log('%c[dBOT] Du musst den Bot zuerst stoppen!', 'color:green');       
    }
 
};
 
greenBtn.onclick = function(){
    if(!running){
        currBetColor = 'g';
        console.log('%c[dBOT] Farbe: GRÜN!', 'color:green');
    }else{
        console.log('%c[dBOT] Du musst den Bot zuerst stoppen!', 'color:green');       
    }
};
 
 
 
 
//END
 
//FUNCTIONS
 
function getBalance(){
    return balanceSpan.innerHTML;
}
 
function checkStatus(){
    //1 // Rolling // ***ROLLING***
    //2 // Betting // Rollin in XX.XX...
    //3 // Rolled // CSGODouble rolled 3!
    //4 // Confirming // Confirming 1000/1000 total bets
    return statusBanner.innerHTML;
}
 
function sleep(x) {
  return (new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve();
    }, x);
  }));
}
 
function bet(amount, rgb) {
  switch (rgb) {
    case 'r':
      sleep(1000).then(function() {
        betAmountInput.value = amount;
        redBetButton.click();
      });
      break;
    case 'g':
      sleep(5000).then(function() {
        betAmountInput.value = amount;
        greenBetButton.click();
      });
      break;
    case 'b':
      sleep(1000).then(function() {
        betAmountInput.value = amount;
        blackBetButton.click();
      });
      break;
  }
 
}
 
function getColorFromNumber(number) {
  if (number == 0)
    return 'g';
  else if (number >= 1 && number <= 7)
    return 'r';
  else if (number >= 8 && number <= 14)
    return 'b';
}
 
function toSignedInt(number) {
  if (number > 0)
    return "+" + number;
 
  return number
}
 
function calculateBetAmount(balance){
    var x = (balance/100)*baseBetPercentage;
    return x;
}
 
//END
 
//MAIN LOOP
 
setInterval(function(){
    if(running){
        var fullStatus = checkStatus();
 
        switch (fullStatus.substring(0, 2)) {
          case "**":
            rolled = true;
            status = 1;
            break;
     
          case "Ro":
            if (betOnThisRound && rolled) {
              betOnThisRound = false;
              checkedIfWon = false;
              rolled = false;
            }
            status = 2;
            break;
     
          case "CS":
            status = 3;
            break;
     
          case "Co":
            status = 4;
            break;
     
          default:
            status = 0;
            break;
        }
 
 
        if(!betOnThisRound && status == 2){
            skipBet = false;
            if(antiBankruptcy){
                if(getBalance() <= minAmount){
                    skipBet = true;
                    console.log("%c[dBot] Geld limit erreicht!!!", "color:green;");
                }
            }
 
            if(antiLoseStreak){
                if(loseStreak >= maxLoseStreak){
                    skipBet = true;
                    console.log("%c[dBot] Du hast zu viel Pech!!!", "color:green;");
                    console.log("%c[dBot] Zurücksetzen", "color:green;");
                    currBetAmount = calculateBetAmount(getBalance());
                    skipBet = false;
                }
            }
 
 
            if(!skipBet){
                if(!rolled){
                    if(!checkedIfWon){
                        //BET AMOUNT
                        tmpAmount = 0;
                        if(wonLastBet){
                            tmpAmount = calculateBetAmount(getBalance());
                            tmpAmount = parseInt(tmpAmount);
                            if(tmpAmount < 1){
                                tmpAmount = 1;
                            }
                        }else{
                            tmpAmount = currBetAmount * 2;
                        }
 
                        //BETTING
                        currBetAmount = tmpAmount;
                        bet(currBetAmount, currBetColor);
                        betOnThisRound = true;
                        console.log("%c[dBot] Die Wette wurde gesetzt. Viel Glück!!!", "color:green;");
                    }
                }
            }
 
        }
 
 
        if(!checkedIfWon && betOnThisRound && status == 3){
            if(currBetColor == getColorFromNumber(checkStatus().substring(18, checkStatus().length - 1))){
                //WIN
                wonLastBet = true;
                loseStreak = 0;
                console.log("%c[dBot] WIN", "color:blue;");
            }else{
                //LOST
                wonLastBet = false;
                loseStreak = loseStreak + 1;
                console.log("%c[dBot] LOST", "color:red;");
            }
 
            checkedIfWon = true;
        }
    }
}, 1000);
//END