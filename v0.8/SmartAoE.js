const SmartAoE = (() => {
    const scriptName = "SmartAoE";
    const version = '0.8';
    const schemaVersion = '0.1';
    const byTOKEN = 'TOKEN';
    const byPATH = 'PATH';
    const clearTOKEN = 'TOKEN';
    const clearALL = 'ALL';
    const CONTROL_TOK_NAME = 'AOEControlToken'
    
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
    
    const clearCache = function(who, tokID=undefined, pageID=undefined) {
        //no arguments passed, clear all pinked pairs in ENTIRE CAMPAIGN
        if(!tokID && !pageID) {
            state[scriptName] = {
                version: schemaVersion,
                links: []
            };
            //if (!silent) {
                sendChat(scriptName,`/w "${who}" `+ 'SmartAoE paths unlinked!');
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
                    sendChat(scriptName,`/w "${who}" `+ 'SmartAoE paths unlinked for tokID = ' + tokID);
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
            sendChat(scriptName,`/w "${who}" `+ 'SmartAoE paths unlinked for all tokens in pageID = ' + pageID);
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
    
    const makeAoELink = function(aoeType, range, originType, originPt, minGridArea, minTokArea, originTokID, controlTokID, pathIDs, pageID, fxType) {
        //log(originTokID + ',' + controlTokID + ',' + pathIDs + ',' + pageID);
        let pathArr = [];
        pathArr.push(pathIDs);
        let link =  {
            //tokName: state[scriptName].links.length.toString(),
            aoeType: aoeType,
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
            pathIDs: pathArr
        };
        
        state[scriptName].links.push(link);
        return link;
    }
    
    //Return object containing arrays of {[linkObj], [indices]} from state object, given tokenID or pathID based on searchType. Returns undefined if none found. 
    const getAoELinks = function(ID) {
        let linkObjs = [];
        let indices = [];
        
        //log('finding link for tokID = ' + ID);
        state[scriptName].links.forEach((link, index) => {
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
    
    const spawnTokenAtXY =  function(who, tokenJSON, pageID, spawnX, spawnY, sizeX, sizeY, controlledby) {
        let spawnObj;
        let imgsrc;
        
        try {
            let baseObj = JSON.parse(tokenJSON);
            
            //set token properties
            baseObj.pageid = pageID;
            baseObj.left = spawnX;
            baseObj.top = spawnY;
            baseObj.width = sizeX;
            baseObj.height = sizeY;
            baseObj.controlledby = controlledby;
            
            baseObj.imgsrc = getCleanImgsrc(baseObj.imgsrc); //ensure that we're using the thumb.png
            
            //image must exist in personal Roll20 image library 
            if (baseObj.imgsrc ===undefined) {
                sendChat(scriptName,`/w "${who}" `+ 'Unable to find imgsrc for default token of \(' + baseObj.name + '\)' + "<br>" + 'You must use an image file that has been uploaded to your Roll20 Library.')
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
          sendChat('SmartAoE',`/w "${who}" `+ 'Unhandled exception: ' + err.message)
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
    
    const buildSquare = function(rad) {
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
    
    const buildCircle = function(rad, coneWidth, coneDirection) {
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
        if (Math.round(pt.x)===1306 && Math.round(pt.y)===1120) {
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
    
    const getConeLocations2 = function(aoeType, minGridArea, oPt, cPt, coneDirection, coneWidth, rad, pageGridIncrement, offsetX, offsetY) {
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
        //log('oPt follows');
        //log(oPt);
        
        //Define grid.  Grid is determined by bounding box of AoE
                //Grid is comprised of an array of cell objects
                    //cell objects are comprised of an area scalar and an array of points(endpoints plus intersections) in clockwise order (for area calcs)
        let grid = [];
        let minX = oPt.x-bbRadX-offsetX;
        let maxX = oPt.x+bbRadX-offsetX;
        let minY = oPt.y-bbRadY-offsetY;
        let maxY = oPt.y+bbRadY-offsetY;
        //log('x range = ' + minX + ' to ' + maxX);
        //log('y range = ' + minY + ' to ' + maxY);
        for (let i=oPt.x-bbRadX-offsetX; i<=oPt.x+bbRadX-offsetX; i=i+70*pageGridIncrement) {
            for (let j=oPt.y-bbRadY-offsetY; j<=oPt.y+bbRadY-offsetY; j=j+70*pageGridIncrement) {
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
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(rightIntersections,intPt) }
                
                //rightIntersections.push(getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y));
                //rightIntersections.push(getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y));
                //rightIntersections.push(getIntersectionPt(grid[i].points[1].x, grid[i].points[1].y, grid[i].points[2].x, grid[i].points[2].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y));
                //rightIntersections.sort((a, b) => b.y - a.y);
                
                //log(grid[i].points);
                
                //ptLR.x, ptLR.y, ptLL.x, ptLL.y, oPt.x, oPt.y, endPt.x, endPt.y
                //log('checking for bottom intersections');
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(bottomIntersections,intPt) }
                
                //bottomIntersections.push(getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y));
                //bottomIntersections.push(getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y));
                //bottomIntersections.push(getIntersectionPt(grid[i].points[2].x, grid[i].points[2].y, grid[i].points[3].x, grid[i].points[3].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y));
                
                //log(grid[i].points);
                
                //ptLL.x, ptLL.y, ptUL.x, ptUL.y, oPt.x, oPt.y, endPt.x, endPt.y
                //log('checking for left intersections');
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                intPt = getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y);
                if (intPt) { let ptAdded = pushUniquePtToArray(leftIntersections,intPt) }
                
                //leftIntersections.push(getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, oPt.x, oPt.y, coneEndPts[1].x, coneEndPts[1].y));
                //leftIntersections.push(getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, oPt.x, oPt.y, coneEndPts[2].x, coneEndPts[2].y));
                //leftIntersections.push(getIntersectionPt(grid[i].points[3].x, grid[i].points[3].y, grid[i].points[4].x, grid[i].points[4].y, coneEndPts[1].x, coneEndPts[1].y, coneEndPts[2].x, coneEndPts[2].y));
                
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
                    locationsArr = getConeLocations2(link.aoeType, link.minGridArea, originPtPx, controlPtPx, coneDirection, coneWidth, rad, pageGridIncrement, offsetX, offsetY)
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
                    pathstring = buildSquare(35*pageGridIncrement);
                    path = await new Promise(function(resolve){
                        //let thePath = createPath(pathstring, pageID, 'gmlayer', '#ff000050', '#000000', 2, cHeight, cWidth, pathLocations.xVals[p], pathLocations.yVals[p]);
                        let thePath = createPath(pathstring, pageID, 'objects', '#ff000050', '#000000', 2, cHeight, cWidth, pathLocations.xVals[p], pathLocations.yVals[p]);
                        resolve(thePath);
                    });
                    newPaths.push(path.get('_id'));
                }
                
                //create a path with the true outline of the AoE
                if (aoeLinks.links[a].aoeType==='5econe') {
                    //let originPtPx = new pt(oTok.get('left'), oTok.get('top'))
                    //let controlPtPx = new pt(cTok.get('left'), cTok.get('top'))
                    let coneDirection = getAngle2ControlToken(originPtPx, controlPtPx);
                    let rad;
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
                        let thePath = createPath(pathstring, pageID, 'objects', 'transparent', '#ff0000', 3, rad*2, rad*2, originPtPx.x-z, originPtPx.y-z);
                        resolve(thePath);
                    });
                    //log('~~~~~~~~~~~~~~~~~~~~ TRIANGLE PATH~~~~~~~~~~~~~~~~~~~~');
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
        
        let aoeLinks = getAoELinks(obj.get('id'));
        //log('aoeLinks = next line')
        //log(aoeLinks);
        
        if (aoeLinks && obj) {
            
            updateMapWithAoE(aoeLinks, obj);
            /*
            //delete the linked paths and clear the pathIDs array from the state object
            
            //do for each matching link in state object 
            for (let a=0; a<aoeLinks.indices.length; a++) {
                newPaths = [];
                log('a = ' + a);
              
                
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
                
                
                if (page) {
                    pageGridIncrement = page.get("snapping_increment");
                    
                    //possibly shift origin pt
                    //link.originType = 'nope';
                    if (aoeLinks.links[a].originType.match(/nearest/i) && aoeLinks.links[a].aoeType.match(/cone/i)) {
                        let possibleOrigins = getPossibleOriginPts(originPtPx, oHeight, oWidth, pageGridIncrement, aoeLinks.links[a].originType.match(/face/i))
                        aoeLinks.links[a].originPts = possibleOrigins.map((x) => x)
                        log('STATE - originPts')
                        log(aoeLinks.links[a].originPts)
                        
                        let oX = originPtPx.x;
                        let oY = originPtPx.y;
                        originPtPx = getNearestOriginPt(controlPtPx, originPtPx.x-oWidth/2, originPtPx.y-oHeight/2, originPtPx.x+oWidth/2, originPtPx.y+oHeight/2, possibleOrigins);
                        aoeLinks.links[a].originIndex = getIndexFromPtArray(possibleOrigins, originPtPx);
                        log('STATE - originIndex' + aoeLinks.links[a].originIndex)
                        
                        offsetX = originPtPx.x - oX;
                        offsetY = originPtPx.y - oY;
                        log('offsetX = ' + offsetX + ', offsetY = ' + offsetY);
                        //offsetX = oX - originPtPx.x;
                        //offsetY = oY - originPtPx.y;
                    } else {
                        aoeLinks.links[a].originPts = [originPtPx];
                        aoeLinks.links[a].originIndex = 0;
                    }
                    
                }
                
                
                //physically delete existing paths
                aoeLinks.links[a].pathIDs.forEach((pathID) => {
                    //log('this pathID = ' + pathID)
                    let thisPath = getObj('path',pathID);
                    //log(thisPath);
                    if (thisPath) {
                        //log('removing path ' + pathID);
                        thisPath.remove();
                        //thisPath = getObj('path',pathID);
                        //log(thisPath);
                    }  
                });
                
                //let aoeType = 'line';   //temp hardcode
                //aoeType = '5econe';   //temp hardcode
                pathLocations = getPathLocations(aoeLinks.links[a], oTok, cTok, originPtPx, controlPtPx, offsetX, offsetY, pageGridIncrement);
                log('pathLocations follows');
                log(pathLocations);
                
                
                let path;
                let pathstring;
                
                for (let p=0; p<pathLocations.xVals.length; p++) {
                    pathstring = buildSquare(35*pageGridIncrement);
                    path = await new Promise(function(resolve){
                        let thePath = createPath(pathstring, pageID, 'gmlayer', '#ff000050', '#000000', 2, cHeight, cWidth, pathLocations.xVals[p], pathLocations.yVals[p]);
                        resolve(thePath);
                    });
                    newPaths.push(path.get('_id'));
                }
                
                //create a path with the true outline of the AoE
                if (aoeLinks.links[a].aoeType==='5econe') {
                    //let originPtPx = new pt(oTok.get('left'), oTok.get('top'))
                    //let controlPtPx = new pt(cTok.get('left'), cTok.get('top'))
                    let coneDirection = getAngle2ControlToken(originPtPx, controlPtPx);
                    let rad;
                    if (aoeLinks.links[a].range === 'variable') {
                        rad = distBetweenPts(originPtPx, controlPtPx);
                    } else {
                        rad = aoeLinks.links[a].range;
                    }
                    let coneWidth = 53.14;  //hardcode
                    let z = (rad / (2* Math.sin(Math.atan(0.5)))) - rad;
                
                    ////end pts of cone based on originPt and (coneDirection - coneWidth/2)
                    //let coneEndPts = getConeEndPts(aoeType, oPt, coneDirection, coneWidth, rad, z);
                    log('rad = ' + rad);
                    log('coneDirection = ' + coneDirection);
                    pathstring = build5eCone(rad, z, coneWidth, coneDirection)
                    path = await new Promise(function(resolve){
                        let thePath = createPath(pathstring, pageID, 'gmlayer', 'transparent', '#ff0000', 3, rad*2, rad*2, originPtPx.x-z, originPtPx.y-z);
                        resolve(thePath);
                    });
                    log('~~~~~~~~~~~~~~~~~~~~ TRIANGLE PATH~~~~~~~~~~~~~~~~~~~~');
                    log(path)
                    newPaths.push(path.get('_id'));
                }
                
                
                //log('aoeLinks, newPaths, state before update');
                //log(aoeLinks);
                //log(newPaths);
                //log(state[scriptName])
                //log(a);
                //log('aoeLinks.indices[a] = ' + aoeLinks.indices[a]);
                
                let updatedLink = updateAoELink(aoeLinks.indices[a], newPaths);
                
                
                
                
            }
            
            */
            
        } 
    }
    
    const smartAoE_handleRemoveToken = function(obj) {
        //find all paths linked to token, returns an array of aoeLinks objects or undefined
                //aoeLinks object looks like {links:[{aoeType originTokID, controlTokID, pathIDs[], pageID}], indices:[]}
        let tokID = obj['id'];
        //let tok = getObj("graphic", tokID);
        //let tokName = tok.get("name")
        
        let aoeLinks = getAoELinks(obj.get('id'));
        //log('aoeLinks for remove token');
        //log(aoeLinks);
        
        
        //let path = getObj("path",aoeLinks.links[0].pathIDs[0]);
        //log(path);
        //let bgColor = path.get("fill");
        //log('pathBGcolor = ' + bgColor)
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
            //});
        }
        
        
        /*
        //iterate through linked pairs in state object to find pairs associated with tokID
        for (let i = state[scriptName].links.length-1; i>-1; i--) {
            if (state[scriptName].links[i].controlTokID === tokID || state[scriptName].links[i].originTokID === tokID) {
                //get associated path objects and remove if they still exists
                let path;
                for (let p = 0; p < state[scriptName].links[i].pathIDs.length; p++) {
                    path = getObj('path',state[scriptName].links[i].pathIDs[p]);
                    if (path) {
                        path.remove();
                    } else {
                        //remove linked pair ids from state object (shouldn't ever get called, but here just in case)
                        state[scriptName].links.splice(i,1);
                    }
                }
                state[scriptName].links.splice(i,1);
            }
        }
        */
        //log(state[scriptName]);
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
    
    const parseArgs = function(msg) {
        msg.content = msg.content
            .replace(/<br\/>\n/g, ' ')
            .replace(/(\{\{(.*?)\}\})/g," $2 ")
        
        //Check for inline rolls
        inlineContent = processInlinerolls(msg);
        
        let args = inlineContent.split(/\s+--/).map(arg=>{
                let cmds = arg.split('|');
                return {
                    cmd: cmds.shift().toLowerCase().trim(),
                    params: cmds[0]
                };
            });
        return args;
    };
    
    const smartAoE_handleInput = function(msg) {
        var who;
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
        
        let pathstring;             //JSON string for wavefront paths
        let pathstring_old;         //JSON string for wavefront paths
        let polygon = [];           //array containing points of leading animated wavefront
        let polygon_old = [];       //array containing points of trailing animated wavefront
        
        let selectedID;             //selected token
        let playerID;               //which player called the script. Will determine who gets whispered results 
        let oTok;                   //origin token
        let validArgs = "range, aoetype, origin, mingridarea, mintokarea, fx";
        let convertRange = "";      //will we need to convert range from pixels to "u" or another page-defined distance unit?
        //var wavetype = 'circle';    //wavefront will either be circular or square
        let waveIncrement = 35;     //the spacing between waves, in pixels (lower number = slower wavefront)
        let waveDelay = 50;         //how much time to wait between each wave increment, in ms (higher number = slower wavefront)
        let waveLife = 200;         //how long each wave wil remain on screen, in ms (higher number = more waves present at any one time)
        let waveColor = '#ff0000';
        let tokLife = 2000;         //how long each "RadarPing" token wil remain on screen, in ms 
        let layers = ['objects', 'gmlayer'];    //the layersin which to look for tokens. Default values are overriden if --layers command is used 
        let filter = {              //optional filters for which tokens will be actively pinged
            type: "",               //types include "char" and "tok"
            attr: "",               //key to filter on. e.g. "npc_type" attribute for a character sheet, or "bar3" for a token filter
            vals: [],                //array of values for which to filter against filter.attr     e.g. ["celestial", "fiend", "undead"]
            colors: [],
            compareType: [],        //possible values: 'contains'(val is somewhere in string), '@'(exact match), '>' or '<' (numeric comparison)
            ignore: [],             //flag to determine if the value is an ignore filter or a positive match filter
            anyValueAllowed: false  //this flag will bypass normal checks. Used only for charFilters - The attribute just needs to exist in order for the token to be pinged 
        }
        let losBlocks = false;      //Will DL walls block radar sensor if completely obscured (will look at 5 pts per token to determine LoS)
        let title = "Radar Ping Results";             //title of the default template output
        let content = "";           //string value that will contain all the row content for default templates
        let displayOutput = true    //output results via sendChat (default template)
        var pageScaleNumber = 5;    //distance of one unit
        var pageScaleUnits = "ft";  //the type of units to use for the scale
        var pageGridIncrement = 1;  //how many gridlines per 70px
        let displayUnits = "u";         //output distances in "units" or use pageScaleUnits 
        let includeTotalDist = false;   //inlude the total range in the output, or just directional (X & Y distances)
        let hasSight = false;       //Will the RadarPing token grant temporary sight to the 
        let includeGM = false;      //Send a copy of the ouput to the GM chat if player calls script
        let seeAnimation = true;
        
        let gmToks = [];            //array of all tokens on GM layer
        let objToks = [];           //array of all tokens on object layer
        let wallToks = [];          //array of all tokens on walls (DL)  layer
        let mapToks = [];           //array of all tokens on map layer
        let allToks = [];           //concatenation of gmToks and allToks
        let tokIdDist = [];         //array of token(-ish) objects with properties {id, left, right, width, height, and dist to origin}
        let toksInRange = [];       //subset of allToks, thos ewithin range of origin token
        let padding = 20;           //ping object will be slightly larger than found tokens, to account for Roll20 zOrder "bug"
        let radius; 
        let originX;
        let originY;
        let originPt;
        let controlledby;
        let retVal = [];                //array of potential error messages to pass back to main smartAoE_handleInput funtion
        let filterExcludeOnly = false;  //wil be set to true if token filters only include "ignore" tags
        let useGrid = false;            //default background html setting 
        let useCircles = false;         //default background html setting
        let useRadial = false;          //default background html setting
        let outputGraph = false;        
        let outputTable = false;
        let outputCompact = false;       //set to true for single line table output - total distance will not be included in output. 
        let coneWidth = 360;
        let coneDirection = 0;
        let outputLines = [];
        let groupBy = true;             //if filters are used, group tokens by filter condition in table output
        let calcType = 'Euclidean';     //Can set to 'PF' to use the 'every-other-diagonal-counts-as-1.5-units' math (only for gridded maps)
        
        
        
        try {
            //----------------------------------------------------------------------------
            //   Optional script operation - clears linked pairs
            //      e.g.    !smartaoeclear tok    //clears all linked pairs associated with the selected token
            //              !smartaoeclear page    //clears all linked pairs on current page
            //              !smartaoeclear campaign    //clears all linked pairs in ENTIRE CAMPAIGN
            //----------------------------------------------------------------------------
            /*
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smartaoeclear")==0) {
                who = getObj('player',msg.playerid).get('_displayname');
                
                let cmd = msg.content.split(/\s+/);
                
                if (cmd.length > 1) {
                    
                    if (msg.selected !== undefined) {
                        tokID = msg.selected[0]['_id'];
                        tok = getObj("graphic",tokID);
                        pageID = tok.get('pageid');
                    }
                    
                    switch(cmd[1].toLowerCase()) {
                        case 'tok':
                            if (tokID) {
                                let clearTok = clearCache(who, tokID);
                            } else {
                                sendChat(scriptName,`/w "${who}" `+ 'Error. You must select a token to proceed with this command.');
                                return;
                            }
                            break;
                        case 'token':
                            if (tokID) {
                                let clearTok = clearCache(who, tokID);
                            } else {
                                sendChat(scriptName,`/w "${who}" `+ 'Error. You must select a token to proceed with this command.');
                                return;
                            }
                            break;
                        case 'page':
                            if (tokID) {
                                let clearTok = clearCache(who, undefined, pageID);
                            } else {
                                sendChat(scriptName,`/w "${who}" `+ 'Error. You must select a token to proceed with this command.');
                                return;
                            }
                            break;
                        case 'campaign':
                            let clear = clearCache(who);
                            break;
                        default:
                            sendChat(scriptName,`/w "${who}" `+ 'Unknown argument. Format is \"!smartAoEclear tok/page/campaign\"');
                            break;
                    }
                }
                return;
            }
            */
            
            
            //--------------------------------------------------------------------
            //   Rotate origin pt commands
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smartrotateorigin")==0) {
                who = getObj('player',msg.playerid).get('_displayname');
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
                        sendChat(scriptName,`/w "${who}" `+ 'You must select a token to proceed');
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
                    //log('aoeLinks follows');
                    //log(aoeLinks);
                    
                    if (aoeLinks.indices.length > 0) {
                        //for each link associated with selected token (could be originTok or controlTok)
                        for (let a=0; a<aoeLinks.indices.length; a++) {
                            //log(a);
                            //log('aoeLinks.links[a].originIndex = ' + aoeLinks.links[a].originIndex);
                            //log('aoeLinks.links[a].originPts.length = ' + aoeLinks.links[a].originPts.length);
                            //log('direction = ' + direction);
                            
                            //store pre-shifted origin pt coords
                            //oX = aoeLinks.links[a].originPts[aoeLinks.links[a].originIndex].x;
                            //oY = aoeLinks.links[a].originPts[aoeLinks.links[a].originIndex].y;
                            
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
                            //updateAoELink(aoeLinks.indices[a], aoeLinks.links[a].pathIDs, newIndex);
                            //log('local aoeLinks after updateAoELinks follows')
                            //log(aoeLinks)
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
            
            
            //--------------------------------------------------------------------
            //   Trigger AoE Effect
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smarttrigger")==0) {
                who = getObj('player',msg.playerid).get('_displayname');
                
                tok = getObj("graphic",msg.selected[0]._id);
                //log(tok);
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
                
                
                //let tempPath;
                //let fxType = 'burn-fire';
                if (aoeLinks.indices.length > 0) {
                    //for each link associated with selected token (could be originTok or controlTok)
                    for (let a=0; a<aoeLinks.indices.length; a++) {
                        
                        //Before iterating ALL page tokens over each the affected grid squares...
                            //...filter out tokens outside of the bounding box of the current set of affected grid squares
                        //log('checking AoE bounding box');
                        //log(aoeLinks.links[a].boundingBox);
                        //log(validToks[0].tok.get("left") + ',' + validToks[0].tok.get("top"));
                        //log(validToks.length + ' tok in validToks');
                        
                        let thisValidToks = validToks.filter(obj => {
                            //log(obj.tok.get("name"));
                            //log('obj.corners follows');
                            //log(obj.corners);
                            //log(aoeLinks.links[a].boundingBox);
                            
                            //omit origin token and any tokens that don't have at least one corner in the AoE bounding box
                            return obj.tok.get("_id") !== aoeLinks.links[a].originTokID & 
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
                        
                        //let minTokArea = 0.25;
                        for (let t=0; t<thisValidToks.length; t++) {
                            //log(thisValidToks[t].overlapArea + 'vs. threshold ' + aoeLinks.links[a].minTokArea*thisValidToks[t].area);
                            if (thisValidToks[t].overlapArea >= aoeLinks.links[a].minTokArea*thisValidToks[t].area) {
                                //log('tok in path!!!');
                                sendChat(scriptName,`/w "${who}" `+ 'Token In area: ' + thisValidToks[t].tok.get("name") + '('+thisValidToks[t].overlapArea+')');
                            }
                        }
                        
                    }
                }
                
            }
            
            
            //--------------------------------------------------------------------
            //   Normal script operation
            //--------------------------------------------------------------------
            if(msg.type=="api" && msg.content.toLowerCase().indexOf("!smartaoe")==0) {
                //log(msg);
                //Parse msg into an array of argument objects [{cmd:params}]
                let args = parseArgs(msg);
                args.shift();
                
                //assign values to our params arrray based on args
                args.forEach((arg) => {
                    let option = arg["cmd"].toLowerCase().trim();
                    let param = arg["params"].trim();
                    //log(args);
                    switch(option) {
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
                            } else if (w.includes('sq')) {
                                aoeType = 'square';
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
                        default:
                            retVal.push('Unexpected argument identifier (' + option + '). Choose from: (' + validArgs + ')');
                            break;    
                    }
                }); //end forEach arg
                
                who = getObj('player',msg.playerid).get('_displayname');
                
                //Token select or ID validation
                if (selectedID===undefined && msg.selected===undefined) {
                    sendChat(scriptName,`/w "${who}" `+ 'You must either select a token or pass the tokenID via --selectedID');
                    return;
                }
                //Get the origin token object from either msg or an explicitly defined tokenID
                if (selectedID===undefined) {
                    oTok = getObj("graphic",msg.selected[0]._id);
                } else {
                    //log(selectedID);
                    oTok = getObj("graphic",selectedID);
                }
                //Set controlledBy property of token to determine who can move the control token. Include all GMs
                if (playerID===undefined) {
                    controlledby = msg.playerid;
                } else {
                    controlledby = playerID;
                }
                
                //First data validation checkpoint
                if (retVal.length > 0) {
                    sendChat(scriptName,`/w "${who}" `+ retVal);
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
                            sendChat(scriptName,`/w "${who}" `+ 'Warning: Units \"u\" selected on a gridless map. Range will be calculated in pixels and will probably be much smaller than expected ');
                        } else {
                            range = (range * 70) / pageScaleNumber;
                        }
                    }
                }
                
                let spawnObj = getCharacterFromName(CONTROL_TOK_NAME);
                //log(spawnObj);
                if (spawnObj === undefined) {
                    sendChat(scriptName,`/w "${who}" Error: Character \"${CONTROL_TOK_NAME}\" must be in the journal with a default token `);
                    return;
                }
                spawnObj.get("_defaulttoken", async function(defaultToken) {
                    //controlTok = await spawnTokenAtXY(who, defaultToken, pageID, originX, originY, originWidth, originHeight, controlledby);
                    controlTok = await spawnTokenAtXY(who, defaultToken, pageID, originX, originY, 70*pageGridIncrement, 70*pageGridIncrement, controlledby);
                    //log(controlTok);
                    let pathstring = buildSquare(radius);
                    //log(pathstring);
                    //let path = createPath(pathstring, pageID, 'gmlayer', '#ff000050', '#000000', 2, controlTok.get("height"), controlTok.get("width"), controlTok.get("left"), controlTok.get("top"));
                    let path = createPath(pathstring, pageID, 'objects', '#ff000050', '#000000', 2, controlTok.get("height"), controlTok.get("width"), controlTok.get("left"), controlTok.get("top"));
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
                        //log('about to call makeAoELink');
                        //log(aoeType);
                        //log(range);
                        //log(originType);
                        //log(minGridArea);
                        let oPt = new pt(oTok.get('left'), oTok.get('top'))
                        let newLink = makeAoELink(aoeType, range, originType, oPt, minGridArea, minTokArea, oTok.get('_id'), controlTok.get('_id'), path.get('_id'), controlTok.get('_pageid'), fxType);
                        //log('makeAoELink complete');
                        //sendChat(scriptName,`/w "${who}" `+ 'Darkness created on Dynamic Lighting layer');
                    } else {
                        sendChat(scriptName,`/w "${who}" `+ 'Unknown error. createObj failed. AoE path not created.');
                        return;
                    }
                    //log('State after Spawned object')
                    //log(state[scriptName]);
                });
                
                
            }
        } 
        catch(err) {
          sendChat(scriptName,`/w "${who}" `+ 'Unhandled exception: ' + err.message);
        }
    };
    
    const registerEventHandlers = function() {
        on('chat:message', smartAoE_handleInput);
        on('change:graphic', smartAoE_handleTokenChange);
        on('destroy:graphic', smartAoE_handleRemoveToken);
        //on('destroy:path', smartAoE_handleRemovePath);
    };
 
    on("ready",() => {
        checkInstall();
        registerEventHandlers();
    });
})();

