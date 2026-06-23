(function() {
  var isNative = false;
  try {
    if (window.Capacitor && window.Capacitor.isNativePlatform()) isNative = true;
  } catch(e) {}
  if (!isNative) {
    window.CapacitorBridge = { isNative: false };
    return;
  }

  var P = window.Capacitor.Plugins;
  var bridge = {
    isNative: true,

    biometricAuth: function(reason) {
      return P.NativeBiometric.verifyIdentity({
        reason: reason || 'Verify your identity',
        title: 'Biometric Login',
        subtitle: 'Use your fingerprint or face to sign in'
      });
    },

    checkBiometrics: function() {
      return P.NativeBiometric.isAvailable();
    },

    getCredentials: function() {
      return P.NativeBiometric.getCredentials({ server: 'ameris-global' });
    },

    setCredentials: function(username, password) {
      return P.NativeBiometric.setCredentials({
        server: 'ameris-global',
        username: username,
        password: password
      });
    },

    deleteCredentials: function() {
      return P.NativeBiometric.deleteCredentials({ server: 'ameris-global' });
    },

    takePhoto: function() {
      return P.Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: 'DataUrl',
        saveToGallery: false
      }).then(function(result) { return result.dataUrl; });
    },

    pickImage: function() {
      return P.Camera.pickImages({
        quality: 85,
        limit: 1,
        resultType: 'DataUrl'
      }).then(function(result) { return result.photos[0] ? result.photos[0].dataUrl : null; });
    },

    showToast: function(msg) {
      return P.Toast.show({ text: msg, duration: 'short', position: 'bottom' });
    },

    haptics: function(type) {
      if (type === 'success') P.Haptics.notification({ type: 'success' });
      else if (type === 'error') P.Haptics.notification({ type: 'error' });
      else if (type === 'warning') P.Haptics.notification({ type: 'warning' });
      else P.Haptics.impact({ style: 'medium' });
    },

    setStatusBar: function(dark) {
      return P.StatusBar.setStyle({ style: dark ? 'DARK' : 'LIGHT' });
    },

    getNetworkStatus: function() {
      return P.Network.getStatus();
    },

    openInBrowser: function(url) {
      return P.Browser.open({ url: url, presentationStyle: 'fullscreen' });
    },

    downloadFile: function(filename, content) {
      return P.Filesystem.writeFile({
        path: filename,
        data: content,
        directory: 'DOCUMENTS'
      });
    },

    readFile: function(filename) {
      return P.Filesystem.readFile({
        path: filename,
        directory: 'DOCUMENTS'
      }).then(function(r) { return r.data; });
    },

    getDeviceInfo: function() {
      return P.App.getInfo();
    }
  };

  window.CapacitorBridge = bridge;
  document.documentElement.classList.add('capacitor-native');

  bridge.setStatusBar(document.documentElement.getAttribute('data-theme') === 'dark');

  var observer = new MutationObserver(function() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    bridge.setStatusBar(isDark);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  bridge.haptics('success');
})();
