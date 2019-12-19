var InsertImageButton = MediumEditor.extensions.button.extend({
  name: 'insertImage',
  action: 'insertImage',
  aria: 'insert image',
  //tagNames: ['img'],
  contentDefault: 'IMG',
  contentFA: '<i class="fa fa-picture-o"></i>',
  contentMI: '<i class="material-icons">add_photo_alternate</i>',

  init: function () {
    MediumEditor.extensions.button.prototype.init.call(this);
  },

  handleClick: function (event) {
    var base = this.base
    console.log('CLICK insertImage', event, base)
    //this.classApplier.toggleSelection();
    //this.base.checkContentChanged();

    //var src = this.options.contentWindow.getSelection().toString().trim();
    var src = 'https://loremflickr.com/640/360/x0'
    base.options.ownerDocument.execCommand('insertImage', false, src);

  }
})

var editor = new MediumEditor('.editable', {
  extensions: {
    'insertImage': new InsertImageButton()
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

