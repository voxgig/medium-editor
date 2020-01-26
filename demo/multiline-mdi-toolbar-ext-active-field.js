/* Derived from https://github.com/tomchentw/medium-editor-tc-mention */

var ActiveField = MediumEditor.Extension.extend({
  name: 'activefield',
  trigger: '#',
  classname: 'active-field',
  currentclassname: 'current-active-field',
  tagname: 'strong',
  fieldattrsuffix: 'field-name',
  
  is_fieldname: function(fieldname) {
    return false
  },
  provide_field_value: function(word, done) {
    done(null, {value:'['+word.fieldname+']'})
  },
  
  init: function() {
    console.log('AF INIT')

    var self = this

    self.subscribe('editableKeyup', self.handleKeyup.bind(self))
  },

  handleKeyup: function(event) {
    const keyCode = MediumEditor.util.getKeyCode(event)
    const isSpace = keyCode === MediumEditor.util.keyCode.SPACE
    var word = this.getWordFromSelection(event.target, isSpace ? -1 : 0);  
    console.log('AF KEYUP', this.trigger, keyCode, isSpace, word)

    if(this.trigger === word.trigger) {
      var is_fieldname = this.is_fieldname(word.fieldname, word)
      var is_wrapped = this.is_wrapped()

      console.log('AF KEYUP T', is_fieldname, is_wrapped)

      if(is_fieldname && !is_wrapped) {
        this.handle_field(word)
      }
      else if(!is_fieldname && is_wrapped) {
        this.unwrap_text(word)
      }
    }
  },

  handle_field: function(word) {
    var self = this
    console.log('AF TW', word)
    self.provide_field_value(word, function(err,field) {
      console.log('AF PFV', err, field)
      if(!err) {
        var element = self.wrap_active_field(word, field)
      }
    })
  },

  
  is_wrapped: function() {
    const selection = this.document.getSelection();
    if (!selection.rangeCount) {
      return true; // can't be wrapped, so don't do it
    }

    const range = selection.getRangeAt(0).cloneRange();
    var wrapped = range.startContainer.parentNode.classList.contains(this.classname)

    return wrapped
  },
  

  wrap_active_field: function(word, field) {
    console.log('AF IAF', word, field)

    const selection = this.document.getSelection();

    var element = null
    
    // http://stackoverflow.com/a/6328906/1458162
    const range = selection.getRangeAt(0).cloneRange();

    const nextWordEnd = Math.min(word.wordEnd, range.startContainer.textContent.length);
    range.setStart(range.startContainer, word.wordStart);
    range.setEnd(range.startContainer, nextWordEnd);

    var element = this.document.createElement(this.tagname);
    element.classList.add(this.classname);
    range.surroundContents(element);

    element.setAttribute('data-'+this.fieldattrsuffix, word.fieldname)
    element.innerText = field.value
    
    console.log('AF WAF EL', element)
    return element
  },


  unwrap_text: function(word) {
    console.log('AF UNWRAP', word)

    const selection = this.document.getSelection();
    
    // http://stackoverflow.com/a/6328906/1458162
    const range = selection.getRangeAt(0).cloneRange();
    var element = range.startContainer.parentNode
    var text = element.innerText

    element.parentNode.replaceChild(document.createTextNode(text),element)

    //selection.removeAllRanges();
  },

  
  getWordFromSelection: function(target, initialDiff) {
    const {
      startContainer,
      startOffset,
      endContainer,
    } = MediumEditor.selection.getSelectionRange(this.document);
    if (startContainer !== endContainer) {
      return;
    }
    const { textContent } = startContainer;

    function getWordPosition(position, diff) {
      const prevText = textContent[position - 1];
      if (prevText === null || prevText === undefined) {
        return position;
      } else if (prevText.trim().length === 0 || position <= 0 || textContent.length < position) {
        return position;
      } else {
        return getWordPosition(position + diff, diff);
      }
    }

    var word = {}
    
    word.wordStart = getWordPosition(startOffset + initialDiff, -1);
    word.wordEnd = getWordPosition(startOffset + initialDiff, 1) - 1;
    word.word = textContent.slice(word.wordStart, word.wordEnd);
    word.trigger = word.word.slice(0, 1);
    word.fieldname = word.word.substring(1)
    
    return word
  },
})

