$(document).ready(function(){

  if($('.datePicker').length > 0){
    $('.datePicker').datetimepicker(
        {language: 'nb',
          pickTime: false
        }
    );
  }

});