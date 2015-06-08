var req = createRequest();

// GIF animation of my portfolio
var animation = [
  "DRPP.gif",
  "jewels.gif",
  "rabin.gif",
  "kmeans.gif",
  "roboter.gif",
  "watchdog.gif",
  "stock.gif",
  "small.gif",
];

// my portfolio thumbnails 
var thumb = [
  "DRPP_thumb.gif",
  "jewels_thumb.gif",
  "rabin_thumb.gif",
  "kmeans_thumb.gif",
  "roboter_thumb.gif",
  "watchdog_thumb.gif",
  "stock_thumb.gif",
  "small_thumb.gif",
];

// do this function if the button 'page up' or 'page down' has been clicked
window.onpopstate = function(e){
  // reload the page according to its url
  if(e.state) load(e.state.url,"no history");
};

window.onpushstate = function(e){
  // reload the page according to its url
  if(e.state) load(e.state.url,"no history");
};

window.addEventListener("scroll", focus);

window.addEventListener("load",load);

//window.addEventListener("hashchange",hashchange);

/*function hashchange(){
  var href = window.location.hash;
  var index = href.lastIndexOf("!");
  if(index<0) index = href.lastIndexOf("#");
  href = href.substr(index+1,href.length);
  href = href.toLowerCase();
  load(href);
}*/

// Sorry, Internet Explore, I don't wanna support you.
function createRequest(){
  var req;
  if(window.XMLHttpRequest){
    try{req = new XMLHttpRequest();}
    catch(e){console.log(e)};
  }
  return req;
}

// reading files and parse the result to the  function
function handle(filename,callback){
  if(req){
    try{
      // it doesn't connect to the server by this, just setup.
      req.open("GET",filename,true);
      req.onreadystatechange = function(){
        // stage 1: connection established"; break;
        // stage 2: request recieved"; break;
        // stage 3: processing..."; break;
        // stage 4: means that your response is ready but you may requst a page doesn't exist, so you need the following checkout
        // google chrome ignores state 1
        // status = 200 means everything is fine
        if(req.readyState==4&&req.status==200){
          if(callback) callback(req.responseText);
        }
      };
      // only POST method needs to assign a parameter
      // so we use 'null' here because we are using GET method
      req.send(null);
    }catch(e){console.log(e);}
  }else console.log(req);
}

// change the font color of <h2> when activated
function focus(){
  var obj = document.getElementsByTagName("h2");
  for(var i=0;i<obj.length;i++){
    if(obj[i]){
      if(shown(obj[i])){
        obj[i].style.color = "#C30";
      }else obj[i].style.color = "";
    }
  }
}

// start GIF animation if the thumbnail is in active region
function startAnimation(){
  var img  = document.getElementsByClassName("demo");
  for(var i=0;i<img.length;i++){
    if(shown(img[i])){
      if(!equal(img[i],animation[i])){
        img[i].src = "/img/portfolio/" + animation[i];
      }
    }else img[i].src = "/img/portfolio/" + thumb[i];
  }
}

// compare two images' url
function equal(img,src){
  var token = img.src.split("/");
  if(token[token.length-1]==src) return true;
  else return false;
}

// determine if the target is shown on active region of the window
function shown(e){

  var appear = false;
  // once 50% of an object is in the active region, it is regarded as shown. 
  var offset = e.offsetTop+(0.5*e.clientHeight);

  // firefox and IE9 accept this
  var scroll = document.documentElement.scrollTop;
  // for safari and chrome
  if(scroll==0) scroll = document.body.scrollTop;

  var screen = window.innerHeight;

  // define the active region to be 10% after the top to 82% of the bottom
  // since 85% is too big, 80% is too small, I just pick up a random value from them.
  if(scroll+(0.1*screen)<offset){
    if(scroll+(0.82*screen)>offset){
      appear = true;
    }
  }
  return appear;
}

function hashchange(){
  var href = window.location.hash;
  var index = href.lastIndexOf("!");
  if(index<0) index = href.lastIndexOf("#");
  href = href.substr(index+1,href.length);
  href = href.toLowerCase();
  load(href);
}

// load contents according to the target. ajax can't work properly without this function.
function load(target,popstate){
  var url = window.location.href;
  var valid = false;
  var list = ["Welcome","Papers","Resume","Portfolio","Links"];
  if(!target.length){
    if(url.lastIndexOf("/")>0){
      target = url.substr(url.lastIndexOf("/")+1,url.length);
    }valid = true;
  }

  if(target==""||target=="."){
    if(!popstate) history.pushState({url:"."},"",".");
    document.title = "PDIN";
    target = "welcome";
    valid = true;
  }else{
    valid = false;
    for(var i=0;i<list.length;i++){
      if(target==list[i].toLowerCase()){
        if(!popstate) history.pushState({url:target},"",target);
        document.title = "PDIN - "+list[i];
        valid = true;
      }
    }
  }
  if(valid){
    handle(target+".html",function(result){
      document.getElementById("content").innerHTML = result;
      document.removeEventListener("scroll", startAnimation);
      // remove old appending scripts before appending new one
      removeExternalJS(loadExternalJS);
      focus();
    });
  }//else window.location.replace("/404.html"); 

}

function removeExternalJS(callback){
  var script = document.getElementsByClassName("external");
  for(var i=0;i<script.length;i++){
    // fundamental js is [0~2] + external [3]
    // remove other old appending scripts
    script[i].parentElement.removeChild(script[i]);
  }
  if(callback) callback();
}

function loadExternalJS(callback){
  var head = document.getElementsByTagName("head")[0];
  var script = document.getElementById("content").getElementsByTagName("script");
  for(var i=0;i<script.length;i++){
    var externalScript = document.createElement("script");
    externalScript.className = "external";
    externalScript.innerHTML = script[i].innerHTML;
    head.appendChild(externalScript);
  }
  if(callback) callback();
}