
// sample.js
// ------------------------------------------------------------------------------------------------
// Ajax function to call server for JSON data, runs with a setInterval() with a delay of 10 seconds
// when the Firefox browser is started. An alert message prints the title of JSON message parsed. 
//
// This functionality demonstrated is a call to an JSON stream that sends JSON messages, the message 
// gets parsed and the data is accessible 
//
// Author: Kevin T. Lee
// ------------------------------------------------------------------------------------------------

// onPageLoad has to be put at the front of the JS document
var myExtension = {
    init: function() {
        // The event can be DOMContentLoaded, pageshow, pagehide, load or unload.
        if(gBrowser) gBrowser.addEventListener("DOMContentLoaded", this.onPageLoad, false);
    },
    onPageLoad: function(aEvent) {
        var doc = aEvent.originalTarget; // doc is document that triggered the event
        var win = doc.defaultView; // win is the window for the doc


        //--Calls ajaxCall() -- intervaled to call every 10 seconds
        ajaxCall();
        
    }
}

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    myExtension.init(); 
},false);

// Loads jQuery
var jsLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
jsLoader.loadSubScript("chrome://content/js/jquery-2.0.1.js");


// Uses jquery
function highlight(){

    var htmlDocument = top.document.getElementById('content').selectedBrowser.contentDocument;
    var doc = htmlDocument.wrappedJSObject; //Should be working with HTMLDocument Object -- if not get it. 

    var $j = jQuery.noConflict(); //redefine variable to use $j to call jQuery
    $j("#copyright", doc).css("background-color", "yellow"); //Test on Aerospace Login Home Screen
    alert("highlighted");  //Alert to user that the function has been called, highlight has been made.
}

// onPageLoad in myExtension will execute ajaxCall()
function ajaxCall(){
    //alert("hello ajax called");

    var titleArray = new Array();

    $.ajax({
        url : 'http://earthquake-report.com/feeds/recent-eq?json',
        type : 'GET',
        dataType : 'json',
        timeout : 10000,
        }).success(function (data) {
            var obj = data;
            //print(obj);
            $.each(obj, function (i, item) {
                titleArray.push(obj[i].title);
            });

            alert(titleArray[0]);

        }).error(function (data) {
            console.log("Error with data: " + data);
        }).complete(function () {
            setInterval(function(){ajaxCall()},10000); //sets interval after first completion of running ajaxCall()
        });
}

