$(document).ready(function(){
  
    /* 1. Visualizing things on Hover - See next part for action on click */
    $('.fa').on('mouseover', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
      console.log("mouseover");
     
      // Now highlight all the stars that's not after the current hovered star
      $(this).parent().children().each(function(e){
        if (e < onStar) {
          $(this).addClass('hover');
        }
        else {
          $(this).removeClass('hover');
        }
      });
      
    }).on('mouseout', function(){
      $(this).parent().children().each(function(e){
        $(this).removeClass('hover');
      });
    });
    
    
    /* 2. Action to perform on click */
    $('.fa').on('click', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently selected
      var stars = $(this).parent().children();
      
      for (i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('checked');
      }
      
      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass('checked');
        console.log(onStar);
        $("#rated").text("You rated this video " + onStar + " stars");
      }
      
      
    });
    
    
  });
  