var H5PEditor = H5PEditor || {};

H5PEditor.widgets.branchingQuestion = H5PEditor.BranchingQuestion = (function ($, EventDispatcher) {

  function BranchingQuestionEditor(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params || {};
    this.setValue = setValue;

    // Inherit event system
    EventDispatcher.call(this);

    this.passReadies = true;
    this.ready = function (ready) {
      this.parent.ready(ready);
    };


    this.appendTo = function ($wrapper) {
      this.$wrapper = $wrapper;
      this.$editor = $('<div>', {
        'class': 'h5p-editor-branching-question',
      });

      H5PEditor.processSemanticsChunk(
        this.field.fields,
        this.params,
        this.$editor,
        this
      );

      this.setValue(this.field, this.params);
      $wrapper.append(this.$editor);
    };

    this.setNextContentId = function (listIndex, nextContentId) {
      var nextContentIds = this.$editor[0].querySelectorAll('.field-name-nextContentId');
      var input = nextContentIds[listIndex].querySelector('.h5peditor-text');
      input.value = nextContentId;
      input.dispatchEvent(new Event('change'));
      this.setValue(this.field, this.params);
    };

    this.setAlternatives = function (addHtmlCallback) {
      var listIndex = this.field.fields.findIndex(function (field) {
        return field.name === 'alternatives';
      });
      var list = this.children[listIndex];
      list.on('addedItem', function () {
        this.replaceContentIdWithSelector(addHtmlCallback);
      }.bind(this));

      this.replaceContentIdWithSelector(addHtmlCallback);
    };

    this.replaceContentIdWithSelector = function (addHtmlCallback) {
      var nextContentIds = this.$editor[0].querySelectorAll('.field-name-nextContentId');
      for (var i = 0; i < nextContentIds.length; i++) {

        var nextContentId = nextContentIds[i];

        // Skip if already handled
        if (nextContentId.style.display === 'none') {
          continue;
        }

        // Hide next content id fields
        nextContentId.style.display = 'none';

        var input = nextContentId.querySelector('.h5peditor-text');
        var nextContentIdValue = input.value;
        var selectorWrapper = document.createElement('div');
        selectorWrapper.classList.add('h5p-next-branch-wrapper');
        nextContentId.parentNode.insertBefore(selectorWrapper, nextContentId);
        addHtmlCallback(nextContentIdValue, selectorWrapper, i);
      }
    };

    this.remove = function () {
      if (this.$editor) {
        this.$editor.remove();
      }
    };

    /**
     * Always valid
     *
     * @returns {boolean}
     */
    this.validate = function () {
      var valid = true;
      for (var i = 0; i < this.children.length; i++) {
        valid = valid && this.children[i].validate();
      }
      return valid;
    };
  }

  return BranchingQuestionEditor;
})(H5P.jQuery, H5P.EventDispatcher);
