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
        this,
        (parent.currentLibrary || '')
      );

      this.setValue(this.field, this.params);
      $wrapper.append(this.$editor);
    };

    /**
     * Update next content id field
     *
     * @param listIndex
     * @param nextContentId
     */
    this.setNextContentId = function (listIndex, nextContentId) {
      var nextContentIds = this.$editor[0].querySelectorAll('.field-name-nextContentId');
      var input = nextContentIds[listIndex].querySelector('.h5peditor-text');
      input.value = nextContentId;
      input.dispatchEvent(new Event('change'));
      this.setValue(this.field, this.params);

      var alternativeWrapper = input.closest('.content');
      if (parseInt(nextContentId) === -1) {
        alternativeWrapper.classList.remove('hide-score');
      }
      else {
        alternativeWrapper.classList.add('hide-score');
      }
    };

    /**
     * Set available alternatives that will replace the number field for
     * next content id.
     *
     * @param addHtmlCallback
     */
    this.setAlternatives = function (addHtmlCallback) {
      var listIndex = this.field.fields.findIndex(function (field) {
        return field.name === 'alternatives';
      });
      var list = this.children[listIndex];
      list.on('addedItem', function () {
        this.replaceContentIdWithSelector(addHtmlCallback);
        this.addFeedbackGroupDescription();
      }.bind(this));

      this.replaceContentIdWithSelector(addHtmlCallback);
      this.addFeedbackGroupDescription();
    };

    /**
     * Add feedback group description for each alternative.
     */
    this.addFeedbackGroupDescription = function () {
      const feedbackGroups = this.$editor[0].querySelectorAll('.field-name-feedback');
      for (let i = 0; i < feedbackGroups.length; i++) {
        const feedbackGroup = feedbackGroups[i];

        // Skip descriptions that have already been added
        if (feedbackGroup.querySelector('.h5p-feedback-description')) {
          continue;
        }

        const description = document.createElement('div');
        description.classList.add('h5p-feedback-description');
        description.classList.add('h5peditor-field-description');
        description.textContent = 'It is recommended to provide feedback that motivates and also provides guidance. Leave all fields empty if you don\'t want the user to get feedback after choosing this alternative/viewing this content.';

        const groupWrapper = feedbackGroup.querySelector('.content');
        groupWrapper.prepend(description);
      }
    };

    /**
     * Replaces next content id number field with a selector of available alts
     *
     * @param addHtmlCallback
     */
    this.replaceContentIdWithSelector = function (addHtmlCallback) {
      var nextContentIds = this.$editor[0].querySelectorAll('.field-name-nextContentId');
      for (var i = 0; i < nextContentIds.length; i++) {

        var nextContentId = nextContentIds[i];

        var selectorWrapper;
        if (nextContentId.style.display === 'none') {
          // Already handled, update DOM
          selectorWrapper = nextContentId.parentNode.querySelector('.h5p-next-branch-wrapper');
        }
        else {
          // Hide next content id fields
          nextContentId.style.display = 'none';

          selectorWrapper = document.createElement('div');
          selectorWrapper.classList.add('h5p-next-branch-wrapper');
          nextContentId.parentNode.insertBefore(selectorWrapper, nextContentId);
        }

        addHtmlCallback(i, selectorWrapper);
      }
    };

    /**
     * Remove widget from DOM
     */
    this.remove = function () {
      if (this.$editor) {
        this.$editor.remove();
      }
    };

    /**
     * Validate all children
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
