 /**
   * When a user clicks the button, this method is called: it reads the current
   * state of `timeframe_` in order to pull a timeframe, then calls the clearing
   * method with appropriate arguments.
   *
   * @private
   */
  function getURL(){
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        const url = tab.url;
        // TODO: check if is a sheet        
        if (url.includes("/d/")) {
            const id = url.split("/d/")[1].split("/")[0];        
            targetURL = `https://docs.google.com/spreadsheets/d/${id}/preview`;
            console.log(targetURL);
            $("#duplicateSheetURL").html(`<a href="${targetURL}">Click Me</a>`);
            // chrome.browserAction.onClicked.addListener(function(activeTab){
            chrome.tabs.create({ url: targetURL });
            // });
        } else {
            alert(`URL is not a google sheet: ${url}`);
        }        
    });
  }

  

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('copySheet');

    document.getElementById("duplicateSheetBtn").addEventListener("click", getURL);
  });