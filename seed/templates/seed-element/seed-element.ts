/// <reference path="./all.d.ts" />

@component("seed-element")
class SeedElement extends polymer.Base {

  @property({ type: Boolean })
  /**
    * `fancy` indicates that the element should don a monocle and tophat,
    * while checking its pocket watch.
    */
  public fancy: boolean;

  @property({
    type: Object,
    value: () => {
      return {
        name: 'Dimitri Glazkov',
        image: 'http://addyosmani.com/blog/wp-content/uploads/2013/04/unicorn.jpg',
      };
    }
  })
  /**
    * Describes the author of the element, but is really just an excuse to
    * show off JSDoc annotations.
    *
    * @type {{name: string, image: string}}
    */
  public author: {name: String, image: String};

  constructor (

  ) {
    super();
  }

  // Element Lifecycle
  ready () {
    // `ready` is called after all elements have been configured, but
    // propagates bottom-up. This element's children are ready, but parents
    // are not.
    //
    // This is the point where you should make modifications to the DOM (when
    // necessary), or kick off any processes the element wants to perform.
  }

  attached () {
    // `attached` fires once the element and its parents have been inserted
    // into a document.
    //
    // This is a good place to perform any work related to your element's
    // visual state or active behavior (measuring sizes, beginning animations,
    // loading resources, etc).
  }

  detached () {
    // The analog to `attached`, `detached` fires when the element has been
    // removed from a document.
    //
    // Use this to clean up anything you did in `attached`.
  }

  // Element Behavior

  /**
   * The `wid-websocket-lasers` event is fired whenever `fireLasers` is called.
   *
   * @event wid-websocket-lasers
   * @detail {{sound: String}}
   */

  /**
   * Sometimes it's just nice to say hi.
   *
   * @param {string} greeting A positive greeting.
   * @return {string} The full greeting.
   */
  sayHello (greeting) {
    var response = greeting || 'Hello World!';
    return 'wid-websocket says, ' + response;
  }

  /**
   * Attempts to destroy this element's enemies with an any beam of light!
   *
   * Or, at least, dispatches an event in the vain hope that someone else will
   * do the zapping.
   */
  fireLasers () {
    this.fire('wid-websocket-lasers', { sound: 'Pew pew!' });
  }
}

SeedElement.register();
