//alert(document.referrer);
if(document.referrer == "http://localhost:3001/newsfeed" || document.referrer == "http://localhost:3001/secure"){
    //window.location.replace("http://localhost:3002/");
    
}
else{
    window.location.replace("http://localhost:3001/");
}


$.ajax({
                        url: "http://localhost:3002/loggedIn",
                        dataType: 'json',
                        type: 'GET',
                        success: function (data) {
                            
                            
                            
                        }
});