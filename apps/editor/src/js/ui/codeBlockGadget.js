/**
 * @fileoverview Implements UI code block gadget
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import css from 'tui-code-snippet/domUtil/css';
import addClass from 'tui-code-snippet/domUtil/addClass';

import BlockOverlay from './blockOverlay';
import domUtils from '../utils/dom';

const GADGET_RIGHT = 26;
const GADGET_WIDTH = 250;
const GADGET_HEIGHT = 30;

/**
 * Class CodeBlockGadget
 * @param {Object} options - options
 *     @param {EventManager} options.eventManager - event manager instance
 *     @param {HTMLElement} options.container - container element
 *     @param {WysiwygEditor} options.wysiwygEditor - wysiwyg editor instance
 * @ignore
 */
class CodeBlockGadget extends BlockOverlay {
  constructor({ eventManager, container, wysiwygEditor }) {
    super({
      eventManager,
      container,
      attachedSelector: 'pre'
    });

    this._wysiwygEditor = wysiwygEditor;
    this._popupCodeBlockLanguages = null;

    this._initDOM();
    this._initDOMEvent();
  }

  _initDOM() {
    addClass(this.el, 'code-block-header');

    this._languageLabel = domUtils.createElementWith('<span>text</span>');
    domUtils.append(this.el, this._languageLabel);
    this._languageLabel.addEventListener('dblclick', () => {
      const cbManager = this._wysiwygEditor.componentManager.getManager('codeblock');
      const pre = this.getAttachedElement();
      const v0 = pre.getAttribute('data-language');
      const v1 = window.prompt('Language', v0);

      if (v1) {
        pre.setAttribute('data-language', v1);
        pre.querySelector('*').setAttribute('data-language', v1);
        this._updateLanguage();
        cbManager.modifyCodeBlockForWysiwyg(pre);
      }
    });
  }

  _initDOMEvent() {}

  _openPopupCodeBlockEditor() {
    this._eventManager.emit('openPopupCodeBlockEditor', this.getAttachedElement());
  }

  _updateLanguage() {
    const attachedElement = this.getAttachedElement();
    const language = attachedElement ? attachedElement.getAttribute('data-language') : null;

    this._languageLabel.textContent = language || 'text';
  }

  /**
   * update gadget position
   * @protected
   * @override
   */
  syncLayout() {
    const attachedElement = this.getAttachedElement();
    const { top } = domUtils.getOffset(attachedElement, '.te-editor');

    css(this.el, {
      top: `${top}px`,
      right: `${GADGET_RIGHT}px`,
      width: `${GADGET_WIDTH}px`,
      height: `${GADGET_HEIGHT}px`
    });
  }

  /**
   * on show
   * @protected
   * @override
   */
  onShow() {
    super.onShow();

    this._onAttachedElementChange = () => this._updateLanguage();
    this._eventManager.listen('changeLanguage', this._onAttachedElementChange);

    this._updateLanguage();
  }

  /**
   * on hide
   * @protected
   * @override
   */
  onHide() {
    this._eventManager.removeEventHandler('changeLanguage', this._onAttachedElementChange);

    super.onHide();
  }
}

export default CodeBlockGadget;
