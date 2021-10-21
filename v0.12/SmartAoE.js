const SmartAoE = (() => {
    const scriptName = "SmartAoE";
    const version = '0.12';
    const schemaVersion = '0.1';
    const byTOKEN = 'TOKEN';
    const byPATH = 'PATH';
    const clearTOKEN = 'TOKEN';
    const clearALL = 'ALL';
    const CONTROL_TOK_NAME = 'AOEControlToken'
    
    var cardParameters = {};
    var tokenMarkerURLs = {};
    
    const defaultParameters = {
		whisper: false,
		tableborder: "2px solid #000000;",
		tablebgcolor: "#EEEEEE",
		tableborderradius: "6px;", 
		tableshadow: "5px 3px 3px 0px #aaa;",
		title: "SmartAoE",                  
		titlecardbackground: "linear-gradient(red, yellow)",  
		titlecardbottomborder: "2px solid #444444;",
		titlefontface: "Contrail One",
		titlefontsize: "1.2em",
		titlefontlineheight: "1.2em",
		descriptiontext: "",
		//lineheight: "2em",
		lineheight: "normal",
		titlefontcolor: "#EEEEEE",
		subtitlefontsize: "13px",
		subtitlefontface: "Tahoma",
		subtitlefontcolor: "#333333",
		subtitleseperator: " &" + "#x2666; ",
		tooltip: "Sent by ScriptCards",
		bodyfontsize: "14px;", 
		bodyfontface: "Helvetica",
		oddrowbackground: "#FFFFFF",                    
		//oddrowbackground: "#FEF68E",
		evenrowbackground: "#DDDDDD",
		oddrowfontcolor: "#000000",
		evenrowfontcolor: "#000000",
		imageonnewline: false,
		whisper: "",
		emotetext: "",
		sourcetoken: "",
		targettoken: "",
		emotebackground: "#f5f5ba",
		emotefont: "font-family: Georgia, serif; font-weight: bold; ",
		emotestate: "visible",
		rollfontface: "helvetica",
		leftsub: "",
		rightsub: "",
		sourcecharacter: "",
		targetcharacter: "",
		debug: 0,
		hidecard: "0",
		hidetitlecard: "0",
		showresultheader: "0",              //done
		imagewidth: 32,
		imageheight: 32,
		resizeinline: "1",
		dontcheckbuttonsforapi: "0",
		roundup: "0",
		buttonbackground: "#1C6EA4",
		buttontextcolor: "#FFFFFF",
		buttonbordercolor: "#999999",
		dicefontcolor: "#1C6EA4",
		dicefontsize: "3.0em",
		usehollowdice: "0",
		allowplaintextinrolls: "0",
		whisper: "",
		showfromfornonwhispers: "0",
		allowinlinerollsinoutput: "0",
		nominmaxhighlight: "0",
		disablestringexpansion: "0",
		disablerollvariableexpansion: "0",
		disableparameterexpansion: "0",
		disablerollprocessing: "0",
		disableattributereplacement: "0",
		disableinlineformatting: "0",
		styleTableTag: " border-collapse:separate; border: solid black 2px; border-radius: 6px; -moz-border-radius: 6px; ",
		styleNormal:" text-align: center; font-size: 100%; display: inline-block; font-weight: bold; height: 1em; min-width: 1.75em; margin-top: -1px; margin-bottom: 1px; padding: 0px 2px; border: 1px solid; border-radius: 3px; background-color: #FFFEA2; border-color: #87850A; color: #000000;",
		styleFumble: " text-align: center; font-size: 100%; display: inline-block; font-weight: bold; height: 1em; min-width: 1.75em; margin-top: -1px; margin-bottom: 1px; padding: 0px 2px; border: 1px solid; border-radius: 3px; background-color: #FFAAAA; border-color: #660000; color: #660000;",
		styleCrit: " text-align: center; font-size: 100%; display: inline-block; font-weight: bold; height: 1em; min-width: 1.75em; margin-top: -1px; margin-bottom: 1px; padding: 0px 2px; border: 1px solid; border-radius: 3px; background-color: #88CC88; border-color: #004400; color: #004400;",
		styleBoth: " text-align: center; font-size: 100%; display: inline-block; font-weight: bold; height: 1em; min-width: 1.75em; margin-top: -1px; margin-bottom: 1px; padding: 0px 2px; border: 1px solid; border-radius: 3px; background-color: #8FA4D4; border-color: #061539; color: #061539;",
	};
    
    let tableLineCounter = 0;
    let htmlTableEnd = `</table>`;
    let htmlTitleTemplate = `<div style="display: table; !{tableborder}; background-color: !{tablebgcolor}; width: 270px; text-align: left; border-radius: !{tableborderradius}; border-collapse: separate; box-shadow: !{tableshadow};margin-left:0px">` +
                              `<div style="display: table-header-group; background-image: !{titlecardbackground}; border-bottom: !{titlecardbottomborder};">` +
                                `<div style="display: table-row;">` +
                                  `<div style="display: table-cell; padding: 2px 2px; text-align: center; border-bottom: 2px solid #444444;">` +
                                    `<span style="font-family: !{titlefontface}; font-style:normal; font-size: !{titlefontsize}; line-height: !{titlefontlineheight}; font-weight: bold; color: !{titlefontcolor}; text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;">=X=TITLE=X=</span>` +
                                    `<br><span style="font-family: !{subtitlefontface}; font-variant: normal; font-size: !{subtitlefontsize}; font-style:normal; font-weight: bold; color: !{subtitlefontcolor}; ">=X=SUBTITLE=X=</span>` +
                                  `</div>` +
                                `</div>` +
                              `</div>`;
              
    
    let htmlTemplate = `<div style="display: table; border: !{tableborder}; background-color: !{tablebgcolor}; width: 100%; text-align: left; border-radius: !{tableborderradius}; border-collapse: separate; box-shadow: !{tableshadow};">` +
                            `<div style="display: table-header-group; background-image: !{titlecardbackground}; border-bottom: !{titlecardbottomborder};">` +
                                `<div style="display: table-row;">` +
                                    `<div style="display: table-cell; padding: 2px 2px; text-align: center; border-bottom: 2px solid #444444;">` +
                                        `<span style="font-family: !{titlefontface}; font-style:normal; font-size: !{titlefontsize}; line-height: !{titlefontlineheight}; font-weight: bold; color: !{titlefontcolor}; text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;">=X=TITLE=X=</span><br />` +
                                        `<span style="font-family: !{subtitlefontface}; font-variant: normal; font-size: !{subtitlefontsize}; font-style:normal; font-weight: bold; color: !{subtitlefontcolor}; ">=X=SUBTITLE=X=</span>` +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '<div style="display: table-row-group;">'
	
	let htmlTemplateHiddenTitle = `<div style="display: table; border: !{tableborder}; background-color: !{tablebgcolor}; width: 100%; text-align: left; border-radius: !{tableborderradius}; border-collapse: separate; box-shadow: !{tableshadow};">` +
	                                    `<div style="display: table-row-group;">`;
	let htmlRowTemplate = `<div style="display: table-row; =X=ROWBG=X=;"><div style="display: table-cell; padding: 0px 0px; font-family: !{bodyfontface}; font-style: normal; font-weight:normal; font-size: !{bodyfontsize}; "><span style="line-height: !{lineheight}; color: =X=FONTCOLOR=X=;">=X=ROWDATA=X=</span></div></div>`;
	let htmlTemplateEnd = `</div></div><br />`;
    
    
    const buildTitle = function (cardParameters) {
        var subtitle = "";
		if ((cardParameters.leftsub !== "") && (cardParameters.rightsub !== "")) {
			subtitle = cardParameters.leftsub + cardParameters.subtitleseperator + cardParameters.rightsub;
		}
		if ((cardParameters.leftsub !== "") && (cardParameters.rightsub === "")) {
			subtitle = cardParameters.leftsub;
		}
		if ((cardParameters.leftsub === "") && (cardParameters.rightsub !== "")) {
			subtitle = cardParameters.rightsub;
		}
		
		
        let output = `<div style="margin-left:-42px">` + 
                        `<div style="display: table; border: !{tableborder}; background-color: !{tablebgcolor}; width: 270px; text-align: left; border-radius: !{tableborderradius}; border-collapse: separate; box-shadow: !{tableshadow}">` +
                            `<div style="display: table-header-group; background-image: !{titlecardbackground}; border-bottom: !{titlecardbottomborder};">` +
                                `<div style="display: table-row;">` +
                                    `<div style="display: table-cell; padding: 2px 2px; text-align: center; border-bottom: 2px solid #444444;border-top-left-radius: !{tableborderradius};border-top-right-radius: !{tableborderradius};">` +
                                        `<span style="font-family: !{titlefontface}; font-style:normal; font-size: !{titlefontsize}; line-height: !{titlefontlineheight}; font-weight: bold; color: !{titlefontcolor}; text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;">${cardParameters.title}</span>` +
                                        `<br><span style="font-family: !{subtitlefontface}; font-variant: normal; font-size: !{subtitlefontsize}; font-style:normal; font-weight: bold; color: !{subtitlefontcolor}; ">${subtitle}</span>` +
                                    `</div>` +
                                `</div>` +
                            `</div>`
        //log(output);
        output = replaceStyleInformation(output, cardParameters);
        return output;
    }
    
    const buildDamageRow = function (damRoll1, damType1, hideformula, damRoll2="", damType2="", cardParameters) {
        //let damInline1 = makeInlineroll(damRoll1, hideformula);
        let rowBackground, fontColor;
        
        /*
        tableLineCounter += 1;
        if (tableLineCounter % 2 == 0) {
            rowBackground = cardParameters.evenrowbackground;
            fontColor = cardParameters.evenrowfontcolor;
        } else {
            rowBackground = cardParameters.oddrowbackground;
            fontColor = cardParameters.oddrowfontcolor;
        }
        */
        
        let rowData = `<td style="width:270px;padding:3px;line-height: !{lineheight};width:100%;vertical-align:middle;text-align:center;font-weight:bold; font-size:!{bodyfontsize}; font-family: !{bodyfontface}">` +
                        `<span>Dmg:</span>` +
                        `${damRoll1}` +
                        `<span>${damType1}</span>` +
                    `</td>`;
        
        if (damRoll2 !== "") {
            rowData = rowData + `<td style="width:270px;padding:3px;line-height: !{lineheight};width:100%;vertical-align:middle;text-align:center;font-weight:bold; font-size:!{bodyfontsize}; font-family: !{bodyfontface}">` +
                                    `<span>Dmg:</span>` +
                                    `${damRoll2}` +
                                    `<span>${damType2}</span>` +
                              `</td>`;
        }
        
        /*
        let output = `<table style="width:270px; border-collapse:collapse; table-layout:fixed; width 270px; font-size:!{bodyfontsize}; font-family: !{bodyfontface}; border-bottom: 2px solid #444444;">` +
                        `<tr style="background: ${rowBackground}; color:${fontColor}; text-align:center">${rowData}</tr>` +
                     `</table>`;
        */
        let output = `<table style="width:270px; border-collapse:collapse; table-layout:fixed; width 270px; font-size:!{bodyfontsize}; font-family: !{bodyfontface}; border-bottom: 2px solid #444444;">` +
                        `<tr style="background: !{tablebgcolor}; text-align:center">${rowData}</tr>` +
                     `</table>`;
        
        output = replaceStyleInformation(output, cardParameters);
        return output;
    }
    
    const buildSaveHeaderRow = function (cardParameters) {
        let rowBackground, fontColor;
        
        tableLineCounter += 1;
        if (tableLineCounter % 2 == 0) {
            rowBackground = cardParameters.evenrowbackground;
            fontColor = cardParameters.evenrowfontcolor;
        } else {
            rowBackground = cardParameters.oddrowbackground;
            fontColor = cardParameters.oddrowfontcolor;
        }
        
        let output = `<tr style="background: ${rowBackground}; color:${fontColor}; text-align:center;border-bottom: 1px solid #444444;">` +
                            `<td style="width:150px;padding:3px;width:85%;vertical-align:middle;text-align:left;font-weight:bolder;">Target</td>` +
                            `<td style="width:30px;text-align:center;font-weight:bold;padding: 2px 2px">Roll</td>` +
                            `<td style="width:40px;text-align:center; font-weight:bold; padding: 2px 2px">P/F?</td>` +
                            `<td style="width:50px;font-weight:bold; padding: 2px 2px">Dam.</td>` +
                        `</tr>`;
        output = replaceStyleInformation(output, cardParameters);
        return output;
    }
    
    const buildTableBody = function (saveHeaderRow, saveRows, descRow, cardParameters) {
        let rowBackground, fontColor;
        
        
        
        let output = `<table style="width:270px; border-collapse:collapse; table-layout:fixed; font-size:!{bodyfontsize}; font-family: !{bodyfontface}">` +
                        `${saveHeaderRow}` +
                        `${saveRows}` +
                        `${descRow}` + 
                     `</table></div></div>`;
        
        output = replaceStyleInformation(output, cardParameters);
        return output;
    }
    
    const buildSaveRow = function (imageURL, id, name, success, saveInline, hideforumula, dam, autoApply, bar, markerString, RVI, zeroHPmarker, cardParameters) {
        let result;
        let damString = dam.join('/');
        markerString = markerString.replace(/::/g,'%%')
        zeroHPmarker = zeroHPmarker.replace(/::/g,'%%')
        let applyDamLink = autoApply ? '' : ` href='!smartapply ${id} ${bar} ${damString} ${markerString} ${zeroHPmarker}'`;
        damString = damString.replace('/', ' / ');
        
        let RVI_output = '';
        if (RVI.length > 0) { 
            RVI_output = `<span style="font-size: 10px; vertical-align: super">${RVI}</span>` 
        }
        
        let rowBackground;
        let fontColor;
        tableLineCounter += 1;
        if (tableLineCounter % 2 == 0) {
            rowBackground = cardParameters.evenrowbackground;
            fontColor = cardParameters.evenrowfontcolor;
        } else {
            rowBackground = cardParameters.oddrowbackground;
            fontColor = cardParameters.oddrowfontcolor;
        }
        
        if (success) {
            result = `<td style="text-align:center"><a style="font-weight:bold;color:#ffffff;background:#3FB315;border:1px solid black;padding:2px;cursor:pointer"${applyDamLink}>P</a></td>`
        } else {
            result = `<td style="text-align:center"><a style="font-weight:bold;color:#ffffff;background:#b50e0c;border:1px solid black;padding:2px;cursor:pointer"${applyDamLink}>F</a></td>`
        }
        
        let output = `<tr style="background: ${rowBackground}; color:${fontColor}">` +
                        `<td style="padding:3px;height:25px">` +
                            `<div style ="float:left;">` +
                                `<a style="display:inline-block;vertical-align:middle;margin-right:4px;border-style:none;margin:0px;padding:0px;background: ${rowBackground}; cursor:pointer;" href="!smartpinggm ${id}">` +
                                    `<img style ="height:25px;width:25px;" src ="${imageURL}"></img>` +
                                `</a>` +
                            `</div>` +
                            `<span style="vertical-align:middle;font-weight:bolder">${name}</span>` + RVI_output + 
                        `</td>` +
                        `<td style="text-align:center">` +
                            `${saveInline}` +
                        `</td>` +
                        `${result}` +
                        `<td style="text-align:center; font-weight:bold">${damString}</td>` +
                     `</tr>`;
        
        output = replaceStyleInformation(output, cardParameters);
        
        return output;
    }
    
    const buildDescRow = function (descText, cardParameters) {
        let rowBackground;
        let fontColor;
        
        /*
        tableLineCounter += 1;
        if (tableLineCounter % 2 == 0) {
            rowBackground = cardParameters.evenrowbackground;
            fontColor = cardParameters.evenrowfontcolor;
        } else {
            rowBackground = cardParameters.oddrowbackground;
            fontColor = cardParameters.oddrowfontcolor;
        }
        
        let output = `<desc style="background: ${rowBackground}; color:${fontColor}; border-bottom-left-radius: !{tableborderradius};border-bottom-right-radius: !{tableborderradius};">` +
                        `<td colspan="4">` +
                        `<div style="background: ${rowBackground}; color:${fontColor};text-align:justify;text-justify:inter-word; margin:2px 2px 2px 2px;border-top: 1px solid #444444;">${descText}</div>` +
                        `</td>` +
                     `</desc>`
        */
        
        let output = `<desc style="background: !{tablebgcolor}; border-bottom-left-radius: !{tableborderradius};border-bottom-right-radius: !{tableborderradius};">` +
                        `<td colspan="4">` +
                        `<div style="text-align:justify;text-justify:inter-word; margin:2px 2px 2px 2px;border-top: 1px solid #444444;">${descText}</div>` +
                        `</td>` +
                     `</desc>`
        
        output = replaceStyleInformation(output, cardParameters);
        return output;
    }
    
    const buildRowOutput = function (tokenRoll, outputType) {
        let content = '';
        
        tableLineCounter += 1;
        
        
        let tempToolTip = 'Rolling d20 (2&#42;(1-0)) &#91;PC&#93; (2&#42;0) &#91;NPC&#93; = (14) (2&ast;(1- 0))  (2&ast;0)';
        let tempRoll = '19';
        let tempPF = 'Pass';
        let tempDam = '15'
        content = `<div style="display:inline-block; height:30px; width:30px; vertical-align:middle; margin-right:4px;">` + 
                        `<div style="; background:url('${tokenRoll.pic}') 0/contain no-repeat"></div>`
                        `<span style="vertical-align:middle;font-weight:bolder">${tokenRoll.name}</span>` + 
                   `</div>` + 
                   `<div style="text-align:center">` +
                        `<span class="showtip tipsy" title="${tempToolTip}" style="min-width:1em;font-weight: bold;padding: .2em .2em;cursor:help;background-color:rgba(254,246,142,1);padding:2px 2px">${tempRoll}</span>` +
                    `</div>` +
                    `<td style="text-align:center"><a href="hello" style="font-weight:bold;color:#ffffff;background:#3FB315;border:1px solid black;padding:2px;cursor:pointer">${tempPF}</a></td>` +
                    `<td style="text-align:center; font-weight:bold">${tempDam}</td>`
        
        //let htmlContent = htmlRowTemplate.replace("=X=ROWDATA=X=", `${content}`);
        
        if (tableLineCounter % 2 == 0) {
			while(htmlContent.indexOf("=X=FONTCOLOR=X=") > 0) { htmlContent = htmlContent.replace("=X=FONTCOLOR=X=", cardParams.evenrowfontcolor); }
			while(htmlContent.indexOf("=X=ROWBG=X=") > 0) { htmlContent = htmlContent.replace("=X=ROWBG=X=", ` background: ${cardParams.evenrowbackground}; `); }
		} else {
			while(htmlContent.indexOf("=X=FONTCOLOR=X=") > 0) { htmlContent = htmlContent.replace("=X=FONTCOLOR=X=", cardParams.oddrowfontcolor); }
			while(htmlContent.indexOf("=X=ROWBG=X=") > 0) { htmlContent = htmlContent.replace("=X=ROWBG=X=", ` background: ${cardParams.oddrowbackground}; `); }
		}
        
        
        //possibly change line height to fit inline rolls
        if ( cardParams.resizeinline && htmlContent.indexOf("[[") > 0 ) {
            cardParams.lineheight = "1.5em";
        } else {
            cardParams.lineheight = "normal";
        }
        htmlContent = htmlContent.replace(new RegExp("!{lineheight}", "g"), cardParams.lineheight);
        
        
		//return htmlRowTemplate.replace("=X=ROWDATA=X=", `<strong>${tag}</strong> ${content}`);
		return htmlContent;
	}
    
    const buildTooltip = function(text,tip,style) {
		var tooltipStyle = ` font-family: ${defaultParameters.titlefont}; font-size: ${defaultParameters.titlefontsize}; font-weight: normal; font-style: normal; ${style} `;
		return `<span style='${tooltipStyle}' class='showtip tipsy' title='${tip}'>${text}</span>`; 
	};
    
    const replaceStyleInformation = function (outputLine, cardParmeters) {
		/*
		let styleList = [
			"tableborder", "tablebgcolor", "tableborderradius", "tableshadow", "titlecardbackground", "titlecardbottomborder",
			"titlefontsize", "titlefontlineheight", "titlefontcolor", "bodyfontsize", "subtitlefontsize", "subtitlefontcolor",
			"titlefontface", "bodyfontface", "subtitlefontface", "buttonbackground", "buttontextcolor", "buttonbordercolor",
			"dicefontcolor", "dicefontsize", "lineheight"
		];
		*/
		let styleList = [
			"tableborder", "tablebgcolor", "tableborderradius", "tableshadow", "titlecardbackground", "titlecardbottomborder",
			"titlefontsize", "titlefontlineheight", "titlefontcolor", "bodyfontsize", "subtitlefontsize", "subtitlefontcolor",
			"titlefontface", "bodyfontface", "subtitlefontface", "buttonbackground", "buttontextcolor", "buttonbordercolor",
			"dicefontcolor", "dicefontsize", "descriptiontext"
		];

		for (let i=0; i<styleList.length; i++) {
			outputLine = outputLine.replace(new RegExp("!{" + styleList[i] + "}", "g"), cardParmeters[styleList[i]]);
		}
		return outputLine;
	}
    
    
    
    const sendChatNoarchive = (playerid, string) => {
        const whisperPrefix = `/w "${(getObj("player", playerid) || {get: () => "GM"}).get("_displayname")}" `;
        sendChat("smartAoE", whisperPrefix + string, null, {
            noarchive: true
        });
    }
    
    const sendChatBox = (playerid, content, background) => {
        const output = `<div style="border:1px solid black;background:#${background || "FFF"};` +
            `padding:3px;margin:0 10px 0 -32px">${content}</div>`;
        sendChatNoarchive(playerid, output);
    }
    const handleError = (playerid, errorMsg) => sendChatBox(playerid, `<h4>Error</h4><p>${errorMsg}</p>`, "FFBABA")
    
    let saveList = {
        "5estr": {
          "name": "STR Save",
          "formula": "[[d20 + ([[d0 + @{strength_save_bonus}@{pbd_safe}]]*(1-@{npc})) [PC] + (@{npc_str_save}*@{npc}) [NPC]]]"
        },
        "5edex": {
          "name": "DEX Save",
          "formula": "[[d20 + ([[d0 + @{dexterity_save_bonus}@{pbd_safe}]]*(1-@{npc})) [PC] + (@{npc_dex_save}*@{npc}) [NPC]]]"
        },
        "5econ": {
          "name": "CON Save",
          "formula": "[[d20 + ([[d0 + @{constitution_save_bonus}@{pbd_safe}]]*(1-@{npc})) [PC] + (@{npc_con_save}*@{npc}) [NPC]]]"
        },
        "5eint": {
          "name": "INT Save",
          "formula": "[[d20 + ([[d0 + @{intelligence_save_bonus}@{pbd_safe}]]*(1-@{npc})) [PC] + (@{npc_int_save}*@{npc}) [NPC]]]"
        },
        "5ewis": {
          "name": "WIS Save",
          "formula": "[[d20 + ([[d0 + @{wisdom_save_bonus}@{pbd_safe}]]*(1-@{npc})) [PC] + (@{npc_wis_save}*@{npc}) [NPC]]]"
        },
        "5echa": {
          "name": "CHA Save",
          "formula": "[[d20 + ([[d0 + @{charisma_save_bonus}@{pbd_safe}]]*(1-@{npc})) [PC] + (@{npc_cha_save}*@{npc}) [NPC]]]"
        },
        "custom": {
          "name": "",
          "formula": ""
        }
    }
    const htmlReplace = (str, weak) => {
        const entities = {
            "<": "lt",
            ">": "gt",
            "'": "#39",
            "@": "#64",
            "{": "#123",
            "|": "#124",
            "}": "#125",
            "[": "#91",
            "\"": "quot",
            "]": "#93",
            "*": "#42",
            "&": "amp",
        };
        const regExp = weak ? /['"@{|}[*&\]]/g : /[<>'"@{|}[*&\]]/g;
        return str.replace(regExp, c => ("&" + entities[c] + ";"));
    } 
    
    const makeBox = (header, subheader, freetext, content) => {
          return "<div style=\"border: 1px solid #888;background:#fff;border-radius:15px;padding:3px 3px 1px;margin-left:-42px\">" +
            `<h4 style="text-align:center">${header}</h4>` +
            `<h5 style="text-align:center">${subheader || ""}</h5>` +
            `<table style="width:100%">${content}</table>` +
            (freetext ? `<div style="text-align:center;margin-bottom:4px">${freetext}</div>` : "") +
            "</div>";
        }
    const makeRow = (pic, name, roll1, roll2, isLast) => {
          return `<tr${isLast ? "" :" style=\"border-bottom: 1px solid #ddd\""}>` +
            makeName(pic, name) +
            `<td style="text-align:center">${roll1}</td>` +
            (roll2 ? `<td style="text-align:center">${roll2}</td>` : "") +
            "</tr>";
        }
    const makeName = (pic, name) => {
          const imgStyle = "display:inline-block;height:30px;width:30px;vertical-align:middle;margin-right:4px";
          return "<td style=\"padding:3px;height:30px;width:85%\">" +
            (pic ? `<div style="${imgStyle};background:url('${pic}') 0/contain no-repeat"></div>` : "") +
            `<span style="vertical-align:middle;font-weight:bolder">${name}</span>` +
            "</td>";
        }
    const makeCommandButton = (name, command, useBorder) => {
          const style = `style="font-weight:bold;color:#000;background:#fff;border:${useBorder?"1px solid black;padding:2px;margin:1px 0":"none;padding:0"}"`;
          return `<a href="${htmlReplace(command)}" ${style}>${name}</a>`;
        }
    const makeInlineroll = (roll, hideformula, highlight=false) => {
          const boundary = results => {
            switch (detectCritical(results)) {
            case "crit":
              return ";border:2px solid #3FB315";
            case "mixed":
              return ";border:2px solid #4A57ED";
            case "fumble":
              return ";border:2px solid #B31515";
            default:
              return "";
            }
          };
          //let background = highlight ? 'background-color: #FEF68E;' : ';';
          let background = 'background-color: #FEF68E'
          return "<span " +
            (hideformula ? "" : `class="showtip tipsy" title="Rolling ${htmlReplace(roll.expression)} = ${rollToText(roll.results)}" `) +
            `style="display:inline-block;min-width:1em;color:#000000;font-size:1.2em;font-weight:bold;padding:0 3px;vertical-align:middle;${background}; ` +
            `cursor:${hideformula ? "default" : "help"}${boundary(roll.results)}">${roll.results.total || "0"}</span>`;
        }
    const rollToText = (roll) => {
          switch (roll.type) {
          case "R":
          {
            const c = (roll.mods && roll.mods.customCrit) || [{
                comp: "==",
                point: roll.sides
              }],
              f = (roll.mods && roll.mods.customFumble) || [{
                comp: "==",
                point: 1
              }],
              styledRolls = roll.results.map(r => {
                const style = rollIsCrit(r.v, c[0].comp, c[0].point) ?
                  " critsuccess" :
                  (rollIsCrit(r.v, f[0].comp, f[0].point) ? " critfail" : "");
                return `<span class='basicdiceroll${style}'>${r.v}</span>`;
              });
            return `(${styledRolls.join("+")})`;
          }
          case "M":
            return roll.expr.toString().replace(/(\+|-)/g, "$1 ").replace(/\*/g, "&" + "ast" + ";");
          case "V":
            return roll.rolls.map(rollToText).join(" ");
          case "G":
            return `'(${roll.rolls.map(a => a.map(rollToText).join(" ")).join(" ")})`;
          default:
            return "";
          }
        }
    const detectCritical = (roll) => {
          let s = [];
          if (roll.type === "V") s = (roll.rolls || []).map(detectCritical);
          if (roll.type === "G") s = _.flatten(roll.rolls || []).map(detectCritical);
          if (roll.type === "R") {
            const crit = (roll.mods && roll.mods.customCrit) || [{
              comp: "==",
              point: roll.sides || 0
            }];
            const fumble = (roll.mods && roll.mods.customFumble) || [{
              comp: "==",
              point: 1
            }];
            if (roll.results.some(r => rollIsCrit(r.v, crit[0].comp, crit[0].point))) s.push("crit");
            if (roll.results.some(r => rollIsCrit(r.v, fumble[0].comp, fumble[0].point))) s.push("fumble");
          }
          const c = s.includes("crit"),
            f = s.includes("fumble"),
            m = s.includes("mixed") || (c && f);
          return (m ? "mixed" : (c ? "crit" : (f ? "fumble" : (false))));
        }
    const rollIsCrit = (value, comp, point) => {
        switch (comp) {
            case "==":
                return value == point;
            case "<=":
                return value <= point;
            case ">=":
                return value >= point;
        }
    };
    
    const pt = function(x,y) {
        this.x = x;
        this.y = y;
    };
    
    const getCleanImgsrc = function (imgsrc) {
        let parts = imgsrc.match(/(.*\/images\/.*)(thumb|med|original|max)([^\?]*)(\?[^?]+)?$/);
            if(parts) {
                return parts[1]+'thumb'+parts[3]+(parts[4]?parts[4]:`?${Math.round(Math.random()*9999999)}`);
            }
        return;
    };
    
    const checkInstall = function() {
        log(scriptName + ' v' + version + ' initialized.');
        
        //delete state[scriptName];
        
        if( ! _.has(state, scriptName) || state[scriptName].version !== schemaVersion) {
            log('  > Updating Schema to v'+schemaVersion+' <');
            switch(state[scriptName] && state[scriptName].version) {
                case 0.1:
                /* falls through */
                case 'UpdateSchemaVersion':
                    state[scriptName].version = schemaVersion;
                    break;

                default:
                    state[scriptName] = {
                        version: schemaVersion,
                        links: []
                    };
                    break;
            }
        }
        //log(state[scriptName]);
    };
    
    const toFullColor = function(htmlstring, defaultAlpha = 'ff') {
        let s=htmlstring.toLowerCase().replace(/[^0-9a-f]/,'');
        switch(s.length){
            case 3:
                s=`${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}${defaultAlpha}`;
                break;
            case 4:
                s=`${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`;
                break;
            case 6:
                s=`${s}${defaultAlpha}`;
                break;
        }
        return `#${s}`;
    };
    
    const clearCache = function(who, tokID=undefined, pageID=undefined) {
        let whisperString = `/w ${who}`;
        //no arguments passed, clear all linked pairs in ENTIRE CAMPAIGN
        if(!tokID && !pageID) {
            state[scriptName] = {
                version: schemaVersion,
                links: []
            };
            //if (!silent) {
                //sendChat(scriptName,`/w "${who}" `+ 'SmartAoE paths unlinked!');
            //}
            return;
        }
        
        //token only
        if (tokID) {
            //iterate through linked pairs in state object to find pairs associated with tokID
            for (let i = state[scriptName].links.length-1; i>-1; i--) {
                if (state[scriptName].links[i].tokID === tokID) {
                    //remove linked pair ids from state object
                    state[scriptName].links.splice(i,1);
                    sendChat(scriptName,`${whisperString} SmartAoE paths unlinked for tokID = ${tokID}`);
                }
            }
        } 
        
        //all linked tokens in current page
        if (pageID) {
            //iterate through linked pairs in state object to find pairs associated with pageID
            for (let i = state[scriptName].links.length-1; i>-1; i--) {
                if (state[scriptName].links[i].pageID === pageID) {
                    //remove linked pair ids from state object
                    state[scriptName].links.splice(i,1);
                }
            }
            sendChat(scriptName,`${whisperString} SmartAoE paths unlinked for all tokens in pageID = ${pageID}`);
        } 
        //log(state[scriptName]);
    }
    
    const updateAoELink = function(linkIndex, pathIDs, originIndex, boundingBox) {
    //const updateAoELink = function(linkIndex, pathIDs, originIndex) {
        //clear old paths from memory
        //log('updating AoELink, index=' + index);
        //log('new pathIDs = next');
        //log(pathIDs);
        //log('state before update');
        //log(state[scriptName]);
        
        //log('updating AoELink');
        
        //state[scriptName].links[linkIndex].pathIDs = [];
        state[scriptName].links[linkIndex].pathIDs = pathIDs.map((x) => x);
        state[scriptName].links[linkIndex].originIndex = originIndex;
        state[scriptName].links[linkIndex].boundingBox = boundingBox;
        //log('state after update');
        //log(state[scriptName]);
    }
    
    const makeAoELink = function(aoeType, aoeFloat, aoeColor, aoeOutlineColor, range, originType, originPt, minGridArea, minTokArea, originTokID, controlTokID, pathIDs, pageID, fxType, saveFormula, saveName, ignoreAttr, ignoreVal, DC, damageBar, autoApply, damageFormula1, damageFormula2, damageBase1, damageBase2, damageType1, damageType2, rollDamage1, rollDamage2, damageSaveRule, resistanceRule, vulnerableRule, immunityRule, resistAttr, vulnerableAttr, immunityAttr, conditionPass, conditionFail, zeroHPmarker, cardParameters) {
    //const makeAoELink = function(aoeType, aoeColor, range, originType, originPt, minGridArea, minTokArea, originTokID, controlTokID, pathIDs, pageID, fxType, saveFormula, saveName, DC) {
        //log(originTokID + ',' + controlTokID + ',' + pathIDs + ',' + pageID);
        let pathArr = [];
        pathArr.push(pathIDs);
        let link =  {
            //tokName: state[scriptName].links.length.toString(),
            aoeType: aoeType,
            aoeFloat: aoeFloat,
            aoeColor: aoeColor,
            aoeOutlineColor: aoeOutlineColor,
            range: range,
            fxType: fxType,
            minGridArea: minGridArea,
            minTokArea: minTokArea,
            pageID: pageID,
            originTokID: originTokID,
            controlTokID: controlTokID,
            boundingBox: [],    //will be array of pts [UL, UR, LR, LL], defined by the min/max x/y of the affected grid squares
            originType: originType,
            originPts: [originPt],
            originIndex: 0,
            pathIDs: pathArr,
            saveFormula: saveFormula,
            saveName: saveName,
            ignoreAttr: ignoreAttr,
            ignoreVal: ignoreVal,
            DC: DC,
            damageBar: damageBar,
            autoApply: autoApply,
            damageFormula1: damageFormula1, 
            damageFormula2: damageFormula2, 
            damageBase1: damageBase1, 
            damageBase2: damageBase2,
            damageType1: damageType1, 
            damageType2: damageType2, 
            rollDamage1: rollDamage1, 
            rollDamage2: rollDamage2,
            damageSaveRule: damageSaveRule,
            resistanceRule: resistanceRule,
            vulnerableRule: vulnerableRule,
            immunityRule: immunityRule,
            resistAttr: resistAttr, 
            vulnerableAttr: vulnerableAttr, 
            immunityAttr: immunityAttr,
            conditionPass: conditionPass,
            conditionFail: conditionFail,
            zeroHPmarker: zeroHPmarker,
            cardParameters: cardParameters
        };
        
        state[scriptName].links.push(link);
        return link;
    }
    
    //Return object containing arrays of {[linkObj], [indices]} from state object, given tokenID or pathID based on searchType. Returns undefined if none found. 
    const getAoELinks = function(ID) {
        let linkObjs = [];
        let indices = [];
        
        //log('finding link for tokID = ' + ID);
        //log('in getAoELinks function')
        //log('number of links = ' + state[scriptName].links.length)
        state[scriptName].links.forEach((link, index) => {
            //log('link index = ' + index);
            //log('pageID of link = ' + link.pageID);
            //log(link.pathIDs);
            //let page = getObj('page', link.pageID);
            //let name = page.get('name');
            //log('page name = ' + name);
            if (link.controlTokID === ID || link.originTokID === ID) {
                linkObjs.push(link);
                indices.push(index);
            }
        });
        
        /*
        let link = state[scriptName].links.filter(function (p) {
            if (searchType === byTOKEN) {
                return (p.controlTokID === ID || p.originTokID === ID);
            //} else {
            //    return p.pathID === ID;
            }
        });
        */
        
        if (linkObjs.length>0) {
            let retVal = {
                links: linkObjs,
                indices: indices
            }
            return retVal;
        } else {
            return undefined;
        }
    }
    
    const spawnTokenAtXY =  function(who, tokenJSON, pageID, spawnX, spawnY, sizeX, sizeY, controlledby, isDrawing) {
        let spawnObj;
        let imgsrc;
        
        let whisperString = `/w ${who}`;
        try {
            let baseObj = JSON.parse(tokenJSON);
            
            //set token properties
            baseObj.pageid = pageID;
            baseObj.left = spawnX;
            baseObj.top = spawnY;
            baseObj.width = sizeX;
            baseObj.height = sizeY;
            baseObj.controlledby = controlledby;
            baseObj.isdrawing = isDrawing;
            
            baseObj.imgsrc = getCleanImgsrc(baseObj.imgsrc); //ensure that we're using the thumb.png
            
            //image must exist in personal Roll20 image library 
            if (baseObj.imgsrc ===undefined) {
                sendChat(scriptName,`${whisperString} Unable to find imgsrc for default token of \(${baseObj.name}\)<br> You must use an image file that has been uploaded to your Roll20 Library.`)
                return;
            }
            
            //Spawn the Token!
            //controlTok = createObj('graphic',baseObj);
            
            
            return new Promise(resolve => {
                controlTok = createObj('graphic',baseObj);
                resolve(controlTok);
            });
            
        }
        catch(err) {
          sendChat('SmartAoE',whisperString + 'Unhandled exception: ' + err.message)
        }
    };
    
    const build5eCone = function(rad, z, coneWidth, coneDirection) {
        let pointsJSON = '';
        let deg2rad = Math.PI/180;
        //see above for details of what "z" is
        //let z = (rad / (2*Math.sin(Math.atan(0.5)))) - rad;
                
        let ptOrigin = new pt(rad+z, rad+z);
        let ptUL = new pt(0,0);
        let ptUR = new pt(2*(rad+z),0);
        let ptLR = new pt(2*(rad+z),2*(rad+z));
        let ptLL = new pt(0,2*(rad+z));
        
        /*
        log('rad = ' + rad);
        log('z = ' + z);
        log(ptOrigin);
        log(ptUL);
        log(ptUR);
        log(ptLR);
        log(ptLL);
        */
        
        let oX = oY = rad + z;
        //normalize rotation to 360deg and find defining angles (converted to radians)
        
        coneDirection = normalizeTo360deg(coneDirection);
        
        //define "cone" angles (in degrees)
        let th1 = deg2rad * (coneDirection - coneWidth/2);  //angle of trailing cone side
        let th2 = deg2rad * (coneDirection + coneWidth/2);  //angle of leading cone side

        //a 5e cone is defined by the orgin and two pts
        let pt1 = get5eConePathPt(rad+z, th1);
        let pt2 = get5eConePathPt(rad+z, th2);
        //let conePtsArr = [ptOrigin, pt1, pt2];
        
        //start path at the origin pt, connect to pts 1&2, then back to origin 
        pointsJSON = `[[\"M\",${ptOrigin.x},${ptOrigin.y}],[\"L\",${pt1.x},${pt1.y}],[\"L\",${pt2.x},${pt2.y}],[\"L\",${ptOrigin.x},${ptOrigin.y}],`;
        //add "phantom" single points to path corresponding to the four corners to keep the size computations correct
        pointsJSON = pointsJSON + `[\"M\",${ptUL.x},${ptUL.y}],[\"L\",${ptUL.x},${ptUL.y}],[\"M\",${ptUR.x},${ptUR.y}],[\"L\",${ptUR.x},${ptUR.y}],[\"M\",${ptLR.x},${ptLR.y}],[\"L\",${ptLR.x},${ptLR.y}],[\"M\",${ptLL.x},${ptLL.y}],[\"L\",${ptLL.x},${ptLL.y}],[\"M\",${ptUL.x},${ptUL.y}],[\"L\",${ptUL.x},${ptUL.y}]]`;
    
        //log(pointsJSON);
        return pointsJSON;
    };
    
    const buildSquarePath = function(rad) {
        let ptUL = new pt(0,0);
        let ptUR = new pt(2*rad,0);
        let ptLR = new pt(2*rad,2*rad);
        let ptLL = new pt(0,2*rad);
        
        //Full square
        //squarePoints = `[[\"M\",0,0],[\"L\",0,${2*rad}],[\"L\",${2*rad},${2*rad}],[\"L\",${2*rad},0],[\"L\",0,0]]`;
        let squarePointsJSON = `[[\"M\",${ptUL.x},${ptUL.y}],[\"L\",${ptUR.x},${ptUR.y}],[\"L\",${ptLR.x},${ptLR.y}],[\"L\",${ptLL.x},${ptLL.y}],[\"L\",${ptUL.x},${ptUL.y}]]`;
        
        //log(squarePointsJSON);
        return squarePointsJSON;
    };
    
    //Circle building portion of function is modified from TheAaron's "dlcircle" script
    const buildCirclePath = function(rad, coneWidth, coneDirection) {
        let circlePoints;
        let steps, stepSize;
        let deg2rad = Math.PI/180;
        
        steps = Math.min(Math.max(Math.round( (Math.PI*2*Math.sqrt((2*rad*rad)/2))/35),4),20);
        
        const at = (theta) => ({x: Math.cos(theta)*rad, y: Math.sin(theta)*rad}); 
        
        if (coneWidth === 360) { 
            //Build a full circle
            stepSize = Math.PI/(2*steps);
            
            let acc=[[],[],[],[]];
            let th=0;
            _.times(steps+1,()=>{
                let pt=at(th);
                acc[0].push([pt.x,pt.y]);
                acc[1].push([-pt.x,pt.y]);
                acc[2].push([-pt.x,-pt.y]);
                acc[3].push([pt.x,-pt.y]);
                th+=stepSize;
            });
            acc = acc[0].concat(
                acc[1].reverse().slice(1),
                acc[2].slice(1),
                acc[3].reverse().slice(1)
            );
            
            //Some js wizardry from TheAaron with the array map function. I couldn't make it work without returning the outer (1st & last) square brackets
            //So, we will take this string, strip the last "]", then append the grid points to the path
            circlePoints = JSON.stringify(acc.map((v,i)=>([(i?'L':'M'),rad+v[0],rad+v[1]])));
            circlePoints = circlePoints.substring(0, circlePoints.length - 1);
        } else {
            //build a cone instead
            steps = 50;
            stepSize = deg2rad * (coneWidth/(steps));
            
            let oX = oY = rad;
            let x, y;
            let startAngle = deg2rad * (coneDirection - coneWidth/2);
            let endAngle = deg2rad * (coneDirection + coneWidth/2);
            let ptUL = new pt(0,0);
            let ptUR = new pt(2*rad,0);
            let ptLR = new pt(2*rad,2*rad);
            let ptLL = new pt(0,2*rad);
            
            //start path at the origin pt 
            circlePoints = `[[\"M\",${oX},${oY}],`;
            
            //for loop takes into account cumulative floating point precision error
            for (let th=startAngle; th<endAngle+Number.EPSILON*steps; th+=stepSize) {
                //change in "normal" polar coord conversion due to 0deg being straight up and positive Y being "down"
                x = oX + oX * Math.sin(th);
                y = oY + oY * Math.cos(th + deg2rad*180);
                circlePoints = circlePoints + `[\"L\",${x},${y}],`
            }
            
            //connect back to the origin pt
            circlePoints = circlePoints + `[\"L\",${oX},${oY}],`;
            //add "phantom" single points to path corresponding to the four corners to keep the size computations correct
            circlePoints = circlePoints + `[\"M\",${ptUL.x},${ptUL.y}],[\"L\",${ptUL.x},${ptUL.y}],[\"M\",${ptUR.x},${ptUR.y}],[\"L\",${ptUR.x},${ptUR.y}],[\"M\",${ptLR.x},${ptLR.y}],[\"L\",${ptLR.x},${ptLR.y}],[\"M\",${ptLL.x},${ptLL.y}],[\"L\",${ptLL.x},${ptLL.y}],[\"M\",${ptUL.x},${ptUL.y}],[\"L\",${ptUL.x},${ptUL.y}]`;
        }
        
        //return  the path JSON
        return circlePoints + "]";
    };
    
    async function deleteLinkedPaths (pathIDs) {
        //delete the linked paths and clear the pathIDs array from the state object
        //log('entered deleteLinkedPaths function')
        //log(pathIDs);
        //log(pathIDs.length);
        pathIDs.forEach((pathID) => {
            //log('this pathID = ' + pathID)
            path = getObj('path',pathID);
            if (path) {
                //log('removing path ' + pathID);
                path.remove();
                path = getObj('path',pathID);
                //log(path);
            }  
        });
        /*
        state[scriptName].links[index].pathIDs.forEach((pathID) => {
          path = getObj('path',pathID);
            if (path) {
                path.remove();
            }  
        });
        //state[scriptName].links[index].pathIDs = [];
        return new Promise(resolve => {
            log('delete done');
            resolve('done');
        });
        */
        //log(state[scriptName]);
    }
    
    const createPath = function(pathstring, pageID, layer, fillColor, strokeColor, strokeWidth, height, width, left, top) {
        //let promise = new Promise(resolve => {
            //log('about to create path');
            
                let path = createObj("path", {                
                    pageid: pageID,
                    path: pathstring,
                    fill: fillColor,
                    stroke: strokeColor,
                    layer: layer,
                    stroke_width: strokeWidth,
                    width: width,
                    height: height,
                    left: left,
                    top: top
                });
                return path
                
                //resolve(path);
            
        //});
        
        /*
        result = await promise;
        log(result);
        return result;
        */
    }
    
    const normalizeTo360deg = function(deg) {
        deg = deg % 360;
        if (deg < 0) {deg += 360;}
        return deg;
    }
    
    const getNewControlPt = function(oPt, rad, angle) {
        let deg2rad = Math.PI/180;
        let smallAngle;
        let retPt;
        
        if (angle === 0) {
            retPt = new pt(oPt.x, oPt.y-rad);
        } else if (angle > 0 && angle < 90) {
            smallAngle = angle*deg2rad;
            retPt =  new pt(oPt.x + rad*Math.sin(smallAngle), oPt.y-rad*Math.cos(smallAngle));
        } else if (angle === 90) {
            retPt =  new pt(oPt.x+rad, oPt.y);
        } else if (angle > 90 && angle < 180) {
            smallAngle = angle*deg2rad - 90*deg2rad;
            retPt =  new pt(oPt.x + rad*Math.cos(smallAngle), oPt.y+rad*Math.sin(smallAngle));
        } else if (angle === 180) {
            retPt =  new pt(oPt.x, oPt.y+rad);
        } else if (angle > 180 && angle < 270) {
            smallAngle = angle*deg2rad - 180*deg2rad;
            retPt =  new pt(oPt.x - rad*Math.sin(smallAngle), oPt.y+rad*Math.cos(smallAngle));
        } else if (angle === 270) {
            retPt =  new pt(oPt.x-rad, oPt.y);
        } else if (angle > 270 && angle < 360) {
            smallAngle = angle*deg2rad - 270*deg2rad;
            retPt =  new pt(oPt.x - rad*Math.cos(smallAngle), oPt.y-rad*Math.sin(smallAngle));
        }
        
        //log(retPt)
        return retPt
    }
    
    const getAngle2ControlToken = function(oPt, cPt) {
        let deg2rad = Math.PI/180;
        let cAngle;     //return value (angle from originPt to controlPt)
        
        let dX = Math.abs(cPt.x - oPt.x);
        let dY = Math.abs(cPt.y - oPt.y);
        let smallAngle = Math.atan(dY / dX);    //this does not take into account the quadrant in which the angle lies. More tests req'd to determine correct relative angle 
        
        if (cPt.x < oPt.x && cPt.y < oPt.y) { //UL quadrant
            cAngle = 270*deg2rad + smallAngle;
        } else if (cPt.x > oPt.x && cPt.y < oPt.y) { //UR quadrant
            cAngle = 90*deg2rad - smallAngle;
        } else if (cPt.x > oPt.x && cPt.y > oPt.y) { //LR quadrant
            cAngle = 90*deg2rad + smallAngle;
        } else if (cPt.x < oPt.x && cPt.y > oPt.y) { //LL quadrant
            cAngle = 270*deg2rad - smallAngle;
        } else if (cPt.x === oPt.x && cPt.y < oPt.y) { //straight up
            cAngle = 0*deg2rad;
        } else if (cPt.x > oPt.x && cPt.y === oPt.y) { //straight right
            cAngle = 90*deg2rad;
        } else if (cPt.x === oPt.x && cPt.y > oPt.y) { //straight down
            cAngle = 180*deg2rad;
        } else if (cPt.x < oPt.x && cPt.y === oPt.y) { //straight left
            cAngle = 270*deg2rad;
        }
        
        return cAngle/deg2rad;  //angle expressed in degrees
        
    }
    
    const convertPtPixels2Units = function(Pt, pageGridIncrement) {
        //let newX = Pt.x / (70 * pageGridIncrement);
        //let newY = Pt.y / (70 * pageGridIncrement);
        let closestCellX = Math.ceil(Pt.x / (70 * pageGridIncrement)) * 70*pageGridIncrement - 35*pageGridIncrement;
        let closestCellY = Math.ceil(Pt.y / (70 * pageGridIncrement)) * 70*pageGridIncrement - 35*pageGridIncrement;
        
        let newX = closestCellX / (70 * pageGridIncrement);
        let newY = closestCellY / (70 * pageGridIncrement);
        //let newX = Math.ceil(Pt.x / (70 * pageGridIncrement)) * 70*pageGridIncrement;
        //let newY = Math.ceil(Pt.y / (70 * pageGridIncrement)) * 70*pageGridIncrement;
        
        let PtInUnits = new pt(newX, newY);
        return PtInUnits
    }
    
    const convertLocationsArrUnits2Pixels = function(obj, pageGridIncrement) {
        let newX = obj.xVals.map(val => val * 70 * pageGridIncrement)
        let newY = obj.yVals.map(val => val * 70 * pageGridIncrement)
        return {xVals: newX, yVals: newY};
    }
    
    const getLineLocations = function (x1, y1, x2, y2, pageGridIncrement) {
        let lineCoords = {
            xVals: [],
            yVals: []
        }
        // Iterators, counters required by algorithm
        let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
        // Calculate line deltas
        dx = x2 - x1;
        dy = y2 - y1;
        // Create a positive copy of deltas (makes iterating easier)
        dx1 = Math.abs(dx);
        dy1 = Math.abs(dy);
        //log('dx1 = ' + dx1 + 'dy1 = ' + dy1);
        // Calculate error intervals for both axis
        px = 2 * dy1 - dx1;
        py = 2 * dx1 - dy1;
        // The line is X-axis dominant
        if (dy1 <= dx1) {
            // Line is drawn left to right
            if (dx >= 0) {
                x = x1; y = y1; xe = x2;
            } else { // Line is drawn right to left (swap ends)
                x = x2; y = y2; xe = x1;
            }
            //pixel(x, y); // Draw first pixel
            lineCoords.xVals.push(x);
            lineCoords.yVals.push(y);
            // Rasterize the line
            for (i = 0; x < xe; i++) {
                //log(i + ', ' + x + ', ' + xe);
                x = x + 1;
                // Deal with octants...
                if (px < 0) {
                    px = px + 2 * dy1;
                } else {
                    if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                        y = y + 1;
                    } else {
                        y = y - 1;
                    }
                    px = px + 2 * (dy1 - dx1);
                }
                // Draw pixel from line span at
                // currently rasterized position
                //pixel(x, y);
                lineCoords.xVals.push(x);
                lineCoords.yVals.push(y);
            }
        } else { // The line is Y-axis dominant
            // Line is drawn bottom to top
            if (dy >= 0) {
                x = x1; y = y1; ye = y2;
            } else { // Line is drawn top to bottom
                x = x2; y = y2; ye = y1;
            }
            //pixel(x, y); // Draw first pixel
            lineCoords.xVals.push(x);
            lineCoords.yVals.push(y);
            
            // Rasterize the line
            for (i = 0; y < ye; i++) {
                y = y + 1;
                // Deal with octants...
                if (py <= 0) {
                    py = py + 2 * dx1;
                } else {
                    if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
                        x = x + 1;
                    } else {
                        x = x - 1;
                    }
                    py = py + 2 * (dx1 - dy1);
                }
                // Draw pixel from line span at
                // currently rasterized position
                lineCoords.xVals.push(x);
                lineCoords.yVals.push(y);
            }
        }
        
        lineCoords = convertLocationsArrUnits2Pixels(lineCoords, pageGridIncrement)
        //log('lineCoords follows');
        //log(lineCoords);
        return lineCoords;
    }
    
    
    const distBetweenPts = function(pt1, pt2, calcType='Euclidean', gridIncrement=-999, scaleNumber=-999) {
        let distPx;     //distance in Pixels
        let distUnits;  //distance in units (gridded maps only)
        if ( (calcType === 'PF' || calcType === '5e') && gridIncrement !== -999 & scaleNumber !== -999) {
            //using 'Pathfinder' or '3.5e' distance rules, where every other diagonal unit counts as 1.5 units. 
            //..or using 5e diagonal rules where each diag only counts 1 square. 
            //..5e is special due to how t is constructed. We use Euclidean distance to determine if in cone, but we can display in 5e units. 
                //Only compatible with gridded maps
                //convert from pixels to units, do the funky pathfinder math, then convert back to pixels
            let dX = (Math.abs(pt1.x - pt2.x) * scaleNumber / 70) / gridIncrement;
            let dY = (Math.abs(pt1.y - pt2.y) * scaleNumber / 70) / gridIncrement;
            let maxDelta = Math.max(dX,dY);
            let minDelta = Math.min(dX, dY);
            let minFloor1pt5Delta;
            if (calcType === '5e') {
                //diagonals count as one square
                minFloor1pt5Delta = Math.floor(1.0 * minDelta);
            } else if (calcType === 'PF') {
                //every other diagonal counts as 1.5 squares
                minFloor1pt5Delta = Math.floor(1.5 * minDelta);
            }
            
            
            //log(pt1);
            //log(pt2);
            //log('gridIncrement = ' + gridIncrement);
            //log('scaleNumber = ' + scaleNumber);
            //log('dX = ' + dX);
            //log('dY = ' + dY);
            //log('maxDelta = ' + maxDelta);
            //log('MinDelta = ' + minDelta);
            //log('minFloor1pt5Delta = ' + minFloor1pt5Delta);
            //let temp = maxDelta - minDelta + minFloor1pt5Delta;
            //log('distU = ' + temp);
            
            
            //convert dist back to pixels
            distUnits = Math.floor( (maxDelta-minDelta + minFloor1pt5Delta) / scaleNumber ) * scaleNumber
            distPx = distUnits * 70 * gridIncrement / scaleNumber; 
            //floor( ( maxDelta-minDelta + minFloor1pt5Delta ) /5  )*5
            
            //log('distP = ' + distPx);
            
            //  [[ floor((([[{abs((@{position-x}-@{target|Target|position-x})*5/70),abs((@{position-y}-@{target|Target|position-y})*5/70)}kh1]]-
            //  [[{abs((@{position-x}-@{target|Target|position-x})*5/70),abs((@{position-y}-@{target|Target|position-y})*5/70)}kl1]])+
            //  floor(1.5*([[{abs((@{position-x}-@{target|Target|position-x})*5/70),abs((@{position-y}-@{target|Target|position-y})*5/70)}kl1]])))/5)*5]]
            
        } else {
            //default Pythagorean theorem
            distPx = Math.sqrt( Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2) );
        }
        
        return distPx;
    }
    
    /*
    const distBetweenPts = function(pt1, pt2) {
        let dist = Math.sqrt( Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2) );
    }
    */
    
    
    function calcPolygonArea(vertices) {
        //vertices is an array of pts
        //NOTE: vertices must be in clockwise or counter-clockwise order for this to work!!!
        let total = 0;
        
        for (let i = 0, l = vertices.length; i < l; i++) {
            let addX = vertices[i].x;
            let addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
            let subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
            let subY = vertices[i].y;
            
            total += (addX * addY * 0.5);
            total -= (subX * subY * 0.5);
        }
        
        return Math.abs(total);
    }
    
    const calcRectangleOverlapArea = function(rect1, rect2) {
        //rect 1&2 are arrays of pts [UL, UR, LR, LL], in that order!
        let x_overlap = Math.max(0, Math.min(rect1[1].x, rect2[1].x) - Math.max(rect1[0].x, rect2[0].x));
        let y_overlap = Math.max(0, Math.min(rect1[3].y, rect2[3].y) - Math.max(rect1[0].y, rect2[0].y));
        return x_overlap * y_overlap;
    } 
    
    
    
    /** Get relationship between a point and a polygon using ray-casting algorithm
     * @param {{x:number, y:number}} P: point to check
     * @param {{x:number, y:number}[]} polygon: the polygon
     * @returns true for inside or along edge; false if outside
     */
     //adapted from https://stackoverflow.com/posts/63436180/revisions
    const isPointInPolygon = function(P, polygon) {
        const between = (p, a, b) => p >= a && p <= b || p <= a && p >= b;
        let inside = false;
        for (let i = polygon.length-1, j = 0; j < polygon.length; i = j, j++) {
            const A = polygon[i];
            const B = polygon[j];
            // corner cases
            if (P.x == A.x && P.y == A.y || P.x == B.x && P.y == B.y) return true;
            if (A.y == B.y && P.y == A.y && between(P.x, A.x, B.x)) return true;
    
            if (between(P.y, A.y, B.y)) { // if P inside the vertical range
                // filter out "ray pass vertex" problem by treating the line a little lower
                if (P.y == A.y && B.y >= A.y || P.y == B.y && A.y >= B.y) continue
                // calc cross product `PA X PB`, P lays on left side of AB if c > 0 
                const c = (A.x - P.x) * (B.y - P.y) - (B.x - P.x) * (A.y - P.y)
                if (c == 0) return true;
                if ((A.y < B.y) == (c > 0)) inside = !inside
            }
        }
        //log('inside = ' + inside);
        return inside? true: false;
    }
    
    const isPointInCone = function(pt, oPt, rad, coneDirection, coneWidth, isFlatCone, calcType='Euclidean', gridIncrement=-999, scaleNumber=-999) {
        let deg2rad = Math.PI/180;
        let pAngle;     //the angle between the cone origin and the test pt
        let smallAngle;
        let startAngle = deg2rad * Math.floor(normalizeTo360deg(coneDirection - coneWidth/2));  //round down to nearest degree to account for flotaing pt errors
        let endAngle = deg2rad * Math.ceil(normalizeTo360deg(coneDirection + coneWidth/2));    //round down to nearest degree to account for flotaing pt errors
        let centerAngle = deg2rad * normalizeTo360deg(coneDirection);
        let halfConeWidth = deg2rad * (coneWidth/2);
        let criticalDist;
        
        //special case: Angle calcs will fail when the pt to check is same as origin point - count this as in the cone.
        if (Math.round(pt.x) === Math.round(oPt.x) && Math.round(pt.y) === Math.round(oPt.y)) {
            return true;
        }
        
        // Calculate polar co-ordinates
        let polarRadius;
        if (calcType == 'PF' && gridIncrement !== -999 & scaleNumber !== -999) {
            polarRadius = distBetweenPts(oPt, pt, calcType, gridIncrement, scaleNumber)
        } else {
            polarRadius = distBetweenPts(oPt, pt)
        }
        
        let dX = Math.abs(pt.x - oPt.x);
        let dY = Math.abs(pt.y - oPt.y);
        
        //calculate "smallAngle" - this does not take into account the quadrant in which the angle lies. More tests req'd to determine correct relative angle 
        if (dX===0) {
            smallAngle = 90*deg2rad;
        } else {
            smallAngle = Math.atan(dY / dX);
        }
        
        if (pt.x < oPt.x && pt.y < oPt.y) { //UL quadrant
            pAngle = 270*deg2rad + smallAngle;
        } else if (pt.x > oPt.x && pt.y < oPt.y) { //UR quadrant
            pAngle = 90*deg2rad - smallAngle;
        } else if (pt.x > oPt.x && pt.y > oPt.y) { //LR quadrant
            pAngle = 90*deg2rad + smallAngle;
        } else if (pt.x < oPt.x && pt.y > oPt.y) { //LL quadrant
            pAngle = 270*deg2rad - smallAngle;
        } else if (pt.x === oPt.x && pt.y < oPt.y) { //straight up
            pAngle = 0*deg2rad;
        } else if (pt.x > oPt.x && pt.y === oPt.y) { //straight right
            pAngle = 90*deg2rad;
        } else if (pt.x === oPt.x && pt.y > oPt.y) { //straight down
            pAngle = 180*deg2rad;
        } else if (pt.x < oPt.x && pt.y === oPt.y) { //straight left
            pAngle = 270*deg2rad;
        }
        
        //2nd test angle: Add 360deg to pAngle (to handle cases where startAngle is a negative value and endAngle is positive)
        let pAngle360 = pAngle + 360*deg2rad;
        if (endAngle < startAngle) {
            endAngle = endAngle + 360*deg2rad;
        }
        
        /*
        if (Math.round(pt.x)===1190 && Math.round(pt.y)===562) {
            log(pt);
            log(oPt);
            log('coneDirection = ' + coneDirection);
            log('coneWidth = ' + coneWidth);
            log('range = ' + rad);
            log('polarRadius = ' + polarRadius);
            log('startAngle = ' + startAngle/deg2rad);
            log('endAngle = ' + endAngle/deg2rad);
            log('smallAngle = ' + smallAngle/deg2rad);
            log('pAngle = ' + pAngle/deg2rad);
            log('pAngle360 = ' + pAngle360/deg2rad);
        }
        */
        
        if (isFlatCone) {
            //for 5e-style cones. Basically a triangle (no rounded outer face)
            //let z = (rad / (2*Math.sin(Math.atan(0.5)))) - rad;
            dTheta = Math.abs(pAngle - centerAngle);
            //criticalDist = ((rad+z)*Math.cos(halfConeWidth)) / Math.cos(dTheta);
            criticalDist = rad / Math.cos(dTheta);
        } else {
            //compare to full radius cone
            criticalDist = rad
        }
        //log('criticalDist = ' + criticalDist);
        //log('polarRadius = ' + polarRadius);
        
        let err = 1.03;
        //test pAngle and pAngle360 against start/end Angles
        //if ( (pAngle*err >= startAngle) && (pAngle <= endAngle*err) && (polarRadius <= criticalDist*err) ||
        //        (pAngle360*err >= startAngle) && (pAngle360 <= endAngle*err) && (polarRadius <= criticalDist*err) ) {
        if ( (pAngle >= startAngle) && (pAngle <= endAngle) && (polarRadius <= criticalDist*err) ||
                (pAngle360 >= startAngle) && (pAngle360 <= endAngle) && (polarRadius <= criticalDist*err) ) {
           return true;
        } else {
            return false;
        }
    }
    
    
    // Returns intersection of two line segments.
    const getIntersectionPt = function(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
        let s1_x = p1_x - p0_x;
        let s1_y = p1_y - p0_y;
        let s2_x = p3_x - p2_x;
        let s2_y = p3_y - p2_y;
        //log(p0_x + ',' + p0_y + ',' + p1_x + ',' + p1_y + ',' + p2_x + ',' + p2_y + ',' + p3_x + ',' + p3_y)
        
        let s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
        let t = (s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
        
        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { 
            // intersection at one point
            let intX = p0_x + (t * s1_x);
            let intY = p0_y + (t * s1_y);
            //return new pt(intX, intY);
            return {x:intX, y:intY}
        //} else if (s1_x===0 & s2_x===0 & ((p0_y<=p2_y & p2_y<=p1_y) || (p1_y<=p2_y & p2_y<=p0_y) || (p0_y<=p3_y & p3_y<=p1_y) || (p1_y<=p3_y & p3_y<=p0_y))) {
        //    // overlapping vertical lines
        //    return 'V_edge'
        //} else if (s1_y===0 & s2_y===0 & ((p0_x<=p2_x & p2_x<=p1_x) || (p1_x<=p2_x & p2_x<=p0_x) || (p0_x<=p3_x & p3_x<=p1_x) || (p1_x<=p3_x & p3_x<=p0_x))) {
        //    // overlapping horizontal lines
        //    return 'H_edge'
        } else {
            // No intersection
            return null; 
        }
    }
    
    const getSlicedSquarePolygon = function(oPt, endPt, i, j, pageGridIncrement) {
        let vertices = []
        let ptUL = new pt(i-35*pageGridIncrement, j-35*pageGridIncrement);
        let ptUR = new pt(i+35*pageGridIncrement, j-35*pageGridIncrement);
        let ptLR = new pt(i+35*pageGridIncrement, j+35*pageGridIncrement);
        let ptLL = new pt(i-35*pageGridIncrement, j+35*pageGridIncrement);
        
        /*
        log('box pts');
        log(ptUL);
        log(ptUR);
        log(ptLR);
        log(ptLL);
        */
        
        let count = 0;
        //go clockwise, check each edge of square for intersection with lines defined by cone angles passed to this function
        //log('upperIntersection args');
        //log(ptUL.x + ',' + ptUL.y + ',' + ptUR.x + ',' + ptUR.y + ',' + oPt.x + ',' + oPt.y + ',' + i + ',' + j)
        let upperIntersection = getIntersectionPt(ptUL.x, ptUL.y, ptUR.x, ptUR.y, oPt.x, oPt.y, endPt.x, endPt.y);
        if (upperIntersection) {
            //log('upperIntersection');
            //vertices.push(ptUL, upperIntersection, ptUR);
            vertices.push(upperIntersection, ptUR);
            count +=1;
        }
        
        let rightIntersection = getIntersectionPt(ptUR.x, ptUR.y, ptLR.x, ptLR.y, oPt.x, oPt.y, endPt.x, endPt.y);
        if (rightIntersection) {
            //log('rightIntersection');
            //log('rightIntersection args');
            //log(ptUR.x + ',' + ptUR.y + ',' + ptLR.x + ',' + ptLR.y + ',' + oPt.x + ',' + oPt.y + ',' + endPt.x + ',' + endPt.y)
            if (count > 0 && upperIntersection) {
                vertices.push(rightIntersection, ptLR);
            } else {
                //vertices.push(ptUR, rightIntersection, ptLR);
                vertices.push(rightIntersection, ptLR);
            }
            count +=1;
        }
        if (count===2) { return vertices }
        
        let bottomIntersection = getIntersectionPt(ptLR.x, ptLR.y, ptLL.x, ptLL.y, oPt.x, oPt.y, endPt.x, endPt.y);
        if (bottomIntersection) {
            //log('bottomIntersection');
            if (count > 0 && rightIntersection) {
                vertices.push(bottomIntersection, ptLL);
            } else {
                //vertices.push(ptLR, bottomIntersection, ptLL);
                vertices.push(bottomIntersection, ptLL);
            }
            count +=1;
        }
        if (count===2) { return vertices }
        
        let leftIntersection = getIntersectionPt(ptLL.x, ptLL.y, ptUL.x, ptUL.y, oPt.x, oPt.y, endPt.x, endPt.y);
        if (leftIntersection) {
            //log('leftIntersection');
            if (count > 0 && leftIntersection) {
                vertices.push(leftIntersection, ptUL);
            } else {
                //vertices.push(ptLL, leftIntersection, ptUL);
                vertices.push(leftIntersection, ptUL);
            }
            count +=1;
        }
        return vertices;
    }
    
    const getConeEndPt = function (oPt, rad, theta) {
        let deg2rad = Math.PI/180;
        //change in "normal" polar coord conversion due to 0deg being straight up and positive Y being "down"
        let x = Math.round(oPt.x + rad * Math.sin(theta));
        let y = Math.round(oPt.y + rad * Math.cos(theta + deg2rad*180));
        return new pt(x,y);
    }
    
    const getConeEndPts2 = function(aoeType, oPt, coneDirection, coneWidth, rad, z) {
        let pt1, pt2;
        let deg2rad = Math.PI/180;
        
        coneDirection = normalizeTo360deg(coneDirection);
        
        //define "cone" angles (in degrees)
        let th1 = deg2rad * (coneDirection - coneWidth/2);  //angle of trailing cone side
        let th2 = deg2rad * (coneDirection + coneWidth/2);  //angle of leading cone side
        
        if (aoeType === '5econe') {
            //a 5e cone is defined by the orgin and two pts
            pt1 = get5eConePt(oPt, rad+z, th1);
            pt2 = get5eConePt(oPt, rad+z, th2);
            //log(oPt);
            //log(pt1);
            //log(pt2);
        } else {
            //normal cone with equal radius throughout
            log('unhandled aoeType in getConeEndPts2 function')
        }
        
        let pts = [oPt, pt1, pt2];
        return pts;
    }
    
    
    const get5eConePt = function (oPt, rad, theta) {
        let deg2rad = Math.PI/180;
        //change in "normal" polar coord conversion due to 0deg being straight up and positive Y being "down"
        let x = Math.round(oPt.x + rad * Math.sin(theta));
        let y = Math.round(oPt.y + rad * Math.cos(theta + deg2rad*180));
        return new pt(x,y);
    }
    const get5eConePathPt = function (rad, theta) {
        let deg2rad = Math.PI/180;
        //change in "normal" polar coord conversion due to 0deg being straight up and positive Y being "down"
        let x = rad + rad * Math.sin(theta);
        let y = rad + rad * Math.cos(theta + deg2rad*180);
        return new pt(x,y);
    }
    
    const getConeEndPts = function(aoeType, oPt, coneDirection, coneWidth, rad, z) {
        let pt1, pt2;
        let deg2rad = Math.PI/180;
        
        //log('in getConeEndPts');
        coneDirection = normalizeTo360deg(coneDirection);
        //log('normalized coneDirection = ' + coneDirection);
        //define "cone" angles (in degrees)
        let th1 = deg2rad * (coneDirection - coneWidth/2);  //angle of trailing cone side
        let th2 = deg2rad * (coneDirection + coneWidth/2);  //angle of leading cone side
        
        if (aoeType === '5econe') {
            //a 5e cone is defined by the orgin and two pts
            //log('calling get5eConePt');
            pt1 = get5eConePt(oPt, rad+z, th1);
            pt2 = get5eConePt(oPt, rad+z, th2);
            //log(oPt);
            //log(pt1);
            //log(pt2);
        } else {
            //normal cone with equal radius throughout
            log('unhandled aoeType in getConeEndPts function')
        }
        
        let pts = [pt1, pt2];
        return pts;
    }
    /*
    const getConeEndPt = function(aoeType, oPt, coneDirection, rad) {
        log('test function')
        let x, y;
        let deg2rad = Math.PI/180;
        let compAngle;  //complimentary angle
        
        //angle is already normalized to 360 degrees (no negative or very large angles)
        if (bigAngle > 270 && bigAngle < 360) { //UL quadrant
            th = bigAngle - 270;
            if (aoeType === '5econe') {
                x = oPt.x - rad/Math.tan(th*deg2rad)
                y = oPt.y - rad;
            } else {
                x = oPt.x - rad * Math.cos(th*deg2rad);
                y = oPt.y - rad * Math.sin(th*deg2rad);
            }
        } else if (bigAngle > 0 && bigAngle < 90) { //UR quadrant
            th = bigAngle;
            if (aoeType === '5econe') {
                x = oPt.x + rad*Math.tan(th*deg2rad)
                y = oPt.y - rad;
            } else {
                x = oPt.x + rad * Math.sin(th*deg2rad);
                y = oPt.y - rad * Math.cos(th*deg2rad);
            }
        } else if (bigAngle > 90 && bigAngle < 180) { //LR quadrant
            th = bigAngle - 90;
            if (aoeType === '5econe') {
                x = oPt.x + rad/Math.tan(th*deg2rad)
                y = oPt.y + rad;
            } else {
                x = oPt.x + rad * Math.cos(th*deg2rad);
                y = oPt.y + rad * Math.sin(th*deg2rad);
            }
        } else if (bigAngle > 180 && bigAngle < 270) { //LL quadrant
            th = bigAngle - 180;
            if (aoeType === '5econe') {
                x = oPt.x - rad*Math.tan(th*deg2rad)
                y = oPt.y + rad;
            } else {
                x = oPt.x - rad * Math.sin(th*deg2rad);
                y = oPt.y + rad * Math.cos(th*deg2rad);
            }
        } else if (bigAngle === 0) { //straight up
            x = oPt.x;
            y = oPt.y - rad;
        } else if (bigAngle === 90) { //straight right
            x = oPt.x + rad;
            y = oPt.y;
        } else if (bigAngle === 180) { //straight down
            x = oPt.x;
            y = oPt.y + rad;
        } else if (bigAngle === 90) { //straight left
            x = oPt.x - rad;
            y = oPt.y;
        }
        
        let retPt = new pt(x, y);
        log('retPt follows');
        log(retPt);
        return retPt;
        
    }
    */
    
    /* 
        grid = [
            {
                cell = {
                    points: [ptUL, ptUR....],
                    area: 0
                }
            },
            {
                cell = {
                    points: [ptUL, ptUR....],
                    area: 0
                }
            }
        ]
    */
    
    
    
    //clockwise ordering of corner points of cell
    const getCellCoords = function(i, j, width, height=-999) {
        if (height === -999) {
            height = width;
        }
        let ptUL = new pt(i-width/2, j-height/2);
        let ptUR = new pt(i+width/2, j-height/2);
        let ptLR = new pt(i+width/2, j+height/2);
        let ptLL = new pt(i-width/2, j+height/2);
        let ptUL2 = new pt(i-width/2, j-height/2);
        
        let points = [ptUL, ptUR, ptLR, ptLL, ptUL2];    //note the repeat of ptUL to close the cell
        return points;
    }
    
    const pushUniquePtToArray = function(arr, obj) {
        const index = arr.findIndex((e) => e.x === obj.x && e.y === obj.y);
        if (index === -1) {
            arr.push(obj);
            return 1;
        } else {
            return 0;
        }
    }
    
    const pushUniqueElementToArray = function(arr, element) {
        const index = arr.findIndex((e) => e === element);
        if (index === -1) {
            arr.push(element);
            return 1;
        } else {
            return 0;
        }
    }
    
    const sortPathsByDistanceToOrigin = function(pathsArr, oPt) {
        let tempPath;
        let tempPt;
        let dist;
        
        //populate temp array of objects with pathIDs & dist
        let pathDistID = [];
        pathsArr.forEach((pathID) => {
            tempPath = getObj('path', pathID);
            tempPt = new pt(tempPath.get("left"), tempPath.get("top"))
            dist = distBetweenPts(tempPt, oPt);
            pathDistID.push({ id:pathID, dist: dist });
        });
        
        //sort temp array by dist
        let pathDistIDSorted = pathDistID.sort((a, b) => a.dist - b.dist);
        
        //copy the sorted xy coords to a return array
        let retArr = pathDistIDSorted.map(e => e.id);
        return retArr;
    }
    
    const sortPtsClockwise = function(ptsArr) {
        const center = ptsArr.reduce((acc, { x, y }) => {
            acc.x += x / ptsArr.length;
            acc.y += y / ptsArr.length;
            return acc;
        }, { x: 0, y: 0 });
        
        // Add an angle property to each point using tan(angle) = y/x
        const angles = ptsArr.map(({ x, y }) => {
            return { x, y, angle: Math.atan2(y - center.y, x - center.x) * 180 / Math.PI };
        });
        
        // Sort your points by angle
        const pointsSorted = angles.sort((a, b) => a.angle - b.angle);
        //log(pointsSorted);
        
        //copy the sorted xy coords to a return array
        let retArr = pointsSorted.map(pt => {
                        return {x:pt.x, y:pt.y}
                    });
        return retArr;
    }
    
    const getClosestGridPt = function(testPt, ptArray, pageGridIncrement) {
        //first, filter out points in the master array that are farther than 1 unit away
        let arr = ptArray.filter(pt => {
            if (pt.x <= testPt.x+70*pageGridIncrement && pt.x >= testPt.x-70*pageGridIncrement && 
                pt.y <= testPt.y+70*pageGridIncrement && pt.y >= testPt.y-70*pageGridIncrement) {
                return true;
            }
        });
        
        let minDist = 99999;
        let d, idx;
        arr.forEach((pt, i) => {
            d = distBetweenPts(pt, testPt);
            if (d < minDist) {
                minDist = d;
                idx = i;
            }
        });
        return arr[idx];
    }
    
    //function taken from https://stackoverflow.com/questions/37224912/circle-line-segment-collision/37225895
    const getLineCircleIntersections = function (pt1, pt2, centerPt, rad){
        let a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
        
        let circle = {
            radius : rad,
            center : centerPt,
        }
        
        let line = {
            p1 : pt1,
            p2 : pt2,
        }
        
        v1 = {};
        v2 = {};
        v1.x = line.p2.x - line.p1.x;
        v1.y = line.p2.y - line.p1.y;
        v2.x = line.p1.x - circle.center.x;
        v2.y = line.p1.y - circle.center.y;
        b = (v1.x * v2.x + v1.y * v2.y);
        c = 2 * (v1.x * v1.x + v1.y * v1.y);
        b *= -2;
        d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
        if(isNaN(d)){ // no intercept
            return [];
        }
        u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
        u2 = (b + d) / c;    
        retP1 = {};   // return points
        retP2 = {}  
        ret = []; // return array
        if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
            retP1.x = line.p1.x + v1.x * u1;
            retP1.y = line.p1.y + v1.y * u1;
            ret[0] = retP1;
        }
        if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
            retP2.x = line.p1.x + v1.x * u2;
            retP2.y = line.p1.y + v1.y * u2;
            ret[ret.length] = retP2;
        }       
        return ret;
    }
    
    const isPointInCircle = function (pt, centerPt, rad) {
        let d = Math.floor(distBetweenPts(pt, centerPt));   //rounded down to nearest pixel to account for floating point errors
        return d <= rad;
    }
    
    const getCircleLocations = function(pageGridCenters, aoeType, aoeFloat, minGridArea, oPt, cPt, rad, pageGridIncrement, offsetX, offsetY) {
        let circleCoords = {
            xVals: [],
            yVals: []
        }
        
        //log('rad = ' + rad);
        //log('offsetX = ' + offsetX);
        //log('-------oPt = ' + oPt.x + ',' + oPt.y);
        
        let bbRadX = rad;
        let bbRadY = rad;
        
        
        //Define grid.  Grid is determined by bounding box of AoE
                //Grid is comprised of an array of cell objects
                    //cell objects are comprised of an area scalar and an array of points(endpoints plus intersections) in clockwise order (for area calcs)
        let grid = [];
        
        let minX, maxX, minY, maxY;
        let minPt = new pt(oPt.x-bbRadX-offsetX, oPt.y-bbRadX-offsetX);
        let maxPt = new pt(oPt.x+bbRadX-offsetX, oPt.y+bbRadX-offsetX);
        minX = getClosestGridPt(minPt, pageGridCenters, pageGridIncrement).x;
        maxX = getClosestGridPt(maxPt, pageGridCenters, pageGridIncrement).x;
        minY = getClosestGridPt(minPt, pageGridCenters, pageGridIncrement).y;
        maxY = getClosestGridPt(maxPt, pageGridCenters, pageGridIncrement).y;
        
        
        //log('x range = ' + minX + ' to ' + maxX);
        //log('y range = ' + minY + ' to ' + maxY);
        for (let i=minX; i<=maxX; i=i+70*pageGridIncrement) {
            for (let j=minY; j<=maxY; j=j+70*pageGridIncrement) {
                //log('i = ' + i + ', j = ' + j);
                //i & j are the x&y coords of the center of each grid cell
                let centerOfCell = new pt(i, j);
                let cell = {
                    points: getCellCoords(i, j, 70*pageGridIncrement),  //initialized with [ptUL, ptUR, ptLR, ptLL, ptUL] (note repeat of ptUL to close the cell
                    center: centerOfCell,
                    area: 0
                }
                grid.push(cell);
            }
        }
        //log(grid);
        
        //find cells where all corners are within the cone OR there is a valid intersection of the cone with the cell. Remove all other cells from grid 
        //let circleAoEPolygon = [new pt(oPt.x-bbRadX-offsetX,oPt.y-bbRadY-offsetY), new pt(oPt.x+bbRadX+offsetX,oPt.y-bbRadY-offsetY), new pt(oPt.x+bbRadX+offsetX,oPt.y+bbRadY+offsetY), new pt(oPt.x-bbRadX-offsetX,oPt.y+bbRadY+offsetY), new pt(oPt.x-bbRadX-offsetX,oPt.y-bbRadY-offsetY)];
        //log(circleAoEPolygon);
        for (let i=grid.length-1; i>-1; i--) {
            
            //log(i);
            //log('start checking for entire cell wihtin defined AoE');
            let ULinAoE = isPointInCircle(grid[i].points[0], oPt, rad);
            let URinAoE = isPointInCircle(grid[i].points[1], oPt, rad);
            let LRinAoE = isPointInCircle(grid[i].points[2], oPt, rad);
            let LLinAoE = isPointInCircle(grid[i].points[3], oPt, rad);
            //log(ULinAoE + ',' + URinAoE + ',' + LRinAoE + ',' + LLinAoE);
            
            if (!(ULinAoE && URinAoE && LRinAoE && LLinAoE)) {
                //log('entire cell not in circle, start checking intersections');
                //all corners not within circle, check for intersections
                
                let topIntersections = [];
                let rightIntersections = [];
                let bottomIntersections = [];
                let leftIntersections = [];
                let numAddedPts = 0;
                let insertIdx;
                let intPts = [];          //array of intersection points (circleAoE crossing cell border)
                let containsVertex = false;   //check the squareAoE corner points 
                let baseCell = grid[i].points.map(x => x);  //a copy of the base grid cell coordinates (used later to check for cone vertices)
                
                // intersections of top grid segment with circle
                intPts = getLineCircleIntersections(grid[i].points[0], grid[i].points[1], oPt, rad);
                if (intPts.length > 0) {
                    intPts.forEach(pt => {
                        pushUniquePtToArray(topIntersections,pt)
                    });
                }
                
                // intersections of right grid segment with circle
                intPts = getLineCircleIntersections(grid[i].points[1], grid[i].points[2], oPt, rad);
                if (intPts.length > 0) {
                    intPts.forEach(pt => {
                        pushUniquePtToArray(rightIntersections,pt)
                    });
                }
                
                // intersections of bottom grid segment with circle
                intPts = getLineCircleIntersections(grid[i].points[2], grid[i].points[3], oPt, rad);
                if (intPts.length > 0) {
                    intPts.forEach(pt => {
                        pushUniquePtToArray(bottomIntersections,pt)
                    });
                }
                
                // intersections of left grid segment with circle
                intPts = getLineCircleIntersections(grid[i].points[3], grid[i].points[4], oPt, rad);
                if (intPts.length > 0) {
                    intPts.forEach(pt => {
                        pushUniquePtToArray(leftIntersections,pt)
                    });
                }
                
                
                if (topIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + topIntersections.length + ' top intersections - ');
                    //log(topIntersections);
                    for (let t=0; t<topIntersections.length; t++) {
                        if (topIntersections[t]) {
                            grid[i].points.push(topIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, topIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (rightIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + rightIntersections.length + ' right intersections - ');
                    //log(rightIntersections);
                    for (let t=0; t<rightIntersections.length; t++) {
                        if (rightIntersections[t]) {
                            grid[i].points.push(rightIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, rightIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (bottomIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + bottomIntersections.length + ' bottom intersections - ');
                    //log(bottomIntersections);
                    for (let t=0; t<bottomIntersections.length; t++) {
                        if (bottomIntersections[t]) {
                            grid[i].points.push(bottomIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, bottomIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (leftIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + leftIntersections.length + ' left intersections - ');
                    //log(leftIntersections);
                    for (let t=0; t<leftIntersections.length; t++) {
                        if (leftIntersections[t]) {
                            grid[i].points.push(leftIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, leftIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                
                
                grid[i].points = sortPtsClockwise(grid[i].points);
                
                
                
                //must have two intersection pts to calculate area 
                if (numAddedPts < 2) {
                    grid.splice(i,1);
                } else {
                    //valid intersection, now filter out the grid points that are outside of the AoE (some corner pts from each cell)
                   
                    //log('### Sorted Grid pts with intersections')
                    //log(grid[i].points);
                    grid[i].points = grid[i].points.filter(pt => {
                        return isPointInCircle(pt, oPt, rad);
                    });
                    
                    grid[i].points = sortPtsClockwise(grid[i].points);
                    //log('### filtered Grid pts with intersections')
                    //log(grid[i].points);
                    
                    //calculate area with the filtered points that form an arbitrary polygon 
                    let area = calcPolygonArea(grid[i].points);
                    //log('grid after filter');
                    //log(grid[i].points);
                    //log('area of grid ' + i + ' = ' + area);
                    grid[i].area = area
                    //log('grid area = ' + grid[i].area)
                    //remove the grid cell if not enough area is covered by the cone
                    if (area < minGridArea*70*70*pageGridIncrement*pageGridIncrement) {
                        grid.splice(i,1);
                    }
                }
            } 
        }
        
        
        
        //We have a filtered array of grid cells. Return the coordinates of the center of each remaining cell
        for (let i=0; i<grid.length; i++) {
            circleCoords.xVals.push(grid[i].center.x);
            circleCoords.yVals.push(grid[i].center.y);
        }
        //log(oPt);
        //log(cPt);
        //log(rad);
        //log(offsetX);
        //log(offsetY);
        //log(circleCoords);
        return circleCoords;
        
    }
    
    const getSquareLocations = function(pageGridCenters, aoeType, aoeFloat, minGridArea, oPt, cPt, rad, pageGridIncrement, offsetX, offsetY) {
        let squareCoords = {
            xVals: [],
            yVals: []
        }
        
        //log('rad = ' + rad);
        //log('offsetX = ' + offsetX);
        //log('-------oPt = ' + oPt.x + ',' + oPt.y);
        
        let bbRadX = rad;
        let bbRadY = rad;
        
        
        //Define grid.  Grid is determined by bounding box of AoE
                //Grid is comprised of an array of cell objects
                    //cell objects are comprised of an area scalar and an array of points(endpoints plus intersections) in clockwise order (for area calcs)
        let grid = [];
        
        let minX, maxX, minY, maxY;
        let minPt = new pt(oPt.x-bbRadX-offsetX, oPt.y-bbRadX-offsetX);
        let maxPt = new pt(oPt.x+bbRadX-offsetX, oPt.y+bbRadX-offsetX);
        minX = getClosestGridPt(minPt, pageGridCenters, pageGridIncrement).x;
        maxX = getClosestGridPt(maxPt, pageGridCenters, pageGridIncrement).x;
        minY = getClosestGridPt(minPt, pageGridCenters, pageGridIncrement).y;
        maxY = getClosestGridPt(maxPt, pageGridCenters, pageGridIncrement).y;
        
        
        //log('x range = ' + minX + ' to ' + maxX);
        //log('y range = ' + minY + ' to ' + maxY);
        for (let i=minX; i<=maxX; i=i+70*pageGridIncrement) {
            for (let j=minY; j<=maxY; j=j+70*pageGridIncrement) {
                //log('i = ' + i + ', j = ' + j);
                //i & j are the x&y coords of the center of each grid cell
                let centerOfCell = new pt(i, j);
                let cell = {
                    points: getCellCoords(i, j, 70*pageGridIncrement),  //initialized with [ptUL, ptUR, ptLR, ptLL, ptUL] (note repeat of ptUL to close the cell
                    center: centerOfCell,
                    area: 0
                }
                grid.push(cell);
            }
        }
        //log(grid);
        
        //find cells where all corners are within the cone OR there is a valid intersection of the cone with the cell. Remove all other cells from grid 
        let squareAoEPolygon = [new pt(oPt.x-bbRadX-offsetX,oPt.y-bbRadY-offsetY), new pt(oPt.x+bbRadX+offsetX,oPt.y-bbRadY-offsetY), new pt(oPt.x+bbRadX+offsetX,oPt.y+bbRadY+offsetY), new pt(oPt.x-bbRadX-offsetX,oPt.y+bbRadY+offsetY), new pt(oPt.x-bbRadX-offsetX,oPt.y-bbRadY-offsetY)];
        //log(squareAoEPolygon);
        for (let i=grid.length-1; i>-1; i--) {
            
            //log(i);
            //log('start checking for entire cell wihtin defined AoE');
            let ULinAoE = isPointInPolygon(grid[i].points[0], squareAoEPolygon);
            let URinAoE = isPointInPolygon(grid[i].points[1], squareAoEPolygon);
            let LRinAoE = isPointInPolygon(grid[i].points[2], squareAoEPolygon);
            let LLinAoE = isPointInPolygon(grid[i].points[3], squareAoEPolygon);
            //log(ULinAoE + ',' + URinAoE + ',' + LRinAoE + ',' + LLinAoE);
            
            if (!(ULinAoE && URinAoE && LRinAoE && LLinAoE)) {
                //log('entire cell not in cone, start checking intersections');
                //all corners not within square, check for intersections (4 checks for each square segment)
                
                let topIntersections = [];
                let rightIntersections = [];
                let bottomIntersections = [];
                let leftIntersections = [];
                let numAddedPts = 0;
                let insertIdx;
                let intPt;          //intersection point (squareAoE edlge crossing cell border)
                let containsVertex = false;   //check the squareAoE corner points 
                let baseCell = grid[i].points.map(x => x);  //a copy of the base grid cell coordinates (used later to check for cone vertices)
                
                // intersections of top grid segment with two vertical lines of squareAoE
                intPt = getIntersectionPt(grid[i].points[0].x, grid[i].points[0].y, grid[i].points[1].x, grid[i].points[1].y, squareAoEPolygon[1].x, squareAoEPolygon[1].y, squareAoEPolygon[2].x, squareAoEPolygon[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(topIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[0].x, grid[i].points[0].y, grid[i].points[1].x, grid[i].points[1].y, squareAoEPolygon[3].x, squareAoEPolygon[3].y, squareAoEPolygon[4].x, squareAoEPolygon[4].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(topIntersections,intPt) }
                
                
                // intersections of right grid segment with two horizontal lines of squareAoE
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, squareAoEPolygon[0].x, squareAoEPolygon[0].y, squareAoEPolygon[1].x, squareAoEPolygon[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, squareAoEPolygon[2].x, squareAoEPolygon[2].y, squareAoEPolygon[3].x, squareAoEPolygon[3].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
                
                //log(grid[i].points);
                
                
                // intersections of bottom grid segment with two vertical lines of squareAoE
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, squareAoEPolygon[1].x, squareAoEPolygon[1].y, squareAoEPolygon[2].x, squareAoEPolygon[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, squareAoEPolygon[3].x, squareAoEPolygon[3].y, squareAoEPolygon[4].x, squareAoEPolygon[4].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                
                
                // intersections of left grid segment with two horizontal lines of squareAoE
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, squareAoEPolygon[0].x, squareAoEPolygon[0].y, squareAoEPolygon[1].x, squareAoEPolygon[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, squareAoEPolygon[2].x, squareAoEPolygon[2].y, squareAoEPolygon[3].x, squareAoEPolygon[3].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                
                
                if (topIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + topIntersections.length + ' top intersections - ');
                    //log(topIntersections);
                    for (let t=0; t<topIntersections.length; t++) {
                        if (topIntersections[t]) {
                            grid[i].points.push(topIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, topIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (rightIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + rightIntersections.length + ' right intersections - ');
                    //log(rightIntersections);
                    for (let t=0; t<rightIntersections.length; t++) {
                        if (rightIntersections[t]) {
                            grid[i].points.push(rightIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, rightIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (bottomIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + bottomIntersections.length + ' bottom intersections - ');
                    //log(bottomIntersections);
                    for (let t=0; t<bottomIntersections.length; t++) {
                        if (bottomIntersections[t]) {
                            grid[i].points.push(bottomIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, bottomIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (leftIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + leftIntersections.length + ' left intersections - ');
                    //log(leftIntersections);
                    for (let t=0; t<leftIntersections.length; t++) {
                        if (leftIntersections[t]) {
                            grid[i].points.push(leftIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, leftIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                
                //log('baseCell----------------');
                //log(baseCell)
                
                //check grid cell for squareAoEPolygon vertices
                //log('squareAoEPolygon---------')
                //log(squareAoEPolygon);
                containsVertex = isPointInPolygon(squareAoEPolygon[0],baseCell);
                if (containsVertex) {
                    //log('vertex 0 found at index ' + i)
                    let ptAdded = pushUniquePtToArray(grid[i].points,squareAoEPolygon[0]); //returns 1 if pt added, 0 if not added
                    numAddedPts += ptAdded;
                }
                
                containsVertex = isPointInPolygon(squareAoEPolygon[1],baseCell);
                if (containsVertex) {
                    //log('vertex 1 found at index ' + i)
                    let ptAdded = pushUniquePtToArray(grid[i].points,squareAoEPolygon[1]);
                    numAddedPts += ptAdded;
                }
                
                containsVertex = isPointInPolygon(squareAoEPolygon[2],baseCell);
                if (containsVertex) {
                    //log('vertex 2 found at index ' + i)
                    let ptAdded = pushUniquePtToArray(grid[i].points,squareAoEPolygon[2]);
                    numAddedPts += ptAdded;
                }
                
                containsVertex = isPointInPolygon(squareAoEPolygon[3],baseCell);
                if (containsVertex) {
                    //log('vertex 3 found at index ' + i)
                    let ptAdded = pushUniquePtToArray(grid[i].points,squareAoEPolygon[3]);
                    numAddedPts += ptAdded;
                }
                
                //if (verticesAdded) {
                    grid[i].points = sortPtsClockwise(grid[i].points);
                //}
                
                
                //must have two intersection pts to calculate area 
                if (numAddedPts < 2) {
                    grid.splice(i,1);
                } else {
                    //valid intersection, now filter out the grid points that are outside of the AoE (some corner pts from each cell)
                   
                    //log('### Sorted Grid pts with intersections')
                    //log(grid[i].points);
                    grid[i].points = grid[i].points.filter(pt => {
                        return isPointInPolygon(pt, squareAoEPolygon);
                    });
                    
                    grid[i].points = sortPtsClockwise(grid[i].points);
                    //log('### filtered Grid pts with intersections')
                    //log(grid[i].points);
                    
                    //calculate area with the filtered points that form an arbitrary polygon 
                    let area = calcPolygonArea(grid[i].points);
                    //log('grid after filter');
                    //log(grid[i].points);
                    //log('area of grid ' + i + ' = ' + area);
                    grid[i].area = area
                    //log('grid area = ' + grid[i].area)
                    //remove the grid cell if not enough area is covered by the cone
                    if (area < minGridArea*70*70*pageGridIncrement*pageGridIncrement) {
                        grid.splice(i,1);
                    }
                }
            } 
        }
        
        
        
        //We have a filtered array of grid cells. Return the coordinates of the center of each remaining cell
        for (let i=0; i<grid.length; i++) {
            squareCoords.xVals.push(grid[i].center.x);
            squareCoords.yVals.push(grid[i].center.y);
        }
        //log(oPt);
        //log(cPt);
        //log(rad);
        //log(offsetX);
        //log(offsetY);
        //log(squareCoords);
        return squareCoords;
        
    }
    
    const getConeLocations2 = function(pageGridCenters, aoeType, minGridArea, oPt, cPt, coneDirection, coneWidth, rad, pageGridIncrement, offsetX, offsetY) {
        let coneCoords = {
            xVals: [],
            yVals: []
        }
        let deg2rad = Math.PI/180;
        
        //Define grid.  Grid is determined by bounding box of AoE
                        //Grid is comprised of an array of cell objects
                            //cell objects are comprised of an area scalar and an array of points(endpoints plus intersections) in clockwise order (for area calcs)
        let z;
        if (aoeType === '5econe') {
            //log('calculating z');
            z = (rad / (2* Math.sin(Math.atan(0.5)))) - rad;
            //log('z = ' + z);
        } else {
            z = 0;
        }
        let coneEndPts = getConeEndPts2(aoeType, oPt, coneDirection, coneWidth, rad, z);    //3-element array with the origin and endPts of the cone (origin pt is excluded from this array)
        //log(coneEndPts);
        //determine the bounding box (bb) of the grid points based on the three control points of the cone
        //let maxDeltaX = Math.max(Math.abs(oPt.x-coneEndPts[1]), Math.abs(oPt.x-coneEndPts[2]));
        //let minX = 70*pageGridIncrement * Math.floor((oPt.x - 1.5*maxDeltaX) / (70*pageGridIncrement));
        //let maxX = 70*pageGridIncrement * Math.ceil((oPt.x - 1.5*maxDeltaX) / (70*pageGridIncrement));
        //let maxDeltaY = Math.max(Math.abs(oPt.x-coneEndPts[1]), Math.abs(oPt.x-coneEndPts[2]));
        //let minX = 70*pageGridIncrement * Math.floor((oPt.x - 1.5*maxDeltaX) / (70*pageGridIncrement));
        
        
        
        let sizeX = Math.max(Math.abs(coneEndPts[0].x-coneEndPts[1].x), Math.abs(coneEndPts[1].x-coneEndPts[2].x), Math.abs(coneEndPts[2].x-coneEndPts[0].x));
        let sizeY = Math.max(Math.abs(coneEndPts[0].y-coneEndPts[1].y), Math.abs(coneEndPts[1].y-coneEndPts[2].y), Math.abs(coneEndPts[2].y-coneEndPts[0].y));
        
        //log('sizeX = ' + sizeX);
        //log('sizeY = ' + sizeY);
        //log(pageGridIncrement);
        //Extend the bounding box by 1.5 times 
        let bbRadX = Math.ceil(sizeX*1.5/(70*pageGridIncrement)) * 70*pageGridIncrement;
        let bbRadY = Math.ceil(sizeY*1.5/(70*pageGridIncrement)) * 70*pageGridIncrement;
        //log('bbRadX = ' + bbRadX);
        //log('bbRadY = ' + bbRadY);
        //log('-------oPt = ' + oPt.x + ',' + oPt.y);
        
        //Define grid.  Grid is determined by bounding box of AoE
                //Grid is comprised of an array of cell objects
                    //cell objects are comprised of an area scalar and an array of points(endpoints plus intersections) in clockwise order (for area calcs)
        let grid = [];
        let minX, maxX, minY, maxY;
        let minPt = new pt(oPt.x-bbRadX-offsetX, oPt.y-bbRadX-offsetX);
        let maxPt = new pt(oPt.x+bbRadX-offsetX, oPt.y+bbRadX-offsetX);
        minX = getClosestGridPt(minPt, pageGridCenters, pageGridIncrement).x;
        maxX = getClosestGridPt(maxPt, pageGridCenters, pageGridIncrement).x;
        minY = getClosestGridPt(minPt, pageGridCenters, pageGridIncrement).y;
        maxY = getClosestGridPt(maxPt, pageGridCenters, pageGridIncrement).y;
        
        
        //let minX = oPt.x-bbRadX-offsetX;
        //let maxX = oPt.x+bbRadX-offsetX;
        //let minY = oPt.y-bbRadY-offsetY;
        //let maxY = oPt.y+bbRadY-offsetY;
        //log('x range = ' + minX + ' to ' + maxX);
        //log('y range = ' + minY + ' to ' + maxY);
        for (let i=minX; i<=maxX; i=i+70*pageGridIncrement) {
            for (let j=minY; j<=maxY; j=j+70*pageGridIncrement) {
        //for (let i=oPt.x-bbRadX-offsetX; i<=oPt.x+bbRadX-offsetX; i=i+70*pageGridIncrement) {
        //    for (let j=oPt.y-bbRadY-offsetY; j<=oPt.y+bbRadY-offsetY; j=j+70*pageGridIncrement) {
                //log('i = ' + i + ', j = ' + j);
                //i & j are the x&y coords of the center of each grid cell
                let centerOfCell = new pt(i, j);
                let cell = {
                    points: getCellCoords(i, j, 70*pageGridIncrement),  //initialized with [ptUL, ptUR, ptLR, ptLL, ptUL] (note repeat of ptUL to close the cell
                    center: centerOfCell,
                    area: 0
                }
                grid.push(cell);
            }
        }
        //log(grid);
        
        //find cells where all corners are within the cone OR there is a valid intersection of the cone with the cell. Remove all other cells from grid 
        for (let i=grid.length-1; i>-1; i--) {
        
            //log('start checking for entire cell in cone');
            let ULinCone = isPointInCone(grid[i].points[0], oPt, rad, coneDirection, coneWidth, true);
            let URinCone = isPointInCone(grid[i].points[1], oPt, rad, coneDirection, coneWidth, true);
            let LRinCone = isPointInCone(grid[i].points[2], oPt, rad, coneDirection, coneWidth, true);
            let LLinCone = isPointInCone(grid[i].points[3], oPt, rad, coneDirection, coneWidth, true);
            
            //log(i);
            if (!(ULinCone && URinCone && LRinCone && LLinCone)) {
                //log('entire cell not in cone, start checking intersections');
                //all corners not within cone, check for intersections (3 checks for each cone segment)
                
                let topIntersections = [];
                let rightIntersections = [];
                let bottomIntersections = [];
                let leftIntersections = [];
                let numAddedPts = 0;
                let insertIdx;
                let intPt;          //intersection point (cone edge crossing cell border)
                let containsVertex = false;   //check the cone origin & end points 
                let baseCell = grid[i].points.map(x => x);  //a copy of the base grid cell coordinates (used later to check for cone vertices)
                // (ptUL.x, ptUL.y, ptUR.x, ptUR.y, oPt.x, oPt.y, endPt.x, endPt.y);
                //log('checking for top intersections');
                //log(grid[i].points[0].x)
                //log(grid[i].points[0].y);
                //log(grid[i].points[1].x);
                //log(grid[i].points[1].y);
                //log(oPt.x);
                //log(oPt.y);
                //log(coneEndPts[1].x);
                //log(coneEndPts[1].y);
                
                intPt = getIntersectionPt(grid[i].points[0].x, grid[i].points[0].y, grid[i].points[1].x, grid[i].points[1].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(topIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[0].x, grid[i].points[0].y, grid[i].points[1].x, grid[i].points[1].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(topIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[0].x, grid[i].points[0].y, grid[i].points[1].x, grid[i].points[1].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(topIntersections,intPt) }
                
                
                //ptUR.x, ptUR.y, ptLR.x, ptLR.y, oPt.x, oPt.y, endPt.x, endPt.y
                //log('checking for right intersections');
                /*
                if (i===93) {
                    log(grid[i].points[1].x +','+ grid[i].points[1].y +','+ grid[i].points[2].x +','+ grid[i].points[2].y +','+ oPt.x +','+ oPt.y +','+ coneEndPts[1].x +','+ coneEndPts[1].y);
                    log(grid[i].points[1].x +','+ grid[i].points[1].y +','+ grid[i].points[2].x +','+ grid[i].points[2].y +','+ oPt.x +','+ oPt.y +','+ coneEndPts[2].x +','+ coneEndPts[2].y);
                    log(grid[i].points[1].x +','+ grid[i].points[1].y +','+ grid[i].points[2].x +','+ grid[i].points[2].y +','+ coneEndPts[1].x +','+ coneEndPts[1].y +','+ coneEndPts[2].x +','+ coneEndPts[2].y);
                }
                */
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
               
                
                //log(grid[i].points);
                
                //ptLR.x, ptLR.y, ptLL.x, ptLL.y, oPt.x, oPt.y, endPt.x, endPt.y
                //log('checking for bottom intersections');
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                
                //log(grid[i].points);
                
                //ptLL.x, ptLL.y, ptUL.x, ptUL.y, oPt.x, oPt.y, endPt.x, endPt.y
                //log('checking for left intersections');
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                
                //log(grid[i].points);
                
                if (topIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + topIntersections.length + ' top intersections - ');
                    //log(topIntersections);
                    for (let t=0; t<topIntersections.length; t++) {
                        if (topIntersections[t]) {
                            grid[i].points.push(topIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, topIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (rightIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + rightIntersections.length + ' right intersections - ');
                    //log(rightIntersections);
                    for (let t=0; t<rightIntersections.length; t++) {
                        if (rightIntersections[t]) {
                            grid[i].points.push(rightIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, rightIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (bottomIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + bottomIntersections.length + ' bottom intersections - ');
                    //log(bottomIntersections);
                    for (let t=0; t<bottomIntersections.length; t++) {
                        if (bottomIntersections[t]) {
                            grid[i].points.push(bottomIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, bottomIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                if (leftIntersections.length > 0) {
                    //log('index = ' + i + ' - found ' + leftIntersections.length + ' left intersections - ');
                    //log(leftIntersections);
                    for (let t=0; t<leftIntersections.length; t++) {
                        if (leftIntersections[t]) {
                            grid[i].points.push(leftIntersections[t]);
                            //grid[i].points.splice(insertIdx, 0, leftIntersections[t]);
                            numAddedPts += 1;
                        }
                    }
                    //log(grid[i].points);
                    //log('numAddedPts = ' + numAddedPts);
                }
                
                //check grid cell for cone origin and endpt vertices
                let verticesAdded = false;
                containsVertex = isPointInPolygon(coneEndPts[0],baseCell);
                if (containsVertex) {
                    //log('vertex 0 found at index ' + i)
                    verticesAdded = true;
                    let ptAdded = pushUniquePtToArray(grid[i].points,coneEndPts[0]); //returns 1 if pt added, 0 if not added
                    numAddedPts += ptAdded;
                }
                
                /*
                if (i===29) {
                    log('checking vertex 1 at index 29');
                    log(coneEndPts[1]);
                    log(baseCell);
                }
                */
                containsVertex = isPointInPolygon(coneEndPts[1],baseCell);
                if (containsVertex) {
                    //log('vertex 1 found at index ' + i)
                    verticesAdded = true;
                    let ptAdded = pushUniquePtToArray(grid[i].points,coneEndPts[1]);
                    numAddedPts += ptAdded;
                }
                
                containsVertex = isPointInPolygon(coneEndPts[2],baseCell);
                if (containsVertex) {
                    //log('vertex 2 found at index ' + i)
                    verticesAdded = true;
                    let ptAdded = pushUniquePtToArray(grid[i].points,coneEndPts[2]);
                    numAddedPts += ptAdded;
                }
                
                //if (verticesAdded) {
                    grid[i].points = sortPtsClockwise(grid[i].points);
                //}
                
                
                //must have two intersection pts to calculate area 
                if (numAddedPts < 2) {
                    grid.splice(i,1);
                } else {
                    //log('gonna filter grid');
                    //valid intersection, now filter out the grid points that are outside of the cone (some corner pts from each cell)
                    
                    //log('grid before filter');
                    //log(grid[i].points);
                    /*
                    if (i===71) {
                        log(grid[i].points);
                        log(oPt);
                        log(rad);
                        log(coneDirection);
                        log(coneWidth);
                    }
                    */
                    
                    grid[i].points = grid[i].points.filter(pt => {
                        return isPointInCone(pt, oPt, rad, coneDirection, coneWidth, true);
                    });
                    grid[i].points = sortPtsClockwise(grid[i].points);
                    //calculate area with the filtered points that form an arbitrary polygon 
                    let area = calcPolygonArea(grid[i].points);
                    //log('grid after filter');
                    //log(grid[i].points);
                    //log('area of grid ' + i + ' = ' + area);
                    grid[i].area = area
                    //remove the grid cell if not enough area is covered by the cone
                    if (area < minGridArea*70*70*pageGridIncrement*pageGridIncrement) {
                        grid.splice(i,1);
                    }
                }
                
                
            }
        }
        
        //We have a filtered array of grid cells. Return the coordinates of the center of each remaining cell
        for (let i=0; i<grid.length; i++) {
            coneCoords.xVals.push(grid[i].center.x);
            coneCoords.yVals.push(grid[i].center.y);
        }
        //log(coneCoords);
        return coneCoords;
    }
    
    
    const getConeLocations = function(aoeType, minGridArea, oPt, cPt, coneDirection, coneWidth, rad, pageGridIncrement) {
        let coneCoords = {
            xVals: [],
            yVals: []
        }
        let deg2rad = Math.PI/180;
        //log('entered getConeLocations');
        let z;
        if (aoeType === '5econe') {
            //log('calculating z');
            z = (rad / (2* Math.sin(Math.atan(0.5)))) - rad;
            //log('z = ' + z);
        } else {
            z = 0;
        }
        //log('about to call getConeEndPts');
        //log(aoeType);
        //log(oPt);
        //log(coneDirection)
        //log(coneWidth);
        //log(rad);
        
        ////end pts of cone based on originPt and (coneDirection - coneWidth/2)
        let coneEndPts = getConeEndPts(aoeType, oPt, coneDirection, coneWidth, rad, z);    //2-element array with the endPts of the cone (origin pt is excluded from this array)
        
        //log('coneEndPts');
        //log(coneEndPts);
        
        //Approach: if center of grid square is in cone, add to output. 
        //Otherwise, base on the area of the square covered by the cone. 
            // first get intersection points of line & sq, then call calcPolygonArea and compare area to threshold
        
        //loop through x&y coords of grid square centers near the origin. Bounding box determined by the radius of the cone
        //let minGridArea = 0; //temp hardcode
        
        //how far to extend the bounding box from origin (1.5*radius, but round up to the center of the nearest grid)
        //let bbRad = 35*pageGridIncrement + Math.ceil(rad*1.5/(70*pageGridIncrement)) * 70*pageGridIncrement;
        let bbRad = Math.ceil(rad*1.5/(70*pageGridIncrement)) * 70*pageGridIncrement;
        //log('bbRad = ' + bbRad);
        
        let counter = 0;
        for (i=oPt.x-bbRad; i<=oPt.x+bbRad; i=i+70*pageGridIncrement) {
            for (j=oPt.y-bbRad; j<=oPt.y+bbRad; j=j+70*pageGridIncrement) {
                let centerPt = new pt(i,j);
                let centerInCone = isPointInCone(centerPt, oPt, rad, coneDirection, coneWidth, true)
                
                if (centerInCone) {
                    coneCoords.xVals.push(i);
                    coneCoords.yVals.push(j);
                } else {
                    
                    //counter +=1;
                    //possible edge case, look for intersections of the outer cone vectors with squares and compare coverage areas
                    //if (counter ===1) {
                        
                        //log('originPt')
                        //log(oPt);
                        //log('controlPt')
                        //log(cPt);
                        //log('First Square')
                        //log(i + ',' + j)
                        
                        
                        let polygonPts1 = getSlicedSquarePolygon(oPt, coneEndPts[0], i, j, pageGridIncrement);
                        let polygonPts2 = getSlicedSquarePolygon(oPt, coneEndPts[1], i, j, pageGridIncrement);
                        let polygonPts3 = getSlicedSquarePolygon(coneEndPts[0], coneEndPts[1], i, j, pageGridIncrement);
                        //let polygonPts = polygonPts1.concat(polygonPts2);   //there may be duplicates 
                        let polygonPts = polygonPts1.concat(polygonPts2).concat(polygonPts3);   //there may be duplicates 
                        //log('polygonPts follows')
                        //log(polygonPts)
                        //log('num pts = ' + polygonPts.length);
                        
                        /*
                        if (polygonPts.length > 1) { 
                            log('polygonPts follows')
                            log(polygonPts)
                        }
                        */
                        
                        if (polygonPts.length > 4) {    //intersection will have at least 5 pts (3pts for adjacent sides of square with 2 intersection pts)
                            
                            
                            //found intersection, calculate area and compare to threshold
                            let area = calcPolygonArea(polygonPts);
                            
                            //log('area follows')
                            //log(area)
                            if (area >= minGridArea*70*70*pageGridIncrement*pageGridIncrement) {
                                counter +=1;
                                coneCoords.xVals.push(i);
                                coneCoords.yVals.push(j);
                            }
                        }
                    //}
                    
                    
                }
                
            }
        }
        //log('counter = ' + counter);
        
        return coneCoords;
    }
    
    //The following finds the intersection of the control line with the origin token (always thru center of token)
    //      then finds the closest possiblePt (corners or faces) to that intersection pt  
    const getNearestOriginPt = function(cPt, minX, minY, maxX, maxY, possiblePts) {
    	let intersectPt;
    	let dist;
        let minDist = 99999;
        let nearestPt;
        
        //log(cPt);
        //log(minX);
        //log(minY);
        //log(maxX);
        //log(maxY);
        //log(possiblePts);
        
    	let midX = (minX + maxX) / 2;
    	let midY = (minY + maxY) / 2;
    	// if (midX - x == 0) -> m == ±Inf -> minYx/maxYx == x (because value / ±Inf = ±0)
    	let m = (midY - cPt.y) / (midX - cPt.x);
        //log('m = ' + m);
    	if (cPt.x <= midX) { // check "left" side
    		let minXy = m * (minX - cPt.x) + cPt.y;
    		if (minY <= minXy && minXy <= maxY) {
    			intersectPt = {x: minX, y: minXy};
    		}
    	}
    
    	if (cPt.x >= midX) { // check "right" side
    		let maxXy = m * (maxX - cPt.x) + cPt.y;
    		if (minY <= maxXy && maxXy <= maxY) {
    			intersectPt = {x: maxX, y: maxXy};
    		}
    	}
        
    	if (cPt.y <= midY) { // check "top" side
    		let minYx = (minY - cPt.y) / m + cPt.x;
    		if (minX <= minYx && minYx <= maxX) {
    			intersectPt = {x: minYx, y: minY};
    		}
    	}
        
    	if (cPt.y >= midY) { // check "bottom" side
    		let maxYx = (maxY - cPt.y) / m + cPt.x;
    		if (minX <= maxYx && maxYx <= maxX) {
    			intersectPt = {x: maxYx, y: maxY};
    		}
    	}
       
        //log('intersectPt follows');
        //log(intersectPt);
    	// edge case when finding midpoint intersection: m = 0/0 = NaN
    	if (cPt.x === midX && cPt.y === midY) {
    	    intersectPt = {x: cPt.x, y: cPt.y};
    	}
    
        //Now, find the nearest "possiblePt" to this intersection pt
        
        for (i=0; i<possiblePts.length; i++) {
            dist = distBetweenPts(intersectPt, possiblePts[i]);
            if (dist < minDist || i===0) {
                nearestPt = possiblePts[i];
                minDist = dist;
            }
        }
        
        return nearestPt;
    }
    
    const getPossibleOriginPts = function(oPt, height, width, pageGridIncrement, allowFaces = false) {
        //gets all the corner points and 1/2 grid width faces around an origin pt
        let allPts = [];
        let ptIJ;
        
        let incr;
        if (allowFaces) {
            incr = 35*pageGridIncrement;
        } else {
            incr = 70*pageGridIncrement;
        }
        
        for (let i=oPt.x-width/2; i<=oPt.x+width/2; i += incr) {
            //ptIJ = {x: i, y: oPt.y-height};
            pushUniquePtToArray(allPts, {x: i, y: oPt.y-height/2});
            //allPts.push({x: i, y: oPt.y-height/2});
            //ptIJ = {x: i, y: oPt.y-height};
            pushUniquePtToArray(allPts, {x: i, y: oPt.y+height/2});
            //allPts.push({x: i, y: oPt.y+height/2});
        }
        for (let j=oPt.y-height/2; j<=oPt.y+height/2; j += incr) {
            pushUniquePtToArray(allPts,{x: oPt.x-width/2, y: j});
            pushUniquePtToArray(allPts,{x: oPt.x+width/2, y: j});
            
            //allPts.push({x: oPt.x-width/2, y: j});
            //allPts.push({x: oPt.x+width/2, y: j});
        }
        //sort the points clockwise
        allPts = sortPtsClockwise(allPts);
        return allPts;
    }
    
    const getPathLocations = function(link, oTok, cTok, originPtPx, controlPtPx, offsetX, offsetY, pageGridIncrement) {
        let locationsArr;       //return value - array of pts (x & y)
        let dX, dY;             //used in Bresenham algorithm
        let coneDirection = 0;   //angle (in degrees) between originPt & controlPt
        let rad = 0;            //radius of effect in pixels
        
        //find center coords of each token
        //let originPtPx = new pt(oTok.get('left'), oTok.get('top'))
        //let controlPtPx = new pt(cTok.get('left'), cTok.get('top'))
        //let oHeight = oTok.get('height');
        //let oWidth = oTok.get('width');
        
        let page = getObj("page", link.pageID);
        let pageGridCenters = [];
        let pageWidth = page.get('width');
        let pageHeight = page.get('height');
        for (let i=0-pageWidth; i<2*pageWidth; i++) {
            for (let j=0-pageHeight; j<2*pageHeight; j++) {
                pageGridCenters.push(new pt(35+i*70*pageGridIncrement, 35+j*70*pageGridIncrement))
            }
        }
        //log(pageGridCenters);
        //if (page) {
            //pageGridIncrement = page.get("snapping_increment");
            
            //possibly shift origin pt
            //link.originType = 'nope';
            //if (link.originType === 'nearest' && ( link.aoeType.match(/cone/i) || link.aoeType.match(/line/i) )) {
            //    let possibleOrigins = getPossibleOriginPts(originPtPx, oHeight, oWidth, pageGridIncrement)
            //    originPtPx = getNearestOriginPt(controlPtPx, originPtPx.x-oWidth/2, originPtPx.y-oHeight/2, originPtPx.x+oWidth/2, originPtPx.y+oHeight/2, possibleOrigins);
            //}
        
            
            
            let originPtU = convertPtPixels2Units(originPtPx, pageGridIncrement);
            let controlPtU = convertPtPixels2Units(controlPtPx, pageGridIncrement);
            
            //add error handling.
            //if (pageGridIncrement !== 0) {  //grid map
            //etc..
            
            switch (link.aoeType) {
                case '5econe':
                    //log('5e cone!!!');
                    //use pt in pixels for cones (higher resolution needed)
                    coneDirection = getAngle2ControlToken(originPtPx, controlPtPx);
                    if (link.range === 'variable') {
                        rad = distBetweenPts(originPtPx, controlPtPx);
                    } else {
                        rad = link.range;
                    }
                    let coneWidth = 53.14;  //hardcode for 5e cone
                    locationsArr = getConeLocations2(pageGridCenters, link.aoeType, link.minGridArea, originPtPx, controlPtPx, coneDirection, coneWidth, rad, pageGridIncrement, offsetX, offsetY)
                    break;
                case 'square':
                    rad = link.range;
                    if (link.range === 'variable' && !link.aoeFloat) {
                        rad = Math.max(Math.abs(originPtPx.x - controlPtPx.x), Math.abs(originPtPx.y - controlPtPx.y));
                    }
                    locationsArr = getSquareLocations(pageGridCenters, link.aoeType, link.aoeFloat, link.minGridArea, originPtPx, controlPtPx, rad, pageGridIncrement, offsetX, offsetY)
                    break;
                case 'circle':
                    rad = link.range;
                    if (link.range === 'variable' && !link.aoeFloat) {
                        rad = distBetweenPts(originPtPx, controlPtPx);
                    }
                    locationsArr = getCircleLocations(pageGridCenters, link.aoeType, link.aoeFloat, link.minGridArea, originPtPx, controlPtPx, rad, pageGridIncrement, offsetX, offsetY)
                    break;
                case 'line':
                    //pass through. 'line' is the default
                default:
                    if (link.range !== 'variable') {
                        //if pre-defined range, recalculate the controlPt (originPt remains the same)
                        let direction = getAngle2ControlToken(originPtPx, controlPtPx);
                        
                        controlPtPx = getNewControlPt(originPtPx, link.range, direction, pageGridIncrement)
                        controlPtU = convertPtPixels2Units(controlPtPx, pageGridIncrement);
                    }
                    locationsArr = getLineLocations(originPtU.x, originPtU.y, controlPtU.x, controlPtU.y, pageGridIncrement)
                    break;    
            }
            
            return locationsArr;
        //}
    }
    
    const getIndexFromPtArray = function(arr, pt){
        for (let i=0; i<arr.length; i++) {
            if (arr[i].x === pt.x && arr[i].y === pt.y) {
                return i;
            }
        }
        return -1;
    }
    
    async function updateMapWithAoE (aoeLinks, obj, recalcNearest=true, offsetX=0, offsetY=0) {
        let pathLocations;
        let newPaths = [];
        let pageGridIncrement;
        //let offsetX = 0;    //if the origin/control pts are shifted from center of cell, find offset to allow cell paths to line up with actual grid 
        //let offsetY = 0; 
        let updatedLink;
        let rad;
        
        //delete the linked paths and clear the pathIDs array from the state object
            
            //do for each matching link in state object 
            for (let a=0; a<aoeLinks.indices.length; a++) {
                newPaths = [];
                //log('a = ' + a);
              
                
               	//generate new paths based on aoeType and current posiitons or originTok and controlTok
                let oTok = getObj("graphic", aoeLinks.links[a].originTokID);
                let oHeight = oTok.get('height');
                let oWidth = oTok.get('width');
                
                let cTok = getObj("graphic", aoeLinks.links[a].controlTokID);
                let cHeight = cTok.get("height");
                let cWidth = cTok.get("width");
                
                let originPtPx = new pt(oTok.get('left'), oTok.get('top'))  //the origin coords of the effect (in pixels) - this may be different than the origin token center    
                let controlPtPx = new pt(cTok.get('left'), cTok.get('top')) //the coords of the control pt of the effect (in pixels) - this may be different than the control token center
                
                let pageID = aoeLinks.links[a].pageID
                let page = getObj("page", pageID);
                //let pageGridIncrement = page.get("snapping_increment");
                
                //log('pathIds right before delete')
                //log(aoeLinks.links[a].pathIDs);
                //physically delete existing paths
                deleteLinkedPaths(aoeLinks.links[a].pathIDs);
                /*
                aoeLinks.links[a].pathIDs.forEach((pathID) => {
                    log('this pathID = ' + pathID)
                    let thisPath = getObj('path',pathID);
                    log(thisPath);
                    if (thisPath) {
                        log('removing path ' + pathID);
                        thisPath.remove();
                        thisPath = getObj('path',pathID);
                        log(thisPath);
                    }  
                });
                */
                
                if (aoeLinks.links[a].aoeFloat===true && (aoeLinks.links[a].aoeType==='square' || aoeLinks.links[a].aoeType==='circle') ) {
                    originPtPx.x = controlPtPx.x;
                    originPtPx.y = controlPtPx.y;
                }
                
                if (page && recalcNearest) {
                    let oX, oY;
                    pageGridIncrement = page.get("snapping_increment");
                    
                    //possibly shift origin pt
                    //link.originType = 'nope';
                    if (aoeLinks.links[a].originType.match(/nearest/i) && aoeLinks.links[a].aoeType.match(/cone/i)) {
                        let possibleOrigins = getPossibleOriginPts(originPtPx, oHeight, oWidth, pageGridIncrement, aoeLinks.links[a].originType.match(/face/i))
                        aoeLinks.links[a].originPts = possibleOrigins.map((x) => x)
                        //log('STATE - originPts')
                        //log(aoeLinks.links[a].originPts)
                        
                        oX = originPtPx.x;
                        oY = originPtPx.y;
                        originPtPx = getNearestOriginPt(controlPtPx, originPtPx.x-oWidth/2, originPtPx.y-oHeight/2, originPtPx.x+oWidth/2, originPtPx.y+oHeight/2, possibleOrigins);
                        aoeLinks.links[a].originIndex = getIndexFromPtArray(possibleOrigins, originPtPx);
                        //log('STATE - originIndex' + aoeLinks.links[a].originIndex)
                        
                        offsetX = originPtPx.x - oX;
                        offsetY = originPtPx.y - oY;
                        //log('offsetX = ' + offsetX + ', offsetY = ' + offsetY);
                        //offsetX = oX - originPtPx.x;
                        //offsetY = oY - originPtPx.y;
                    } else {
                        aoeLinks.links[a].originPts = [originPtPx];
                        aoeLinks.links[a].originIndex = 0;
                    }
                } else if (page) {
                    pageGridIncrement = page.get("snapping_increment");
                    //use the originPt found in state object link
                    originIndex = aoeLinks.links[a].originIndex;
                    originPtPx = aoeLinks.links[a].originPts[originIndex];
                }
                
                //let aoeType = 'line';   //temp hardcode
                //aoeType = '5econe';   //temp hardcode
                pathLocations = getPathLocations(aoeLinks.links[a], oTok, cTok, originPtPx, controlPtPx, offsetX, offsetY, pageGridIncrement);
                //log('pathLocations follows');
                //log(pathLocations);
                
                
                //define the bounding box of affected grid squares
                let ptUL = new pt(Math.min(...pathLocations.xVals)-35*pageGridIncrement, Math.min(...pathLocations.yVals)-35*pageGridIncrement);
                let ptUR = new pt(Math.max(...pathLocations.xVals)+35*pageGridIncrement, Math.min(...pathLocations.yVals)-35*pageGridIncrement);
                let ptLR = new pt(Math.max(...pathLocations.xVals)+35*pageGridIncrement, Math.max(...pathLocations.yVals)+35*pageGridIncrement);
                let ptLL = new pt(Math.min(...pathLocations.xVals)-35*pageGridIncrement, Math.max(...pathLocations.yVals)+35*pageGridIncrement);
                aoeLinks.links[a].boundingBox = [ptUL, ptUR, ptLR, ptLL];
                //log(aoeLinks.links[a].boundingBox);
                
                let path;
                let pathstring;
                
                for (let p=0; p<pathLocations.xVals.length; p++) {
                    pathstring = buildSquarePath(35*pageGridIncrement);
                    path = await new Promise(function(resolve){
                        //let thePath = createPath(pathstring, pageID, 'gmlayer', '#ff000050', '#000000', 2, cHeight, cWidth, pathLocations.xVals[p], pathLocations.yVals[p]);
                        //let thePath = createPath(pathstring, pageID, 'objects', '#ff000050', '#000000', 2, cHeight, cWidth, pathLocations.xVals[p], pathLocations.yVals[p]);
                        let thePath = createPath(pathstring, pageID, 'objects', aoeLinks.links[a].aoeColor, '#000000', 2, cHeight, cWidth, pathLocations.xVals[p], pathLocations.yVals[p]);
                        resolve(thePath);
                    });
                    newPaths.push(path.get('_id'));
                }
                
                
                //create a path with the true outline of the AoE
                if (aoeLinks.links[a].aoeType==='5econe') {
                    //let originPtPx = new pt(oTok.get('left'), oTok.get('top'))
                    //let controlPtPx = new pt(cTok.get('left'), cTok.get('top'))
                    let coneDirection = getAngle2ControlToken(originPtPx, controlPtPx);
                    if (aoeLinks.links[a].range === 'variable') {
                        rad = distBetweenPts(originPtPx, controlPtPx);
                    } else {
                        rad = aoeLinks.links[a].range;
                    }
                    let coneWidth = 53.14;  //hardcode
                    let z = (rad / (2* Math.sin(Math.atan(0.5)))) - rad;
                
                    ////end pts of cone based on originPt and (coneDirection - coneWidth/2)
                    //let coneEndPts = getConeEndPts(aoeType, oPt, coneDirection, coneWidth, rad, z);
                    //log('rad = ' + rad);
                    //log('coneDirection = ' + coneDirection);
                    pathstring = build5eCone(rad, z, coneWidth, coneDirection)
                    path = await new Promise(function(resolve){
                        //let thePath = createPath(pathstring, pageID, 'gmlayer', 'transparent', '#ff0000', 3, rad*2, rad*2, originPtPx.x-z, originPtPx.y-z);
                        let thePath = createPath(pathstring, pageID, 'objects', 'transparent', aoeLinks.links[a].aoeOutlineColor, 3, rad*2, rad*2, originPtPx.x-z, originPtPx.y-z);
                        resolve(thePath);
                    });
                    //log('~~~~~~~~~~~~~~~~~~~~ TRIANGLE PATH~~~~~~~~~~~~~~~~~~~~');
                    //log(path)
                    newPaths.push(path.get('_id'));
                } else if (aoeLinks.links[a].aoeType==='square') {
                    rad = aoeLinks.links[a].range;
                    if (aoeLinks.links[a].range === 'variable' && !aoeLinks.links[a].aoeFloat) {
                        rad = Math.max(Math.abs(originPtPx.x-controlPtPx.x), Math.abs(originPtPx.y-controlPtPx.y));
                    } 
                    
                    pathstring = buildSquarePath(rad)
                    path = await new Promise(function(resolve){
                        //let thePath = createPath(pathstring, pageID, 'gmlayer', 'transparent', '#ff0000', 3, rad*2, rad*2, originPtPx.x-z, originPtPx.y-z);
                        let thePath = createPath(pathstring, pageID, 'objects', 'transparent', aoeLinks.links[a].aoeOutlineColor, 3, rad*2, rad*2, originPtPx.x, originPtPx.y);
                        resolve(thePath);
                    });
                    //log('~~~~~~~~~~~~~~~~~~~~ SQUARE PATH~~~~~~~~~~~~~~~~~~~~');
                    //log(path)
                    newPaths.push(path.get('_id'));
                } else if (aoeLinks.links[a].aoeType==='circle') {
                    if (aoeLinks.links[a].range === 'variable') {
                        rad = distBetweenPts(originPtPx, controlPtPx);
                    } else {
                        rad = aoeLinks.links[a].range;
                    }
                    //log(rad)
                    pathstring = buildCirclePath(rad, 360, 0);
                    path = await new Promise(function(resolve){
                        //let thePath = createPath(pathstring, pageID, 'gmlayer', 'transparent', '#ff0000', 3, rad*2, rad*2, originPtPx.x-z, originPtPx.y-z);
                        let thePath = createPath(pathstring, pageID, 'objects', 'transparent', aoeLinks.links[a].aoeOutlineColor, 3, rad*2, rad*2, originPtPx.x, originPtPx.y);
                        resolve(thePath);
                    });
                    //log('~~~~~~~~~~~~~~~~~~~~ CIRCLE PATH~~~~~~~~~~~~~~~~~~~~');
                    //log(path)
                    newPaths.push(path.get('_id'));
                }
                
                
                //log('aoeLinks, newPaths, state before update');
                //log(aoeLinks);
                //log(newPaths);
                //log(state[scriptName])
                //log(a);
                //log('aoeLinks.indices[a] = ' + aoeLinks.indices[a]);
                
                //let updatedLink = updateAoELink(aoeLinks.indices[a], newPaths);
                
                //Update the State object with new paths, originIndex, and bounding box array
                updateAoELink(aoeLinks.indices[a], newPaths, aoeLinks.links[a].originIndex, aoeLinks.links[a].boundingBox);
                //updateAoELink(aoeLinks.indices[a], newPaths, aoeLinks.links[a].originIndex);
                
            }
    }
    
    const snapToIntersection = function (tok) {
        let pageID = tok.get('_pageid');
        let page = getObj("page", pageID);
        let pageGridIncrement = page.get('snapping_increment')
        let pageWidthPx = page.get('width')*70*pageGridIncrement;
        let pageHeightPx = page.get('height')*70*pageGridIncrement;
        
        //log('in snapToIntersection');
        //log(pageWidthPx);
        //log(pageHeightPx);
        //log(pageGridIncrement);
        
        let intersections = [];
        for (let i=0; i<=pageWidthPx; i+=70*pageGridIncrement) {
            for (let j=0; j<=pageHeightPx; j+=70*pageGridIncrement) {
                //log('i=' + i + ', j=' + j);
                
                intersections.push(new pt(i, j))
            }
        }
        //log('intersections.length = ' + intersections.length);
        let tokPt = new pt(tok.get('left'), tok.get('top'))
        let newPt = getClosestGridPt(tokPt, intersections, pageGridIncrement)
        //log(newPt);
        tok.set({left:newPt.x, top:newPt.y})
    }
    
    //Move DL path to remain under source token
    async function smartAoE_handleTokenChange (obj,prev) {
        //find all paths linked to token, returns an array of aoeLinks objects or undefined
                //aoeLinks object looks like {links:[{aoeType, originTokID, controlTokID, pathIDs[], pageID}], indices:[]}
        //let path;
        let pathLocations;
        let newPaths = [];
        let pageGridIncrement;
        let offsetX = 0;    //if the origin/control pts are shifted from center of cell, find offset to allow cell paths to line up with actual grid 
        let offsetY = 0; 
        
        let tokID = obj.get('id');
        let aoeLinks = getAoELinks(tokID);
        //log('aoeLinks = next line')
        //log(aoeLinks)
        
        
        //potentially force the AoEControlToken to snap to grid intersection for floating AoE squares
        let tempLinks = [];
        if (aoeLinks) {
            tempLinks = aoeLinks.links.filter(link => {
                return (link.controlTokID===tokID && link.aoeFloat===true && (link.aoeType==='square' || link.aoeType==='circle'))
            });
        }
        
        //log(tempLinks.length);
        if (tempLinks.length > 0) {
            snapToIntersection(obj);
        }
        
        if (aoeLinks && obj) {
            updateMapWithAoE(aoeLinks, obj);
        } 
    }
    
    const smartAoE_handleRemoveToken = function(obj) {
        //find all paths linked to token, returns an array of aoeLinks objects or undefined
                //aoeLinks object looks like {links:[{aoeType originTokID, controlTokID, pathIDs[], pageID}], indices:[]}
        let tokID = obj['id'];
        
        let aoeLinks = getAoELinks(obj.get('id'));
        
        if (aoeLinks) {
            //aoeLinks.indices.forEach((index) => {
            for (i=aoeLinks.indices.length-1; i>-1; i--) {
                //delete the linked paths and clear the the associated links arrays from the state object
                let stateLinkIndex = aoeLinks.indices[i];
                deleteLinkedPaths(state[scriptName].links[stateLinkIndex].pathIDs);
                //log('removing link index=' + index);
                //log(state[scriptName])
                //state[scriptName].links[index] = [];
                state[scriptName].links.splice(stateLinkIndex, 1)
                //log(state[scriptName])
            
            }    
        }
    };
    
    //returns character object for given name
    const getCharacterFromName = function (charName) {
        let character = findObjs({
            _type: 'character',
            name: charName
        }, {caseInsensitive: true})[0];
        return character;
    };
    
    function processInlinerolls(msg) {
    	if(_.has(msg,'inlinerolls')){
    		return _.chain(msg.inlinerolls)
    		.reduce(function(m,v,k){
    			var ti=_.reduce(v.results.rolls,function(m2,v2){
    				if(_.has(v2,'table')){
    					m2.push(_.reduce(v2.results,function(m3,v3){
    						m3.push(v3.tableItem.name);
    						return m3;
    					},[]).join(', '));
    				}
    				return m2;
    			},[]).join(', ');
    			m['$[['+k+']]']= (ti.length && ti) || v.results.total || 0;
    			return m;
    		},{})
    		.reduce(function(m,v,k){
    			return m.replace(k,v);
    		},msg.content)
    		.value();
    	} else {
    		return msg.content;
    	}
    }
    
    const processInlinerolls2 = function(str, parsedInlines) {
        let index;
        let inlineArr = [];
        let reg = /\$\[\[\d+\]\]/g;
        
        let foundInlines = str.match(reg) || [];
        
        foundInlines.forEach((inline) => {
            index = inline.replace(/\$\[\[/,'').replace(/\]\]/,'')
            str = str.replace(inline, parsedInlines[index].total);
            
            inlineArr.push(parsedInlines[index]);
        });
        return {text:str, inlines:inlineArr};
    }
    
    const parseArgs = function(msg) {
        msg.content = msg.content
            .replace(/<br\/>\n/g, ' ')
            .replace(/(\{\{(.*?)\}\})/g," $2 ")
        
        let parsedInlines = libInline.getRollData(msg) || [];
        //Check for inline rolls
        //inlineContent = processInlinerolls(msg);
        let args = msg.content.split(/\s+--/);
        args.shift();
        args = args.map(arg=>{
                let cmds = arg.split('|');
                let retVals = processInlinerolls2(cmds[1], parsedInlines);
                return {
                    cmd: cmds.shift().toLowerCase().trim(),
                    params: retVals.text,
                    inlines: retVals.inlines
                };
            });
        return args;
    };
    
    //replaceAttributes and processTokenRolls modified from Jakob's group-check script
    const replaceAttributes = function(formula, charID) {
        const myGetAttrByName = attrName => {
            const result = getAttrByName(charID, attrName);
            if (typeof result === "number") {
                return String(result);
            } else {
                return result || "";
            }
        }
        const replacer = (_, attrName) => myGetAttrByName(attrName);

      while (/@{(.*?)}/.test(formula)) formula = formula.replace(/@{(.*?)}/g, replacer);
      return formula;
    }
    
    
    const processTokenRolls = function(token, link, roll2x) {
        const charID = token.get("represents"),
            character = getObj("character", charID),
            displayName = token.get("name");
            tokenPic = token.get("imgsrc").replace(/(?:max|original|med)\.png/, "thumb.png");
        
        let attrs = findObjs({                              
            _type: "attribute",
            _characterid: charID
        }, {caseInsensitive: true});
        
        let resistances = '';
        let vulnerabilities = '';
        let immunities = '';
        
        if (attrs) {
            //Resistances
            let tempAttrs = attrs.filter(att => att.get('name').toLowerCase().indexOf(link.resistAttr) === 0);
            if (tempAttrs.length > 0) { resistances = tempAttrs[0].get("current") }
            
            //Vulnerabilities
            tempAttrs = attrs.filter(att => att.get('name').toLowerCase().indexOf(link.vulnerableAttr) === 0);
            if (tempAttrs.length > 0) { vulnerabilities = tempAttrs[0].get("current") }
            
            //Immunities
            tempAttrs = attrs.filter(att => att.get('name').toLowerCase().indexOf(link.immunityAttr) === 0);
            if (tempAttrs.length > 0) { immunities = tempAttrs[0].get("current") }
        }
        let computedFormula;
        if (character) {
            computedFormula = replaceAttributes(link.saveFormula, charID);
        } else {
            return null;
        }
        
        //if (ro === "adv") computedFormula = `${computedFormula.replace(/1?d20/, opts.die_adv)} (Advantage)`;
        //if (ro === "dis") computedFormula = `${computedFormula.replace(/1?d20/, opts.die_dis)} (Disadvantage)`;
        
        return {
            "pic": tokenPic,
            "name": displayName,
            //"roll2": (ro === "roll2"),
            "saveName": link.saveName,
            "DC": link.DC,
            //"damage": damage,
            "roll2x": roll2x,
            "formula": computedFormula,
            "id": token.id,
            "resistances": resistances,
            "vulnerabilities": vulnerabilities,
            "immunities": immunities,
        };
    }
    
    // Format inline rolls
    const extractDiceRoll = roll => {
        if (roll.type === "V" && roll.rolls) {
            return roll.rolls.map(extractDiceRoll).reduce((m,x) => m+x,0);
        }
        if (roll.type === "G" && roll.rolls) {
            return _.flatten(roll.rolls).map(extractDiceRoll).reduce((m,x) => m+x,0);
        }
        if (roll.type === "R") {
            return roll.results.filter(x => x.v && !x.d).map(x => x.v).reduce((m,x) => m+x,0);
        } else {
            return 0;
        }
    };
    
    const processDamageMessages = function(messages, damageRolls) {
        messages.forEach((msgList, j) => {
            const inlinerollData = (msgList[0].inlinerolls || []).map(roll => {
                return {
                    raw: extractDiceRoll(roll.results),
                    result: roll.results.total || 0,
                    styled: makeInlineroll(roll, false, true) //convert to variable later
                };
            });
            msgList[0].content.split("<br>").forEach((str, n) => {
                damageRolls[j][`result_${(n+1)}`] = [];
                damageRolls[j][`raw_${(n+1)}`] = [];
                damageRolls[j][`styled_${n+1}`] = str.replace(/\$\[\[(\d+)\]\]/g, (_, number) => {
                    damageRolls[j][`result_${(n+1)}`].push(inlinerollData[parseInt(number)].result);
                    damageRolls[j][`raw_${(n+1)}`].push(inlinerollData[parseInt(number)].raw);
                    return inlinerollData[parseInt(number)].styled;
                });
            });
        });
        return damageRolls;
    }
    
    //this was modified from Jakob's group-check api script
    const processMessagesMaster = function(messages, damageRolls, tokenRolls, aoeLink) {
        //takes all the rolls that were processed thru the Roll20 die roller for all tokens and formats them.
        //   then, we will format the final chat output
        let freetext = "";
        let rowData = '';
        let saveName = tokenRolls[0].saveName;
        
        if (damageRolls.length > 0) {
            messages.forEach((msgList, j) => {
                const inlinerollData = (msgList[0].inlinerolls || []).map(roll => {
                    return {
                        raw: extractDiceRoll(roll.results),
                        result: roll.results.total || 0,
                        styled: makeInlineroll(roll, false) //convert to variable later
                    };
                });
                
                msgList[0].content.split("<br>").forEach((str, n) => {
                    damageRolls[j][`result_${(n+1)}`] = [];
                    damageRolls[j][`raw_${(n+1)}`] = [];
                    damageRolls[j][`styled_${n+1}`] = str.replace(/\$\[\[(\d+)\]\]/g, (_, number) => {
                        damageRolls[j][`result_${(n+1)}`].push(inlinerollData[parseInt(number)].result);
                        damageRolls[j][`raw_${(n+1)}`].push(inlinerollData[parseInt(number)].raw);
                        return inlinerollData[parseInt(number)].styled;
                    });
                });
            });
        }
        
        Promise.all(tokenRolls.map(o => new Promise((resolve) => {
                sendChat("", `${o.formula}${o.roll2x ? `<br>${o.formula}` : ""}`, resolve);
            })))
            .then(async(messages) => processFinalMessages(messages, damageRolls, tokenRolls, aoeLink))
            .catch(sendErrorMessage);
    }
    
    const applyDamage = function(tokID, bar, damageArr, zeroHPmarker) {
        let tok = getObj('graphic', tokID);
        let currentHP = tok.get(`bar${bar}_value`) || 0;
        //let currentHP = tok.get('bar1_value') || 0;
        
        let name = tok.get('name');
        
        let damage = damageArr.map(e=>parseInt(e)).reduce((a, b) => (a+b));
        
        let newHP = Math.max(currentHP - damage, 0);
        
        if (zeroHPmarker && newHP===0) {
            let dummy = addStatusMarkers(tokID, zeroHPmarker);
        }
        
        tok.set(`bar${bar}_value`, newHP);
        
        return damage>0 ? `Applied ${damage} damage to ${name}` : '';
    }
    
    const addStatusMarkers = function(tokID, markerString) {
        let tok = getObj('graphic', tokID);
        let currentMarkers = tok.get('statusmarkers');
        
        //ensure no spaces between entries in the comma-delimited string
        markerString = markerString.split(',').map((s) => s.trim()).join(',');
        
        tok.set("statusmarkers", currentMarkers + ',' + markerString);
    }
    
    const removeStatusMarkers = function(tokID, markerString) {
        let tok = getObj('graphic', tokID);
        let currentMarkers = tok.get('statusmarkers').split(',');
        
        let markersToRemove = markerString.split(',');
        
        for (let i=currentMarkers.length-1; i>=0; i--) {
            for (let j=0; j<markersToRemove.length; j++) {
                if (currentMarkers[i]===markersToRemove[j]) {
                    currentMarkers.splice(i,1)
                }
            }
        }
        
        tok.set("statusmarkers", currentMarkers.join(','));
    }
    
    const applyMathRule = function(val, rule){  
        //rule should look like "*2", "-10", "/2", etc.
        rule = rule.replace(/\s+/g, '');
        
        let operator = rule.substring(0, 1);
        let operand = parseFloat(rule.replace(operator,''));
        
        switch (operator) {
            case "*":
                retVal = Math.floor(val * operand);
                break;
            case "/":
                retVal = Math.floor(val / operand);
                break;
            case "+":
                retVal = val + operand;
                break;
            case "-":
                retVal = val - operand;
                break;
        }
        return retVal;  
    }
    
    //this was modified from Jakob's group-check api script
    const processFinalMessages = function(messages, damageRolls, tokenRolls, aoeLink) {
        //takes all the rolls that were processed thru the Roll20 die roller for all tokens and formats them.
        //   then, we will format the final chat output
        let freetext = "";
        let rowData = '';
        let saveName = tokenRolls[0].saveName;
        let damageMessages = [];
        let autoApplyMsg = '';
        
        messages.forEach((msgList, j) => {
            const inlinerollData = (msgList[0].inlinerolls || []).map(roll => {
                return {
                    raw: extractDiceRoll(roll.results),
                    result: roll.results.total || 0,
                    styled: makeInlineroll(roll, false) //convert to variable later
                };
            });
            msgList[0].content.split("<br>").forEach((str, n) => {
                tokenRolls[j][`result_${(n+1)}`] = [];
                tokenRolls[j][`raw_${(n+1)}`] = [];
                tokenRolls[j][`styled_${n+1}`] = str.replace(/\$\[\[(\d+)\]\]/g, (_, number) => {
                    tokenRolls[j][`result_${(n+1)}`].push(inlinerollData[parseInt(number)].result);
                    tokenRolls[j][`raw_${(n+1)}`].push(inlinerollData[parseInt(number)].raw);
                    return inlinerollData[parseInt(number)].styled;
                });
            });
        });
        
        // Format rows of output
        const lastIndex = tokenRolls.length - 1;
        const rolls = tokenRolls.map((o, i) => {
            return makeRow(o.pic, o.name, o.styled_1, (o.roll2x ? o.styled_2 : ""), i === lastIndex);
        });
        
        //log('BuildTitle')
        
        let outputNew = buildTitle(aoeLink.cardParameters);
        
        //if (damageRolls.length > 0) {
        if (damageRolls[0].result_1[0] > 0) {
            if (damageRolls.length > 1) {
                if (damageRolls[1].result_1[0] > 0) {
                    //two damage rolls
                    outputNew = outputNew + buildDamageRow(damageRolls[0].styled_1, aoeLink.damageType1, false, damageRolls[1].styled_1, aoeLink.damageType2, aoeLink.cardParameters)
                } else {
                    //one damage roll
                    outputNew = outputNew + buildDamageRow(damageRolls[0].styled_1, aoeLink.damageType1, false, '', '', aoeLink.cardParameters)
                }
            } else {
                //one damage roll
                outputNew = outputNew + buildDamageRow(damageRolls[0].styled_1, aoeLink.damageType1, false, '', '', aoeLink.cardParameters)
            }
        }
        
        let saveHeaderRow = buildSaveHeaderRow(aoeLink.cardParameters)
        
        //Calculate damage and status markers based on individual saving throws 
        const saveRolls = tokenRolls.map((o, i) => {
            let tempDam1, tempDam2;
            let thisDamage = [];
            let thisDamageType = [];
            let thisMarker = '';
            let RVI = [];   //Resistances, Vulnerabilities, Immunities 
            let RVI_string = '';
            
            tempDam1 = damageRolls[0].result_1;
            
            let damType1 = aoeLink.damageType1.toLowerCase()
            let damType2 = aoeLink.damageType2.toLowerCase()
            /*
            log(o.name)
            log('vulnerabilities = ' + o.vulnerabilities);
            log('resistances = ' + o.resistances);
            log('immunities = ' + o.immunities);
            
            log('vulnerableRule = ' + aoeLink.vulnerableRule);
            log('resistanceRule = ' + aoeLink.resistanceRule);
            log('immunityRule = ' + aoeLink.immunityRule);
            
            log('base damage1 = ' + tempDam1 + ' ' + damType1)
            */
            
            //Account for Vulnerabilities, resistances, and immunities for damage types 1 & 2
            if (o.vulnerabilities.includes(damType1)) { tempDam1 = applyMathRule(tempDam1, aoeLink.vulnerableRule); pushUniqueElementToArray(RVI, 'V') }
            if (o.resistances.includes(damType1)) { tempDam1 = applyMathRule(tempDam1, aoeLink.resistanceRule); pushUniqueElementToArray(RVI, 'R') }
            if (o.immunities.includes(damType1)) { tempDam1 = applyMathRule(tempDam1, aoeLink.immunityRule); pushUniqueElementToArray(RVI, 'I') }
            if (damageRolls.length > 1) {
                tempDam2 = damageRolls[1].result_1;
                if (o.vulnerabilities.includes(damType2)) { tempDam2 = applyMathRule(tempDam2, aoeLink.vulnerableRule); pushUniqueElementToArray(RVI, 'V') }
                if (o.resistances.includes(damType2)) { tempDam2 = applyMathRule(tempDam2, aoeLink.resistanceRule); pushUniqueElementToArray(RVI, 'R') }
                if (o.immunities.includes(damType2)) { tempDam2 = applyMathRule(tempDam2, aoeLink.immunityRule); pushUniqueElementToArray(RVI, 'I') }
            }
            if (RVI.length > 0) { RVI_string = RVI.join(',') }
            
            //check save result
            if (o.result_1 >= o.DC) {
                success = true;
                //thisDamage.push(Math.floor(damageRolls[0].result_1 / 2));
                tempDam1 = applyMathRule(tempDam1, aoeLink.damageSaveRule)
                
                //tempDam = applyMathRule(tempDam, aoeLink.resistanceRule)
                thisDamage.push(tempDam1);
                //check for 2nd damage type
                if (damageRolls.length > 1) {
                    //thisDamage.push(Math.floor(damageRolls[1].result_1 / 2));
                    tempDam2 = applyMathRule(tempDam2, aoeLink.damageSaveRule)
                    thisDamage.push(tempDam2);
                }
                if (aoeLink.conditionPass && aoeLink.autoApply) {
                    addStatusMarkers(o.id, aoeLink.conditionPass)
                }
                thisMarker = aoeLink.conditionPass;
            } else {
                success = false;
                thisDamage.push(tempDam1);
                if (damageRolls.length > 1) {
                    thisDamage.push(tempDam2);
                }
                if (aoeLink.conditionFail && aoeLink.autoApply) {
                    addStatusMarkers(o.id, aoeLink.conditionFail);
                }
                
                thisMarker = aoeLink.conditionFail;
            }
            
            if (aoeLink.autoApply) {
                let damMsg = applyDamage(o.id, aoeLink.damageBar, thisDamage, aoeLink.zeroHPmarker);
                if (damMsg !== '') { damageMessages.push(damMsg) };
            }
            
            return buildSaveRow(o.pic, o.id, o.name, success, o.styled_1, false, thisDamage, aoeLink.autoApply, aoeLink.damageBar, thisMarker, RVI_string, aoeLink.zeroHPmarker, aoeLink.cardParameters);
        });
        
        let allSaveRows = saveRolls.join("")
        
        let descRow = buildDescRow(aoeLink.cardParameters.descriptiontext, aoeLink.cardParameters)
        
        outputNew = outputNew + buildTableBody(saveHeaderRow, allSaveRows, descRow, aoeLink.cardParameters);
        
        log(outputNew);
        //sendChat(scriptName,'/w gm ' + outputNew);
        sendChat(scriptName, outputNew);
        
        if (damageMessages.length > 0) {
            autoApplyMsg = '<br>' + damageMessages.join('<br>');
            //sendChat(scriptName,'/w gm ' + autoApplyMsg);
            sendChat(scriptName, autoApplyMsg);
        }
    }
    
    const throwError = error => handleError(msg.playerid, error);
                    
    const sendErrorMessage = err => {
        const errorMessage = "Something went wrong with the roll. The command you tried was:<br>" +
            `${msg.content}<br>The error message generated by Roll20 is:<br>${err}`;
        throwError(errorMessage);
    };
    
    async function smartAoE_handleInput (msg) {
    //const smartAoE_handleInput = function(msg) {
        var who;
        var whisperString;
        var selectedID;
        var playerID;               //which player called the script. Will determine who gets whispered results 
        let tok;
        let tokID;
        let pageID;
        let selected = msg.selected;
        let range = 'variable';             //maximum range, in pixels
        let originType = 'center';         //"nearest" corner/face, "center"
        let aoeType = 'line';
        var controlTok;             //hoist to top so we can set from within a callback function
        let minGridArea = 0.01;            //from 0 to 1, minimum fraction of grid cell to be "counted" as within AoE (ignored for line effects)
        let minTokArea = 0.01;             //from 0 to 1, minimum fraction of token area in order to be "counted" as within AoE
        let aoeLinks;
        let fxType = '';
        var aoeColor = '#ff000050';
        var aoeOutlineColor = '#ff0000'
        let isDrawing = false;
        let ignoreAttr = '';
        let ignoreVal = '';
        let DC = 0;
        let saveFormula = '';
        let saveName = '';
        let damageFormula1 = 'damageFormula1';
        let damageFormula2 = 'damageFormula2';
        let rollDamage1 = false;
        let rollDamage2 = false;
        let damageBase1 = 0;
        let damageBase2 = 0;
        let damageExpression1 = '';
        let damageExpression2 = '';
        let damageType1 = '';
        let damageType2 = '';
        let damageBar = 1;
        let conditionFail = '';
        let conditionPass = '';
        let zeroHPmarker = '';
        let autoApply = false;
        let aoeFloat = false;
        
        let damageSaveRule = '*0.5';
        let resistanceRule = '*0.5';
        let vulnerableRule = '*2';
        let immunityRule = '*0';
        let resistAttr = 'npc_resistances';
        let vulnerableAttr = 'npc_vulnerabilities';
        let immunityAttr = 'npc_immunities';
        
        let pathstring;             //JSON string for paths
        let polygon = [];           //array containing points
        
        let oTok;                   //origin token
        let convertRange = "";      //will we need to convert range from pixels to "u" or another page-defined distance unit?
        let losBlocks = false;      //Will DL walls block AoE? (will look at 5 pts per token to determine LoS)
        
        
        
        try {
            //--------------------------------------------------------------------
            //   Apply Damage & Status Markers
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smartapply")==0) {
                let player = getObj('player',msg.playerid);
                if (player) {
                    who = getObj('player',msg.playerid).get('_displayname');
                    who===undefined ? whisperString='' : whisperString = `/w "${who}"`;
                } else {
                    whisperString='';
                }
                
                let args = msg.content.split(/\s+/);
                let damageMsg = '';
                
                let tokenID = args[1];
                let bar = args[2];
                let damageArr = args[3].split('/').map(e=>parseInt(e));
                
                let marker = args[4].replace(/%%/g,'::') || '';         //not all commands will include status marker(s)
                let zeroHPmarker = args[5].replace(/%%/g,'::') || ''    //not all commands will include seroHPmarker(s)
                
                let token = getObj('graphic', tokenID);
                if (token) {
                    damageMsg = applyDamage(tokenID, bar, damageArr, zeroHPmarker);
                    //sendChat(scriptName, `/w gm ${damageMsg}`)
                    sendChat(scriptName, damageMsg)
                    
                    if (marker) {
                        addStatusMarkers(tokenID, marker); 
                    }
                    
                } else {
                    sendChat(scriptName, `${whisperString} TokenID ${tokenID} does not seem to exist. Perhaps it was deleted or the id is incorrect.`, null, {
                        noarchive: true
                    });
                }
                
            }
            
            //--------------------------------------------------------------------
            //   Ping token
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().match(/!smartping[gm|all]/)) {
                let player = getObj('player',msg.playerid);
                if (player) {
                    who = getObj('player',msg.playerid).get('_displayname');
                    who===undefined ? whisperString='' : whisperString = `/w "${who}"`;
                } else {
                    whisperString='';
                }
                
                let args = msg.content.split(/\s+/);
                let tokenID = args[1];
                
                let token = getObj('graphic', tokenID);
                if (token) {
                    let page = getObj('page', token.get('_pageid'));
                    if (msg.content.includes('pingall')) {
                        sendPing(token.get("left"), token.get("top"), page.get('_id'), msg.playerid, true);
                    } else {
                        sendPing(token.get("left"), token.get("top"), page.get('_id'), msg.playerid, true, msg.playerid);
                    }
                } else {
                    sendChat(scriptName, `${whisperString} TokenID ${tokenID} does not exist. Perhaps it was deleted or the id is incorrect.`, null, {
                        noarchive: true
                    });
                }
            }
            
            //--------------------------------------------------------------------
            //   Rotate origin pt commands
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smartrotateorigin")==0) {
               let player = getObj('player',msg.playerid);
                if (player) {
                    who = getObj('player',msg.playerid).get('_displayname');
                    who===undefined ? whisperString='' : whisperString = `/w "${who}"`;
                } else {
                    whisperString='';
                }
                
                let cmd = msg.content.split(/\s+/);
                //log(cmd);
                
                if (cmd.length > 1) {
                    let tok;
                    let direction;  // either +1 or -1
                    let newindex;
                    let updatedLink;
                    
                    tok = getObj("graphic",msg.selected[0]._id);
                    //log(tok);
                    
                    if (!tok) {
                        sendChat(scriptName,`${whisperString} You must select a token to proceed`);
                        return;
                    }
                    
                    if (cmd[1].match(/ccw/i)) {
                        //rotate originPt counter-clockwise
                        direction = -1;
                    } else {
                        //default: rotate originPt clockwise
                        direction = 1;
                        //log('direction = ' + direction);
                    }
                    
                    aoeLinks = getAoELinks(tok.get('id'));
                    
                    if (aoeLinks.indices.length > 0) {
                        //for each link associated with selected token (could be originTok or controlTok)
                        for (let a=0; a<aoeLinks.indices.length; a++) {
                            if (aoeLinks.links[a].aoeFloat === false) {     //if floating AoE, rotating the origin point has no meaning
                            
                                //find new index (recycle through array of potential originPts)
                                if (aoeLinks.links[a].originIndex + direction < 0) {
                                    newIndex = aoeLinks.links[a].originPts.length - 1;
                                } else if (aoeLinks.links[a].originIndex + direction > aoeLinks.links[a].originPts.length - 1) {
                                    newIndex = 0;
                                } else {
                                    newIndex = aoeLinks.links[a].originIndex + direction;
                                }
                                //log('newIndex = ' + newIndex);
                                aoeLinks.links[a].originIndex = newIndex;
                                
                                //Update the State object with new origin index
                                let oTok = getObj("graphic", aoeLinks.links[a].originTokID)
                                let oX = oTok.get("left");
                                let oY = oTok.get("top");
                                let offsetX = aoeLinks.links[a].originPts[aoeLinks.links[a].originIndex].x - oX;
                                let offsetY = aoeLinks.links[a].originPts[aoeLinks.links[a].originIndex].y - oY;
                                //Re-draw the AoE on Map
                                updateMapWithAoE(aoeLinks, tok, false, offsetX, offsetY);
                            }
                        }
                    }
                    
                }
            }
            
            
            //--------------------------------------------------------------------
            //   Trigger AoE Effect
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smarttrigger")==0) {
               let player = getObj('player',msg.playerid);
                if (player) {
                    who = getObj('player',msg.playerid).get('_displayname');
                    who===undefined ? whisperString='' : whisperString = `/w "${who}"`;
                } else {
                    whisperString='';
                }
                
                tok = getObj("graphic",msg.selected[0]._id);
                //log(tok);
                
                tableLineCounter = 0
                
                //Initialize output formatting
                //cardParameters = {};
				//Object.assign(cardParameters,defaultParameters);
                
                pageID = tok.get("pageid");
                let thePage = getObj("page", pageID);
                pageGridIncrement = thePage.get("snapping_increment");
                
                //find links associated with the selected token
                aoeLinks = getAoELinks(tok.get('id'));
                //log('aoeLinks follows');
                //log(aoeLinks);
                
                //get an array of all tokens representing characters on the page
                let validToks = findObjs({                              
                    _pageid: pageID,                              
                    _type: "graphic"
                });
                //log('validToks before filter');
                //log(validToks);
                
                //only grab toks representing characters and on the object or gm layer
                validToks = validToks.filter(t => {
                    return t.get("represents") !== '' && 
                    t.get("name") !== 'AoEControlToken' & 
                    (t.get("layer")==='objects' || t.get("layer")==='gmlayer')
                });
                
                //add some key location & size params to validToks for later evaluation 
                validToks = validToks.map(t => {
                    return {
                        tok:t, 
                        center: new pt(t.get("left"), t.get("top")),
                        width: t.get("width"),
                        height: t.get("height"),
                        area: t.get("width") * t.get("height"),
                        corners: getCellCoords(t.get("left"), t.get("top"), t.get("width"), t.get("height")),
                        overlapArea: 0
                    }
                });
               
                //log('filtered validToks follows');
                //log(validToks);
                
                
                
                if (aoeLinks.indices.length > 0) {
                    //for each link associated with selected token (could be originTok or controlTok)
                    var tokenRolls = [];
                    var damageRolls = [];
                    for (let a=0; a<aoeLinks.indices.length; a++) {
                        //first, filter for "ignore" attributes
                        let thisValidToks = validToks.filter(obj => {
                            let attrs = {};
                            let represents = obj.tok.get('represents');
                            if (represents) {
                                attrs = findObjs({                              
                                    _type: "attribute",
                                    _characterid: represents,
                                    name: aoeLinks.links[a].ignoreAttr
                                }, {caseInsensitive: true});
                                if (attrs.length > 0) {
                                    return attrs[0].get("current") !== aoeLinks.links[a].ignoreVal.toString()
                                } else {
                                    return true;
                                }
                            }
                        });
                        
                        //Next, omit origin token and any tokens that don't have at least one corner in the AoE bounding box
                        thisValidToks = thisValidToks.filter(obj => {
                            return obj.tok.get("_id") !== aoeLinks.links[a].originTokID &&
                                (isPointInPolygon(obj.corners[0], aoeLinks.links[a].boundingBox) ||
                                isPointInPolygon(obj.corners[1], aoeLinks.links[a].boundingBox) ||
                                isPointInPolygon(obj.corners[2], aoeLinks.links[a].boundingBox) ||
                                isPointInPolygon(obj.corners[3], aoeLinks.links[a].boundingBox))
                        });
                        
                        //sort the linked paths by distance to originPt
                        let tempOriginPt = aoeLinks.links[a].originPts[aoeLinks.links[a].originIndex];
                        aoeLinks.links[a].pathIDs = sortPathsByDistanceToOrigin(aoeLinks.links[a].pathIDs, tempOriginPt);
                        //log(tempOriginPt);
                        
                        controlTok = getObj('graphic', aoeLinks.links[a].controlTokID);
                        //log(controlTok);
                        let tempControlPt = new pt(controlTok.get("left"), controlTok.get("top"));
                        //log(tempControlPt);
                        
                        //beam is a special fx, only fired once
                        if (aoeLinks.links[a].fxType.match(/beam/i) && aoeLinks.links[a].aoeType === 'line') {
                            //log(tempOriginPt);
                            //log(tempControlPt);
                            //log(aoeLinks.links[a].fxType);
                            spawnFxBetweenPoints(tempOriginPt, tempControlPt, aoeLinks.links[a].fxType, pageID)
                        }
                        
                        //do stuff for every affected square of the linked AoE
                        for (let p=0; p<aoeLinks.links[a].pathIDs.length; p++) {
                            let tempPath = getObj('path', aoeLinks.links[a].pathIDs[p])
                            if (tempPath) {
                                if (tempPath.get("width") <= 70*pageGridIncrement) {
                                    //possibly spawn FX
                                    if (aoeLinks.links[a].fxType !== '') {
                                            spawnFx(tempPath.get("left"), tempPath.get("top"), aoeLinks.links[a].fxType, pageID);
                                    }
                                    //log('pathID iteration p = ' + p);
                                    //log(thisValidToks);
                                    //check for tokens within affected grid square, add area overlapping with AoE
                                    for (let t=0; t<thisValidToks.length; t++) {
                                        //log('checking token');
                                        
                                        
                                        let pathRect = getCellCoords(tempPath.get("left"), tempPath.get("top"), tempPath.get("width"));
                                        //log(pathRect);
                                        let overlapArea = calcRectangleOverlapArea(pathRect, thisValidToks[t].corners);
                                        thisValidToks[t].overlapArea += overlapArea;
                                    }
                                }
                            }
                        }
                        
                        //define roll associated with base damage
                        if (aoeLinks.links[a].rollDamage1) {
                            damageRolls.push({formula:aoeLinks.links[a].damageFormula1});
                            if (aoeLinks.links[a].rollDamage2) {
                                damageRolls.push({formula:aoeLinks.links[a].damageFormula2});
                            }
                        } else {
                            damageRolls.push({formula:"[[" + aoeLinks.links[a].damageBase1 + "]]"});
                        }
                        
                        let foundIndex = -1;
                        let roll2x = true;
                        for (let t=0; t<thisValidToks.length; t++) {
                            //log(thisValidToks[t].overlapArea + 'vs. threshold ' + aoeLinks.links[a].minTokArea*thisValidToks[t].area);
                            if (thisValidToks[t].overlapArea >= aoeLinks.links[a].minTokArea*thisValidToks[t].area) {
                                //only add unique tokenids to the array of "hit" tokens
                                foundIndex = tokenRolls.findIndex((e) => e.id === thisValidToks[t].tok.get("_id"));
                                if (foundIndex === -1) {
                                    tokenRolls.push(processTokenRolls(thisValidToks[t].tok, aoeLinks.links[a], roll2x));
                                }
                            }
                        }
                        
                        Promise.all(damageRolls.map(o => new Promise((resolve) => {
                                sendChat("", `${o.formula}`, resolve);
                                //sendChat("", `${o.formula}${o.roll2 ? `<br>${o.formula}` : ""}`, resolve);
                                
                            })))
                            .then(async(messages) => processMessagesMaster(messages, damageRolls, tokenRolls, aoeLinks.links[a]))
                            .catch(sendErrorMessage);
                    } //end aoeLink loop
                    
                    //let affectedIDs = [];
                    //for (let i=0; i<tokenRolls.length; i++) {
                    //    affectedIDs.push(tokenRolls[i].id);
                    //    sendChat(scriptName,`/w "${who}" Token In area: ${tokenRolls[i].name} ${tokenRolls[i].formula} ${tokenRolls[i].formula}`);
                    //}
                    
                    /*
                    if (_.has(state, 'ScriptCards')) {
                        state['ScriptCards'].storedStringVariable = affectedIDs.join(',');
                        log(state['ScriptCards'].storedStringVariable);
                    }
                    */
                    
                }
                
            }
            
            
            //--------------------------------------------------------------------
            //   Normal script operation
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smartaoe")==0) {
                let player = getObj('player',msg.playerid);
                if (player) {
                    who = getObj('player',msg.playerid).get('_displayname');
                    who===undefined ? whisperString='' : whisperString = `/w "${who}"`;
                } else {
                    whisperString='';
                }
                
                let retVal = [];
                //Initialize output formatting
                cardParameters = {};
				Object.assign(cardParameters,defaultParameters);
                
                //Parse msg into an array of argument objects [{cmd:params}]
                let args = parseArgs(msg);
                //args.shift();
                //log(args);
                //assign values to our params arrray based on args
                args.forEach((arg) => {
                    let option = arg["cmd"].toLowerCase().trim();
                    let param = arg["params"].trim();
                    let inlines = arg["inlines"];
                    
                    //log(args);
                    switch(option) {
                        case "selectedid":
                            selectedID = param; 
                            break;
                        case "playerid":
                            playerID = param;
                            break;
                        case "range":
                            range = parseFloat(param);
                            let u = param.match(/[a-z]/i);   //if not an empty string, we will use page settings to convert range to "u" or other map-defined units
                            if (u !== null) {
                                convertRange = u[0]
                            }
                            break;
                        case "aoetype":
                            let w = param.toLowerCase();
                            if (w.includes('circle')) {
                                aoeType = 'circle';
                                if (w.includes('float')) {
                                    aoeFloat = true;
                                    isDrawing = true;
                                }
                            } else if (w.includes('sq')) {
                                aoeType = 'square';
                                if (w.includes('float')) {
                                    aoeFloat = true;
                                    isDrawing = true;
                                }
                            } else if (w.includes('5e')) {
                                aoeType = '5econe';
                                coneWidth = 53.14;
                            } else {    //default
                                aoeType = 'line';
                            }
                            let tempConeParams = param.split(",").map(layer => layer.trim() );
                            if (tempConeParams.length > 1) {
                                coneDirection = tempConeParams[1];  //this may be an angle or a tokenID. Later, we will parseFloat or find the angle between selected & target tokens
                            }
                            if (tempConeParams.length > 2 && aoeType !== '5e') {
                                coneWidth = parseFloat(tempConeParams[2]);
                            }
                            break;
                        case "origin":
                            originType = param;
                            break;
                        case "mingridarea":
                            minGridArea = parseFloat(param);
                            break;
                        case "mintokarea":
                            minTokArea = parseFloat(param);
                            break;
                        case "fx":
                            fxType = param;
                            break;
                        case "aoecolor":
                            if ( param.match(/#/) ) {
                                let f = param.split('#')
                                aoeColor = toFullColor(f[1])
                            }
                            break;
                        case "aoeoutlinecolor":
                            if ( param.match(/#/) ) {
                                let c = param.split('#')
                                aoeOutlineColor = toFullColor(c[1])
                            }
                            break;
                        case "isdrawing":
                            if (aoeFloat || _.contains(['true','yes', '1'], param.toLowerCase())) {
                                isDrawing = true;
                            }
                            break;
                        case "ignore":
                            let ig = param.split(',').map(e=>e.trim());
                            if (ig.length < 2) {
                                throw 'Invalid argument syntax.<br>Structure is --ignore|attrName,value';
                                //sendChat(scriptName,`/w "${who}" `+ 'Invalid argument syntax.<br>Structure is --ignore|attrName,value');
                            } else {
                                ignoreAttr = ig[0];
                                ignoreVal = ig[1];
                            }
                            break;
                        case "dc":
                            DC = parseInt(param);
                            break;
                        case "saveformula":
                            let s = param.toLowerCase();
                            if (saveList.hasOwnProperty(s)) {
                                saveFormula = saveList[s].formula;
                                saveName = saveList[s].name;
                            } else {
                                //custom formula, user-defined
                                saveFormula = param.replace('<<','[[').replace('>>',']]').replace('a{','@{');
                                //example: "<<1d20 +a{dodge}[DODGE]>>"" becomes "[[1d20 +@{dodge}[DODGE]]]"
                            }
                            break;
                        case "bar":
                            damageBar = parseInt(param);
                            break;
                        case "autoapply":
                            if (_.contains(['true','yes', '1'], param.toLowerCase())) {
                                autoApply = true;
                            }
                            break;
                        case "damageformula1":
                            let d1 = param.toLowerCase();
                            if (d1.search('<<') !== -1) {
                                //custom formula, user-defined
                                damageFormula1 = param.replace('<<','[[').replace('>>',']]').replace('a{','@{');
                                rollDamage1 = true;
                                
                                //example: "<<(8+?{Cast at what level?|3,0|4,1|5,2|6,3|7,4|8,5|9,6})d6>>"" becomes something like "[[(8+1)d6]]"
                            } else {
                                if (inlines[0] === undefined) {
                                    damageBase1 = parseInt(d1);
                                } else {
                                    damageFormula1 = `[[${inlines[0].expression}]]`;
                                    rollDamage1 = true;
                                }
                            }
                            break;
                        case "damageformula2":
                            let d2 = param.toLowerCase();
                            if (d2.search('<<') !== -1) {
                                //custom formula, user-defined
                                damageFormula2 = param.replace('<<','[[').replace('>>',']]').replace('a{','@{');
                                rollDamage2 = true;
                                //example: "<<(8+?{Cast at what level?|3,0|4,1|5,2|6,3|7,4|8,5|9,6})d6>>"" becomes something like "[[(8+1)d6]]"
                            } else {
                                if (inlines[0] === undefined) {
                                    damageBase1 = parseInt(d2);
                                } else {
                                    damageFormula2 = `[[${inlines[0].expression}]]`;
                                    rollDamage2 = true;
                                }
                            }
                            break;
                        case "damagetype1":
                            damageType1 = param;
                            break;
                        case "damagetype2":
                            damageType2 = param;
                            break;
                        case "conditionfail":
                            //ensure no spaces between commas (required for the statusmarkers property of graphic object)
                            conditionFail = param.split(',').map((s) => s.trim()).join(',');
                            break;
                        case "conditionpass":
                            //ensure no spaces between commas (required for the statusmarkers property of graphic object)
                            conditionPass = param.split(',').map((s) => s.trim()).join(',');
                            break;
                        case "zerohpmarker":
                            //ensure no spaces between commas (required for the statusmarkers property of graphic object)
                            zeroHPmarker = param.split(',').map((s) => s.trim()).join(',');
                            break;
                        case "resistattr":
                            resistAttr = param;
                            break;
                        case "vulnerableattr":
                            vulnerableAttr = param;
                            break;
                        case "immunityattr":
                            immunityAttr = param;
                            break;
                        case "damagesaverule":
                            damageSaveRule = param.replace(/\s+/g, '');
                            break;
                        case "resistancerule":
                            resistanceRule = param.replace(/\s+/g, '');
                            break;
                        case "vulnerablerule":
                            vulnerableRule = param.replace(/\s+/g, '');
                            break;
                        //Output formatting/content (CARD PARAMETERS)--------------------------------------
                        case "desc":
                        case "description":
                            cardParameters.descriptiontext = param.replace(/%(.*?)%/g, '<$1>');
                            break;
                        case "title":
                            cardParameters.title = param;
                            break;
                        case "leftsub":
                            cardParameters.leftsub = param;
                            break;
                        case "rightsub":
                            cardParameters.rightsub = param;
                            break;
                        case "titlecardbackground":
                            cardParameters.titlecardbackground = param;
                            break;
                        case "titlefontface":
                            cardParameters.titlefontface = param;
                            break;
                        case "titlefontcolor":
                            cardParameters.titlefontcolor = param;
                            break;
                        case "titlefontsize":
                            cardParameters.titlefontsize = param;
                            break;
                        case "titlefontlineheight":
                            cardParameters.titlefontlineheight = param;
                            break;
                        case "subtitlefontface":
                            cardParameters.subtitlefontface = param;
                            break;
                        case "subtitlefontcolor":
                            cardParameters.subtitlefontcolor = param;
                            break;
                        case "subtitlefontsize":
                            cardParameters.subtitlefontsize = param;
                            break;
                        case "bodyfontface":
                            cardParameters.bodyfontface = param;
                            break;
                        case "bodyfontsize":
                            cardParameters.bodyfontsize = param;
                            break;
                        case "tablebgcolor":
                            cardParameters.tablebgcolor = param;
                            break;
                        case "tableborder":
                            cardParameters.tableborder = param;
                            break;
                        case "tableborderradius":
                            cardParameters.tableborderradius = param;
                            break;
                        case "tableshadow":
                            cardParameters.tableshadow = param;
                            break;
                        case "titlecardbottomborder":
                            cardParameters.titlecardbottomborder = param;
                            break;
                        case "evenrowbackground":
                            cardParameters.evenrowbackground = param;
                            break;
                        case "oddrowbackground":
                            cardParameters.oddrowbackground = param;
                            break;
                        case "evenrowfontcolor":
                            cardParameters.evenrowfontcolor = param;
                            break;
                        case "oddrowfontcolor":
                            cardParameters.oddrowfontcolor = param;
                            break;
                        default:
                            retVal.push('Unexpected argument identifier (' + option + ').');
                            break;    
                    }
                }); //end forEach arg
                
                //who = getObj('player',msg.playerid).get('_displayname');
                
                //Token select or ID validation
                if (selectedID===undefined && msg.selected===undefined) {
                    sendChat(scriptName,`${whisperString} You must either select a token or pass the tokenID via --selectedID`);
                    return;
                }
                //Get the origin token object from either msg or an explicitly defined tokenID
                if('API' === msg.playerid) {
                    //SmartAoE WAS CALLED BY ANOTHER API SCRIPT
                    if (playerID === undefined || selectedID ===undefined) {
                        sendChat(scriptName, 'When SmartAoE is called by another script, it must pass both the selected token ID and the playerID');
                        return;
                    }
                    who = getObj('player',playerID).get('_displayname');
                    controlledby = playerID;
                    oTok = getObj("graphic",selectedID);
                } else {
                    //SmartAoE WAS CALLED DIRECTLY BY A PLAYER VIA CHAT. Get values from msg *IF* they weren't explicitly passed as arguments
                    if (selectedID===undefined) {
                        oTok = getObj("graphic",msg.selected[0]._id);
                    } else {
                        //log(selectedID);
                        oTok = getObj("graphic",selectedID);
                    }
                    //Set controlledBy property of token to determine who can move the control token.
                    if (playerID===undefined) {
                        controlledby = msg.playerid;
                    } else {
                        controlledby = playerID;
                    }
                    
                    if (oTok===undefined) {
                        //may have passed the character_id instead of token_id. Attempt to get oTok from the player page
                        let currentPageGraphics = findObjs({                              
                            _pageid: Campaign().get("playerpageid"),                              
                            _type: "graphic",
                            represents: selectedID
                        });
                        
                        oTok = currentPageGraphics[0];
                        if (oTok===undefined) {
                            sendChat(scriptName, 'Unable to find the origin token from the selectedID<br>If a characterID was passed, check the player ribbon page.');
                            return;
                        }
                    }
                }
                
                //First data validation checkpoint
                if (retVal.length > 0) {
                    sendChat(scriptName,`${whisperString} ${retVal}`);
                    return;
                };
                
                //----------------------------------------------------------------
                
                //Get token values and page settings
                originWidth = oTok.get("width")
                originHeight = oTok.get("height")
                originAvgSize = (originWidth+originHeight)/2;
                radius = originWidth/2;         
                pageID = oTok.get("pageid");
                
                originX = oTok.get("left");
                originY = oTok.get("top");
                originPt = new pt(originX, originY);
                
                //log('oTok_XY = ' + originX + ', ' + originY);
                
                let thePage = getObj("page", pageID);
                pageScaleNumber = thePage.get("scale_number");
                pageScaleUnits = thePage.get("scale_units");
                pageGridIncrement = thePage.get("snapping_increment");
                pageDL = thePage.get("showlighting") || thePage.get("dynamic_lighting_enabled")
                
                //possibly convert the range from user-supplied units to pixels
                if (convertRange !== "") {
                    if (pageGridIncrement !== 0) {  //grid map
                        if (convertRange === "u") {
                            range = range * 70 * pageGridIncrement;                 //convert from "u" to pixels
                        } else {
                            range = (range * 70 * pageGridIncrement) / pageScaleNumber; //convert from page units to pixels
                        }
                    } else {                        //gridless map, only use page settings
                        if (convertRange === "u") {
                            sendChat(scriptName, `${whisperString} Warning: Units \"u\" selected on a gridless map. Range will be calculated in pixels and will probably be much smaller than expected`);
                        } else {
                            range = (range * 70) / pageScaleNumber;
                        }
                    }
                }
                
                let spawnObj = getCharacterFromName(CONTROL_TOK_NAME);
                //log(spawnObj);
                if (spawnObj === undefined) {
                    sendChat(scriptName,`${whisperString} Error: Character \"${CONTROL_TOK_NAME}\" must be in the journal with a default token `);
                    return;
                }
                spawnObj.get("_defaulttoken", async function(defaultToken) {
                    //controlTok = await spawnTokenAtXY(who, defaultToken, pageID, originX, originY, originWidth, originHeight, controlledby);
                    controlTok = await spawnTokenAtXY(who, defaultToken, pageID, originX, originY, 70*pageGridIncrement, 70*pageGridIncrement, controlledby, isDrawing);
                    //log(controlTok);
                    let pathstring = buildSquarePath(35*pageGridIncrement);
                    //log(pathstring);
                    //let path = createPath(pathstring, pageID, 'gmlayer', '#ff000050', '#000000', 2, controlTok.get("height"), controlTok.get("width"), controlTok.get("left"), controlTok.get("top"));
                    //let path = createPath(pathstring, pageID, 'objects', '#ff000050', '#000000', 2, controlTok.get("height"), controlTok.get("width"), controlTok.get("left"), controlTok.get("top"));
                    
                    let path = createPath(pathstring, pageID, 'objects', aoeColor, '#000000', 2, controlTok.get("height"), controlTok.get("width"), controlTok.get("left"), controlTok.get("top"));
                    /*
                    let path = createObj("path", {                
                        pageid: controlTok.get("pageid"),
                        path: pathstring,
                        fill: "#ff000050",
                        stroke: "#000000",
                        layer: "gmlayer",
                        stroke_width: 2,
                        width: controlTok.get("width"),
                        height: controlTok.get("height"),
                        left: controlTok.get("left"),
                        top: controlTok.get("top"),
                    });
                    */
                    //log(JSON.parse(path.get("path")));
                    //log(path.get("id"));
                    
                    if (path) {
                        toFront(controlTok);
                        
                        //create a link between the source and control tokens (stored in state object)
                        let oPt = new pt(oTok.get('left'), oTok.get('top'))
                        
                        let newLink = makeAoELink(aoeType, aoeFloat, aoeColor, aoeOutlineColor, range, originType, oPt, minGridArea, minTokArea, oTok.get('_id'), controlTok.get('_id'), path.get('_id'), controlTok.get('_pageid'), fxType, saveFormula, saveName, ignoreAttr, ignoreVal, DC, damageBar, autoApply, damageFormula1, damageFormula2, damageBase1, damageBase2, damageType1, damageType2, rollDamage1, rollDamage2, damageSaveRule, resistanceRule, vulnerableRule, immunityRule, resistAttr, vulnerableAttr, immunityAttr, conditionPass, conditionFail, zeroHPmarker, cardParameters);
                        
                        //log('makeAoELink complete');
                        //sendChat(scriptName,`/w "${who}" `+ 'Darkness created on Dynamic Lighting layer');
                    } else {
                        sendChat(scriptName, `${whisperString} Unknown error. createObj failed. AoE path not created.`);
                        return;
                    }
                    //log('State after Spawned object')
                    //log(state[scriptName]);
                });
                
                
            }
        } 
        catch(err) {
            if (err.message===undefined) {
                sendChat(scriptName, whisperString + err);      //sent err code via throw
            } else {
                sendChat(scriptName, whisperString + 'Error: ' + err.message);
            }
        }
    };
    
    const populateTokenMarkerURLs = function() {
        // Retrieve list of token/status markers from the Campaign and create a URL lookup array based on name
		const tokenMarkers = JSON.parse(Campaign().get("token_markers"));
		//log(tokenMarkers);
		
		tokenMarkers.forEach((marker) => {
			tokenMarkerURLs[marker.tag] = marker.url;
		});
		//log(tokenMarkerURLs);
    }
    
    const registerEventHandlers = function() {
        on('chat:message', smartAoE_handleInput);
        on('change:graphic', smartAoE_handleTokenChange);
        on('destroy:graphic', smartAoE_handleRemoveToken);
        //on('destroy:path', smartAoE_handleRemovePath);
    };
 
    on("ready",() => {
        checkInstall();
        registerEventHandlers();
        populateTokenMarkerURLs();
        //clearCache('temp')
    });
})();
