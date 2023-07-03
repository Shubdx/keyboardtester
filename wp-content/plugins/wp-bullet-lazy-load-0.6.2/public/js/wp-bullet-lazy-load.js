(function () {
  window.WPB_LL = window.WPB_LL || {
    lazyClass: "wp-bullet-lazy-load",
    loadedClass: "wp-bullet-lazy-loaded",
    expand: 500,
  };

  window.lazySizesConfig = window.lazySizesConfig || {};

  // eslint-disable-next-line no-undef
  window.lazySizesConfig.lazyClass = WPB_LL.lazyClass;

  // eslint-disable-next-line no-undef
  window.lazySizesConfig.loadedClass = WPB_LL.loadedClass;

  // eslint-disable-next-line no-undef
  window.lazySizesConfig.loadingClass = "wp-bullet-lazy-loading";

  // eslint-disable-next-line no-undef
  window.lazySizesConfig.expand = parseInt(WPB_LL.expand);
})();
