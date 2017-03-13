
$.getJSON("http://localhost:3002/user_info", function(data){
   data = JSON.stringify(data);
    data = JSON.parse(data);
    var user ="";
    for(var x = 1; x < (Object.keys(data).length +1); x++){
        var user = "user" + x;        
        //alert(data[user].logToken);
        if(data[user].logToken == "true"){
            break;
        }   
    }
    $("#userLevel").append(data[user].level);
    $("#userName").append(window.atob(data[user].user_name));
    $("#u_name").append(data[user].name);
});


$.getJSON("http://localhost:3002/app_list", function(data){
    data = JSON.stringify(data);
    data = JSON.parse(data);
    for(x in data){
        $(".appSelector").append('<option value="'+ x +'">'+ x +'</option>');
    }  
}
          );

$.getJSON("http://localhost:3002/user_info", function(data){
   data = JSON.stringify(data);
    data = JSON.parse(data);
    var user ="";
    var index = 1;
    for(x in data){
        user = "user" + index;  
        $("#userToRemove").append('<option value="'+ x +'">'+ window.atob(data[user].user_name) +'</option>');
        index++;
        
    }

});
$.getJSON("http://localhost:3002/user_info", function(data){
   data = JSON.stringify(data);
    data = JSON.parse(data);
        var user ="";
    var index = 1;
    for(x in data){
        user = "user" + index; 
        $("#userToModify").append('<option value="'+ x +'">'+ x + " - " + window.atob(data[user].user_name) +'</option>');
        index++;
        
    }

});






