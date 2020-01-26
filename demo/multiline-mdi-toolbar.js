
var fieldnames = {
  title: true,
}


var editor = new MediumEditor('.editable', {
  extensions: {
    'insertImage': new InsertImageButton(),
    'activefield': new ActiveField({
      trigger: '@',
      tagname: 'span',
      is_fieldname: function(fieldname) {
        return !!fieldnames[fieldname]
      } 
    })
  },
  toolbar: {
    buttons: [
      ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'pre', 'quote'],
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'fontname', 'fontsize'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'outdent', 'indent', 'orderedlist', 'unorderedlist'],
      ['anchor', 'insertImage', 'removeFormat'],
    ],
  },
  buttonLabels: 'material'
});

cssLink = document.getElementById('medium-editor-theme');

document.getElementById('sel-themes').addEventListener('change', function () {
  cssLink.href = '../dist/css/' + this.value + '.css';
});


editor.subscribe('selectFont', function() {
  console.log('EVENT selectFont', arguments)
})
