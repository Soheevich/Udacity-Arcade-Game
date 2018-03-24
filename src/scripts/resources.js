/* eslint-env browser */

/* Resources.js
 * This is simply an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function IIFE() {
  const resourceCache = {};
  const promises = [];
  const readyCallbacks = [];

  /* This is the publicly accessible image loading function. It accepts
   * an array of strings pointing to image files or a string for a single
   * image. It will then call our private image loading function accordingly.
   */
  function load(...urls) {
    /* If the developer passed in an array of images or single image
     * loop through each value and call our image loader on that image file
     * Then push returned promise to the promises array
     */
    urls.forEach(url => promises.push(privateLoad(url)));

    // This function determines if all of the images that have been requested
    // for loading have in fact been properly loaded.
    Promise.all(promises).then(() => {
      readyCallbacks.forEach(func => func());
    });
  }

  // Creating a new promise to wait until an image is loaded
  const checkImage = url =>
    new Promise((resolve) => {
      const img = document.createElement('img');
      img.src = url;
      img.onload = () => resolve(img);
      // img.onerror = () => resolve(img);
    });

  /* This is our private image loader function, it is
   * called by the public image loader function.
   */
  function privateLoad(url) {
    if (resourceCache[url]) {
      /* If this URL has been previously loaded it will exist within
       * our resourceCache array. Just return that image rather
       * re-loading the image.
       */
      return resourceCache[url];
    }

    // Once our image has properly loaded, add it to our cache
    // so that we can simply return this image if the developer
    // attempts to load this file in the future.
    return checkImage(url)
      .then((img) => {
        resourceCache[url] = img;
      });
  }

  /* This is used by developers to grab references to images they know
   * have been previously loaded. If an image is cached, this functions
   * the same as calling load() on that URL.
   */
  function get(url) {
    return resourceCache[url];
  }

  /* This function will add a function to the callback stack that is called
   * when all requested images are properly loaded.
   */
  function onReady(func) {
    readyCallbacks.push(func);
  }

  /* This object defines the publicly accessible functions available to
   * developers by creating a global Resources object.
   */
  window.Resources = {
    load,
    get,
    onReady,
  };
}());