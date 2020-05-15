chrome.runtime.onInstalled.addListener(d => {
    chrome.storage.sync.get(["acceptedRisks", "settings", "pluginSettings"], res => {        
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
    if (request.type === "closeThisTab") {
        chrome.tabs.remove(sender.tab.id);
    };
});


 /**
   * Get URL for copyable sheet.
   *
   */
  function getURL(){
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function(tabs) {
        // and use that tab to fill out title and url
        var tab = tabs[0];
        const url = tab.url;        
        if (url.includes("/d/")) {
            const id = url.split("/d/")[1].split("/")[0];        
            targetURL = `https://docs.google.com/spreadsheets/d/${id}/preview`;
            console.log(targetURL);
            $("#openEditableSheetURL").html(`<a href="${targetURL}">Click Me</a>`);
            chrome.browserAction.onClicked.addListener(function(activeTab){
              chrome.tabs.create({ url: targetURL });
            });
        } else {
            alert(`URL is not a Spreadsheet: ${url}`);
        }        
    });
  };