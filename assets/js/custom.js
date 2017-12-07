$(document).ready(function() {
  $("[data-toggle=popover]").each(function(i, obj) {

    $(this).popover({
      html: true,
      content: function() {
        var id = $(this).attr('id')
        return $('#popover-content-' + id).html();
      }
    });

  });
  $(".anch").hover(function() {

    $(this).closest('.wrap').find('.mybutton').show();
  });
  $(".anch").hover(function() {

    $(this).closest('.wrap').find('.mybutton').show();
  });
  $(".mybutton").mouseleave(function() {
    $(this).closest('.wrap').find('.mybutton').hide();
  });
  //for tooltip
  $('[data-toggle="tooltip"]').tooltip()
    
});

$('li').popover();
$('li').popover({ trigger: "hover" });

