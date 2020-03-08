
    var mydragg = function() {

        return {
            move: function(divid, xpos, ypos) {
                // console.log('Move Return' + evt.path[0].type);
                divid.style.left = xpos + 'px';
                divid.style.top = ypos + 'px';
            },
            startMoving: function(divid, container, evt) {

                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    divTop = divid.style.top,
                    divLeft = divid.style.left,
                    eWi = parseInt(divid.style.width),
                    eHe = parseInt(divid.style.height),
                    cWi = parseInt(document.getElementById(container).style.width),
                    cHe = parseInt(document.getElementById(container).style.height);
                document.getElementById(container).style.cursor = 'move';
                divTop = divTop.replace('px', '');
                divLeft = divLeft.replace('px', '');
                var diffX = posX - divLeft,
                    diffY = posY - divTop;
                document.onmousemove = function(evt) {

                    //this ensures that you can't move while selecting text, its not perfect but it works
                    if (evt.path[0].type == undefined) {

                        evt = evt || window.event;
                        var posX = evt.clientX,
                            posY = evt.clientY,
                            aX = posX - diffX,
                            aY = posY - diffY;
                        if (aX < 0) aX = 0;
                        if (aY < 0) aY = 0;
                        if (aX + eWi > cWi) aX = cWi - eWi;
                        if (aY + eHe > cHe) aY = cHe - eHe;
                        mydragg.move(divid, aX, aY);
                    }
                }
            },
            stopMoving: function(container) {
                //   console.log('Event stops moving' + evt.path[0].type);
                var a = document.createElement('script');
                document.getElementById(container).style.cursor = 'default';
                document.onmousemove = function() {}
            },
        }
    }();


    var mydragg2 = function() {
        return {
            move: function(divid2, xpos, ypos) {

                divid2.style.left = xpos + 'px';
                divid2.style.top = ypos + 'px';
            },
            startMoving: function(divid, container, evt) {

                console.log(divid);

                var divid2 = document.getElementById(divid);


                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    divTop = divid2.style.top,
                    divLeft = divid2.style.left,
                    eWi = parseInt(divid2.style.width),
                    eHe = parseInt(divid2.style.height),
                    cWi = parseInt(document.getElementById(container).style.width),
                    cHe = parseInt(document.getElementById(container).style.height);
                document.getElementById(container).style.cursor = 'move';
                divTop = divTop.replace('px', '');
                divLeft = divLeft.replace('px', '');
                var diffX = posX - divLeft,
                    diffY = posY - divTop;
                document.onmousemove = function(evt) {
                    evt = evt || window.event;
                    var posX = evt.clientX,
                        posY = evt.clientY,
                        aX = posX - diffX,
                        aY = posY - diffY;
                    if (aX < 0) aX = 0;
                    if (aY < 0) aY = 0;
                    if (aX + eWi > cWi) aX = cWi - eWi;
                    if (aY + eHe > cHe) aY = cHe - eHe;
                    mydragg2.move(divid2, aX, aY);
                }
            },
            stopMoving: function(container) {
                var a = document.createElement('script');
                document.getElementById(container).style.cursor = 'default';
                document.onmousemove = function() {}
            },
        }
    }();

    /*    connectedToSocket = function() {
           document.getElementById("welcome").innerHTML = '';
           document.getElementById("welcome").innerHTML += "Socket: Connected";
       }

       disconnectedToSocket = function() {
           document.getElementById("welcome").innerHTML = '';
           document.getElementById("welcome").innerHTML += "Socket: Disconnected";
       } */

    /*   connectedToBeam = function() {
          //todo add connection icon
          document.getElementById("beamConnection").innerHTML = '';
          document.getElementById("beamConnection").innerHTML += "Beam: Connected";
      } */

    /*     disconnectedToBeam = function() {
            //todo add connection icon
            document.getElementById("beamConnection").innerHTML = '';
            document.getElementById("beamConnection").innerHTML += "Beam: Not Authenticated";
        } */
