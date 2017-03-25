
       $(document).ready(function(){
            
                      $('#btnSubmit').click(function(){
                          
                        var un=$('#uname').val();
                        var pw=$('#unpwd').val();
                          
                          $.post("localhost:3002",{"un":un,"pw":pw},function(data){
                              console.log(data);
                              console.log("Posted the login request");
                            $.post("localhost:3001/info",{"un":un/*,"pw":pw*/},function(data){
                              
                              console.log("Looking for dat data");
                          })
                          
                          })

                          
                          console.log("user:" + un + " pass:" + pw);
                          
                         
        console.log("worked");
    });
                      
                      });