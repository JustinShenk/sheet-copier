chrome.runtime.onInstalled.addListener(d => {
    chrome.storage.sync.get(["acceptedRisks", "settings", "pluginSettings"], res => {
        if (!res.acceptedRisks) {
            chrome.tabs.create({ url: chrome.extension.getURL("options.html") + "?fullpage=1" });
        }

				if (!res.pluginSettings) {
					let pluginSettings = {};
					if (res.settings) {
							// it needs an update!
							const settings = JSON.parse(res.settings);
							pluginSettings = {
                    open_copyable_sheet: {
											enabled: true,
                    },
									};
							} else {
								// it"s a fresh install, load the defaults
								pluginSettings = {
									open_copyable_sheet: {
                        enabled: true
                    },
									};
					}
					chrome.storage.sync.set({
							pluginSettings: JSON.stringify(pluginSettings)
					});
				} else {
	          let pluginUpdated = false;
	          const pluginSettings = JSON.parse(res.pluginSettings);

	          // new plugins
	          if (pluginSettings.open_copyable_sheet === undefined) {
	              pluginUpdated = true;
	              pluginSettings.open_copyable_sheet = { enabled: true };
	          }

	          if (pluginUpdated) {
	              chrome.storage.sync.set({
	                  pluginSettings: JSON.stringify(pluginSettings)
	              });
	          }
        }
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "slackPageOpened") {
        chrome.pageAction.show(sender.tab.id);
    } else if (request.type === "closeThisTab") {
        chrome.tabs.remove(sender.tab.id);
    };
});


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
            $("#openEditableSheetURL").html(`<a href="${targetURL}">Click Me</a>`);
            chrome.browserAction.onClicked.addListener(function(activeTab){
              chrome.tabs.create({ url: targetURL });
            });
        } else {
            alert(`URL is not a google sheet: ${url}`);
        }        
    });
  };

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);

  if (command === "open-copyable-sheet") {
    chrome.tabs.executeScript({
      code: `
      function openCopyableSheet() {
        var tab = tabs[0];
        const url = tab.url;
        console.log('Url', url);

        // check if is a sheet
        const isSheet = url.includes("sheets.google.com");
        if (!isSheet) {
            error = "URL is not a google sheet: " + url;
            console.log(error);
            alert(error);            
            return;
        };
        if (!url.includes("/d/")) {
          error = "URL is not a google sheet: " + url;
          console.log(error);
          alert(error);          
          return;
        };
        
        var sheetId = url.split("/d/")[1];
        if (sheetId === undefined) {
          alert("URL split failed on " + url);
          return;
        };
        sheetId = sheetId.split("/edit")[0];
        
        targetURL = "https://docs.google.com/spreadsheets/d/" + sheetId + "/preview";
        console.log(targetURL);        
        chrome.browserAction.onClicked.addListener(function(activeTab){
          chrome.tabs.create({ url: targetURL }); 
        });
      };
      `
    });
  }
});