// ==UserScript==
// @name         EV Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculates the EV of a combo bet on blaseball.com
// @author       BlackHumor
// @match        https://www.blaseball.com/bets/new
// @icon         https://www.google.com/s2/favicons?domain=blaseball.com
// @grant        none
// ==/UserScript==

(function() {
    var config = { childList: true, subtree: true, characterData:true};
    var targetNode = document.getElementsByClassName("Main")[0];
    var newDiv = document.createElement("DIV");
    var divText = document.createTextNode("");
    // alert(targetNode.length);
    var callback = function(mutationsList, observer){
        // console.log(mutationsList);
        for (var mutation of mutationsList){
            var textChanged = false;
            var outcomeAdded = false;
            if (mutation.type == "characterData") {
                textChanged = mutation.target.parentNode.className == "Bet-CloseUp-Outcome-Payout";
            } else if (mutation.type == "childList"){
                if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className == "Bet-CloseUp-Outcome-Desc"){
                    outcomeAdded = true;
                }
            }
            if (textChanged){
//                 console.log("textChanged");
//                 console.log(mutation);
                var payoutDiv = mutation.target.parentNode;
                var outcomeBox = payoutDiv.parentNode;
                var winPercentDiv = outcomeBox.firstChild;

            } else if (outcomeAdded){
//                 console.log("outcomeAdded");
//                 console.log(mutation);
                outcomeBox = mutation.addedNodes[0].previousSibling;
                winPercentDiv = outcomeBox.firstChild;
                payoutDiv = outcomeBox.lastChild;
            }
            if (textChanged || outcomeAdded){
                var EV = winPercentDiv.firstChild.data / 100 * payoutDiv.firstChild.data;
                // console.log(EV);
                divText.textContent = "EV: " + EV.toFixed(3);
                newDiv.appendChild(divText);
                outcomeBox.appendChild(newDiv);
            }
        }

        // newDiv.appendChild(divText);
        // outcomeBox.appendChild(newDiv);
//         } catch {
//             console.log("Error!");
//         }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();
