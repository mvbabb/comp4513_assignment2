//alert(document.referrer);
if(document.referrer == "http://localhost:3001/" || document.referrer == "http://localhost:3001/secure"){
    //window.location.replace("http://localhost:3002/");
    
}
else{
    window.location.replace("http://localhost:3001/");
}
